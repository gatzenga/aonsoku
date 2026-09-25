import { NavigationButtons } from '@/app/components/header/navigation-buttons'
import { UserDropdown } from '@/app/components/header/user-dropdown'
import { HeaderSongInfo } from '@/app/components/header-song'
import { ThemeButton } from '@/app/components/theme/theme-button'

export function Header() {
  return (
    <header className="w-full grid grid-cols-header h-header px-4 fixed top-0 right-0 left-0 z-20 bg-background border-b">
      <div className="flex items-center">
        <NavigationButtons />
      </div>
      <HeaderSongInfo />
      <div className="flex justify-end items-center gap-2">
        <ThemeButton />
        <UserDropdown />
      </div>
    </header>
  )
}
