import merge from 'lodash/merge'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { IThemeContext, Theme } from '@/types/themeContext'
import { getValidThemeFromEnv } from '@/utils/theme'

const appThemeFromEnv = getValidThemeFromEnv()

export const useThemeStore = createWithEqualityFn<IThemeContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set) => ({
          theme: appThemeFromEnv || Theme.Dark,
          setTheme: (theme: Theme) => {
            set((state) => {
              state.theme = theme
            })
          },
        })),
        {
          name: 'theme_store',
        },
      ),
      {
        name: 'theme_store',
        version: 1,
        // THEME from the container is only the default, a theme picked
        // with the theme button is kept
        merge: (persistedState, currentState) => {
          const merged = merge(currentState, persistedState)

          // a stored theme that no longer exists falls back to the default
          if (!Object.values(Theme).includes(merged.theme)) {
            merged.theme = appThemeFromEnv || Theme.Dark
          }

          return merged
        },
      },
    ),
  ),
)

export const useTheme = () => useThemeStore((state) => state)
