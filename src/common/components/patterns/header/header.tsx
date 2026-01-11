'use client'

import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import { HiBell, HiMenu, HiPlus, HiSearch, HiUser } from 'react-icons/hi'
import Avatar from '../../ui/avatar/Avatar'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useAuth, useLogout } from '@/modules/auth/hooks/use-auth'
import Button from '../../ui/button/Button'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { logout } = useLogout()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    setIsDropdownOpen(false)
    await logout()
  }

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__left">
          <button className="header__menu-btn" onClick={onMenuClick}>
            <HiMenu />
          </button>

          <Link href="/" className="header__logo">
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
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href="/studio" className="header__action">
                    <HiPlus />
                  </Link>

                  <button className="header__action">
                    <HiBell />
                  </button>

                  <div className="dropdown" ref={dropdownRef}>
                    <button
                      className="header__profile"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <Avatar
                        src={
                          user?.channel?.avatarPath
                            ? `${process.env.NEXT_PUBLIC_API_URL}${user.channel.avatarPath}`
                            : `https://i.pravatar.cc/36?u=${user?.id}`
                        }
                        size="sm"
                      />
                    </button>

                    <div
                      className={clsx('dropdown__content', {
                        'dropdown__content--open': isDropdownOpen,
                      })}
                    >
                      <div className="dropdown__header">
                        <Avatar
                          src={
                            user?.channel?.avatarPath
                              ? `${process.env.NEXT_PUBLIC_API_URL}${user.channel.avatarPath}`
                              : `https://i.pravatar.cc/36?u=${user?.id}`
                          }
                          alt="User"
                          size="lg"
                        />
                        <div className="dropdown__header-info">
                          <div>{user?.name || 'User'}</div>
                          <div className="dropdown__header-username">
                            @{user?.channel?.handle || 'username'}
                          </div>
                        </div>
                      </div>
                      <div className="dropdown__body">
                        <Link
                          href="/channel/username"
                          className="dropdown__item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Your channel
                        </Link>
                        <Link
                          href="/studio/dashboard"
                          className="dropdown__item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Studio
                        </Link>
                        <Link
                          href="/studio/settings"
                          className="dropdown__item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Settings
                        </Link>
                        <div className="dropdown__divider" />
                        <button
                          className="dropdown__item dropdown__item--danger"
                          onClick={handleLogout}
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Button variant="ghost" onClick={() => router.push('/auth/login')}>
                    <HiUser style={{ marginRight: '8px' }} />
                    Sign In
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
