// Smart mixes, built by the backend with the credentials of the browser.
// Song selection follows the Shelv player (SmartMixPlaybackService.swift and
// SubsonicAPIService.swift); like there, every mix is played shuffled.
import type { ServerResponse } from 'node:http'
import type { ServerConfig } from './config.ts'
import { sendJson } from './http.ts'
import {
  createClient,
  SubsonicError,
  type SubsonicRequest,
} from './subsonic-client.ts'

type MixType = 'newest' | 'frequent' | 'recent' | 'shuffle'

const mixTypes: MixType[] = ['newest', 'frequent', 'recent', 'shuffle']

interface Album {
  id: string
  playCount?: number
}

interface Song {
  id: string
  playCount?: number
}

async function albumList(request: SubsonicRequest, type: string, size: number) {
  const body = await request<{ albumList2?: { album?: Album[] } }>(
    'getAlbumList2',
    { type, size: String(size) },
  )

  return body.albumList2?.album ?? []
}

// Loads the songs of many albums, a few at a time
async function songsOfAlbums(request: SubsonicRequest, albums: Album[]) {
  const results: Song[][] = new Array(albums.length)
  let next = 0

  async function worker() {
    while (next < albums.length) {
      const index = next++
      try {
        const body = await request<{ album?: { song?: Song[] } }>('getAlbum', {
          id: albums[index].id,
        })
        results[index] = body.album?.song ?? []
      } catch {
        results[index] = []
      }
    }
  }

  await Promise.all(Array.from({ length: 6 }, worker))

  return results.flat()
}

function byPlayCount(a: { playCount?: number }, b: { playCount?: number }) {
  return (b.playCount ?? 0) - (a.playCount ?? 0)
}

// Shelv: getNewestSongs, all songs of the 10 newest albums
async function newestSongs(request: SubsonicRequest) {
  return songsOfAlbums(request, await albumList(request, 'newest', 10))
}

// Shelv: frequentMixFallbackSongs
async function frequentSongs(request: SubsonicRequest) {
  const sorted = (await albumList(request, 'frequent', 500)).sort(byPlayCount)
  const threshold = Math.max(Math.floor((sorted[0]?.playCount ?? 0) / 50), 1)

  let albums = sorted.filter((album) => (album.playCount ?? 0) >= threshold)
  if (albums.length < 30) albums = sorted.slice(0, 30)
  if (albums.length > 80) albums = sorted.slice(0, 80)

  const songs = await songsOfAlbums(request, albums)

  return songs.sort(byPlayCount).slice(0, 50)
}

// Shelv: getRecentSongs, the first 50 songs of the 30 recently played
// albums in order. Albums are loaded in small batches until 50 songs are
// together, instead of loading all 30.
async function recentSongs(request: SubsonicRequest) {
  const albums = await albumList(request, 'recent', 30)
  const songs: Song[] = []

  for (let i = 0; i < albums.length && songs.length < 50; i += 6) {
    songs.push(...(await songsOfAlbums(request, albums.slice(i, i + 6))))
  }

  return songs.slice(0, 50)
}

// Shelv: shuffleAll
async function shuffleSongs(request: SubsonicRequest) {
  const body = await request<{ randomSongs?: { song?: Song[] } }>(
    'getRandomSongs',
    { size: '500' },
  )

  return body.randomSongs?.song ?? []
}

function shuffle<T>(items: T[]) {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function uniqueById(songs: Song[]) {
  const seen = new Set<string>()

  return songs.filter((song) => {
    if (seen.has(song.id)) return false
    seen.add(song.id)
    return true
  })
}

export async function sendSmartMix(
  config: ServerConfig,
  res: ServerResponse,
  url: URL,
) {
  const type = url.searchParams.get('type') as MixType | null

  if (!type || !mixTypes.includes(type)) {
    sendJson(res, 400, { error: `type must be one of ${mixTypes.join(', ')}` })
    return
  }

  const request = createClient(config, url.searchParams)
  const load = {
    newest: newestSongs,
    frequent: frequentSongs,
    recent: recentSongs,
    shuffle: shuffleSongs,
  }[type]

  try {
    const songs = shuffle(uniqueById(await load(request)))

    res.setHeader('cache-control', 'no-store')
    sendJson(res, 200, { songs })
  } catch (error) {
    if (!(error instanceof SubsonicError)) throw error
    sendJson(res, 502, { error: 'smart mix could not be created' })
  }
}
