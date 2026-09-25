import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  ListMusicIcon,
  Mic2Icon,
  Music2Icon,
  RadioIcon,
  TagsIcon,
} from 'lucide-react'
import { ElementType, memo } from 'react'
import { ROUTES } from '@/routes/routesList'

const ListMusic = memo(ListMusicIcon)
const Mic2 = memo(Mic2Icon)
const Music2 = memo(Music2Icon)
const Radio = memo(RadioIcon)
const Home = memo(HomeIcon)
const Library = memo(LibraryIcon)
const Heart = memo(HeartIcon)
const Tags = memo(TagsIcon)

export interface ISidebarItem {
  id: string
  title: string
  route: string
  icon: ElementType
}

export enum SidebarItems {
  Home = 'home',
  Artists = 'artists',
  Songs = 'songs',
  Albums = 'albums',
  Genres = 'genres',
  Favorites = 'favorites',
  Playlists = 'playlists',
  Radios = 'radios',
}

export const mainNavItems = [
  {
    id: SidebarItems.Home,
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: Home,
  },
]

export const libraryItems = [
  {
    id: SidebarItems.Artists,
    title: 'sidebar.artists',
    route: ROUTES.LIBRARY.ARTISTS,
    icon: Mic2,
  },
  {
    id: SidebarItems.Songs,
    title: 'sidebar.songs',
    route: ROUTES.LIBRARY.SONGS,
    icon: Music2,
  },
  {
    id: SidebarItems.Albums,
    title: 'sidebar.albums',
    route: ROUTES.LIBRARY.ALBUMS,
    icon: Library,
  },
  {
    id: SidebarItems.Genres,
    title: 'sidebar.genres',
    route: ROUTES.LIBRARY.GENRES,
    icon: Tags,
  },
  {
    id: SidebarItems.Favorites,
    title: 'sidebar.favorites',
    route: ROUTES.LIBRARY.FAVORITES,
    icon: Heart,
  },
  {
    id: SidebarItems.Playlists,
    title: 'sidebar.playlists',
    route: ROUTES.LIBRARY.PLAYLISTS,
    icon: ListMusic,
  },
  {
    id: SidebarItems.Radios,
    title: 'sidebar.radios',
    route: ROUTES.LIBRARY.RADIOS,
    icon: Radio,
  },
]
