export enum Theme {
  Dark = 'dark',
  Black = 'black',
  MarmaladeBeaver = 'marmalade-beaver',
  MaterialTheme = 'material-theme',
  MonokaiPro = 'monokai-pro',
  ShadesOfPurple = 'shades-of-purple',
  BeardedSolarized = 'bearded-solarized',
  CatppuccinMocha = 'catppuccin-mocha',
  NuclearDark = 'nuclear-dark',
  Dracula = 'dracula',
  EverforstDark = 'everforest-dark',
  VueDark = 'vue-dark',
  VimDarkSoft = 'vim-dark-soft',
  Vesper = 'vesper',
  Mirage = 'mirage',
}

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
