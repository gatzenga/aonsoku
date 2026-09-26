export enum Theme {
  Black = 'black',
  Vesper = 'vesper',
  Mirage = 'mirage',
  MarmaladeBeaver = 'marmalade-beaver',
  VueDark = 'vue-dark',
  NuclearDark = 'nuclear-dark',
  ShadesOfPurple = 'shades-of-purple',
  MonokaiPro = 'monokai-pro',
}

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
