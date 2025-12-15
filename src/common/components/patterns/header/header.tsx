import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import { HiBell, HiMenu, HiPlus, HiSearch } from 'react-icons/hi'
import Avatar from '../../ui/avatar/Avatar'

export function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <button className="header__menu-btn">
            <HiMenu />
          </button>

          <Link href="/">
            <FaPlay className="header__logo-icon" />
            <span>MyTube</span>
          </Link>
        </div>
        <div className="header__center">
          <form className="search-field">
            <HiSearch className="search-field__icon" />
            <input placeholder="Search videos, channels..." className="search-field__input" />
          </form>
        </div>
        <div className="header__right">
          <Link href="/studio">
            <HiPlus />
          </Link>

          <button className="header__action">
            <HiBell />
          </button>

          <Avatar src={'https://i.sstatic.net/l60Hf.png'} size="sm" />
        </div>
      </div>
    </header>
  )
}
