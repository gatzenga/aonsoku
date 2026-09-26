// Reads the container environment once at startup.
// Everything under `client` is public and delivered to the browser,
// everything else stays inside the backend.

type Language = 'de' | 'en'

export interface ClientConfig {
  language: Language
  lyrics: boolean
  sidebar: {
    artists: boolean
    songs: boolean
    albums: boolean
    genres: boolean
    radios: boolean
  }
  features: {
    favorites: boolean
    playlists: boolean
  }
}

export interface ServerConfig {
  port: number
  distDir: string
  navidromeUrl: string
  lyricsServer: string | null
  cache: {
    dir: string
    images: boolean
    lyrics: boolean
  }
  client: ClientConfig
}

function readString(name: string, fallback: string): string {
  const value = process.env[name]?.trim()

  return value ? value : fallback
}

function readUrl(name: string, fallback: string | null): string | null {
  const value = process.env[name]?.trim()
  if (!value) return fallback

  try {
    const url = new URL(value)
    return url.toString().replace(/\/+$/, '')
  } catch {
    throw new Error(`${name} is not a valid URL: "${value}"`)
  }
}

function readRequiredUrl(name: string): string {
  const url = readUrl(name, null)
  if (!url) throw new Error(`${name} is required`)

  return url
}

function readBoolean(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase()
  if (!value) return fallback

  if (value === 'true') return true
  if (value === 'false') return false

  throw new Error(`${name} must be "true" or "false", got "${value}"`)
}

function readLanguage(name: string, fallback: Language): Language {
  const value = process.env[name]?.trim().toLowerCase()
  if (!value) return fallback

  if (value === 'de' || value === 'en') return value

  throw new Error(`${name} must be "de" or "en", got "${value}"`)
}

function readPort(name: string, fallback: number): number {
  const value = process.env[name]?.trim()
  if (!value) return fallback

  const port = Number(value)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be a valid port, got "${value}"`)
  }

  return port
}

export function loadConfig(): ServerConfig {
  const lyricsServer = readUrl('LYRICS_SERVER', null)

  return {
    port: readPort('PORT', 8080),
    distDir: readString(
      'DIST_DIR',
      new URL('../dist', import.meta.url).pathname,
    ),
    navidromeUrl: readRequiredUrl('NAVIDROME_URL'),
    lyricsServer,
    cache: {
      dir: readString('CACHE_DIR', '/cache'),
      images: readBoolean('CACHE_IMAGES', false),
      lyrics: readBoolean('CACHE_LYRICS', false),
    },
    client: {
      language: readLanguage('LANGUAGE', 'de'),
      lyrics: lyricsServer !== null,
      sidebar: {
        artists: readBoolean('SIDEBAR_ARTISTS', true),
        songs: readBoolean('SIDEBAR_SONGS', true),
        albums: readBoolean('SIDEBAR_ALBUMS', true),
        genres: readBoolean('SIDEBAR_GENRES', true),
        radios: readBoolean('SIDEBAR_RADIOS', true),
      },
      features: {
        favorites: readBoolean('FEATURE_FAVORITES', true),
        playlists: readBoolean('FEATURE_PLAYLISTS', true),
      },
    },
  }
}
