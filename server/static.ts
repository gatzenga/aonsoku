import { stat } from 'node:fs/promises'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path from 'node:path'
import { sendFile, sendJson } from './http.ts'

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function cacheControlFor(relativePath: string) {
  if (relativePath === 'index.html') return 'no-cache'
  // Vite puts a content hash into every file name below assets/
  if (relativePath.startsWith('assets/')) {
    return 'public, max-age=31536000, immutable'
  }

  return 'public, max-age=86400'
}

async function fileSize(filePath: string) {
  try {
    const info = await stat(filePath)
    return info.isFile() ? info.size : null
  } catch {
    return null
  }
}

export function createStaticHandler(distDir: string) {
  const root = path.resolve(distDir)
  const indexFile = path.join(root, 'index.html')

  return async function handleStatic(
    req: IncomingMessage,
    res: ServerResponse,
    url: URL,
  ) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { error: 'method not allowed' })
      return
    }

    const requested = path.resolve(root, `.${decodeURIComponent(url.pathname)}`)
    const isInsideRoot = requested.startsWith(`${root}${path.sep}`)

    if (isInsideRoot) {
      const size = await fileSize(requested)

      if (size !== null) {
        const relativePath = path
          .relative(root, requested)
          .split(path.sep)
          .join('/')
        const extension = path.extname(requested).toLowerCase()

        await sendFile(req, res, {
          path: requested,
          size,
          contentType: contentTypes[extension] ?? 'application/octet-stream',
          cacheControl: cacheControlFor(relativePath),
        })
        return
      }
    }

    // Missing files with an extension are real 404s,
    // everything else is a client side route of the single page app
    if (path.extname(url.pathname) !== '') {
      sendJson(res, 404, { error: 'not found' })
      return
    }

    const indexSize = await fileSize(indexFile)
    if (indexSize === null) {
      sendJson(res, 500, { error: 'frontend build is missing' })
      return
    }

    await sendFile(req, res, {
      path: indexFile,
      size: indexSize,
      contentType: contentTypes['.html'],
      cacheControl: cacheControlFor('index.html'),
    })
  }
}
