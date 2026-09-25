// Configuration of the container, set through the docker environment.
// The backend delivers it with /env-config.js before the app starts
// (see server/config.ts). The defaults apply when there is no backend.

export type AppLanguage = 'de' | 'en'

export interface AppConfig {
  language: AppLanguage
  theme: string | null
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

const defaultConfig: AppConfig = {
  language: 'de',
  theme: null,
  lyrics: false,
  sidebar: {
    artists: true,
    songs: true,
    albums: true,
    genres: true,
    radios: true,
  },
  features: {
    favorites: true,
    playlists: true,
  },
}

function loadAppConfig(): AppConfig {
  const config = window.APP_CONFIG

  if (!config) return defaultConfig

  return {
    ...defaultConfig,
    ...config,
    sidebar: { ...defaultConfig.sidebar, ...config.sidebar },
    features: { ...defaultConfig.features, ...config.features },
  }
}

export const appConfig = loadAppConfig()
