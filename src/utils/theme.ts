import { Theme } from '@/types/themeContext'
import { appConfig } from './appConfig'

export function getValidThemeFromEnv(): Theme | null {
  const { theme } = appConfig

  if (theme && Object.values(Theme).includes(theme as Theme)) {
    return theme as Theme
  }

  return null
}
