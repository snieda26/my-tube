'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HiMenu, HiSearch, HiPlus, HiBell } from 'react-icons/hi'
import { FaPlay } from 'react-icons/fa'
import clsx from 'clsx'
import { useAuth, useLogout } from '@/modules/auth'
import { Avatar } from '@/common/components/ui'

interface HeaderProps {
	onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
	const router = useRouter()
	const { user, isAuthenticated } = useAuth()
	const { mutate: logout } = useLogout()
	const [searchQuery, setSearchQuery] = useState('')
	const [isSearchFocused, setIsSearchFocused] = useState(false)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
		}
	}

	return (
		<header className="header">
			<div className="header__container">
				<div className="header__left">
					<button className="header__menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
						<HiMenu />
					</button>

					<Link href="/" className="header__logo">
						<FaPlay className="header__logo-icon" />
						<span>MyTube</span>
					</Link>
				</div>

				<div className="header__center">
					<form
						className={clsx('search-field', { 'search-field--focused': isSearchFocused })}
						onSubmit={handleSearch}
					>
						<HiSearch
							className={clsx('search-field__icon', {
								'search-field__icon--active': isSearchFocused,
							})}
						/>
						<input
							type="search"
							placeholder="Search videos, channels..."
							className="search-field__input"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setIsSearchFocused(false)}
						/>
					</form>
				</div>

				<div className="header__right">
					<button className="header__action header__action--mobile" aria-label="Search">
						<HiSearch />
					</button>

					{isAuthenticated ? (
						<>
							<Link href="/studio/upload" className="header__action" aria-label="Upload video">
								<HiPlus />
							</Link>

							<button className="header__action" aria-label="Notifications">
								<HiBell />
							</button>

							<div className="dropdown" ref={dropdownRef}>
								<button
									className="header__profile"
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								>
									<Avatar src={user?.channel?.avatarPath} alt={user?.name || 'User'} size="sm" />
								</button>

								<div
									className={`dropdown__content ${isDropdownOpen ? 'dropdown__content--open' : ''}`}
								>
									<div className="dropdown__header">
										<Avatar src={user?.channel?.avatarPath} alt={user?.name || 'User'} size="lg" />
										<div style={{ marginLeft: '12px' }}>
											<div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
											<div style={{ fontSize: '12px', color: '#a1a1aa' }}>
												{user?.channel?.handle ? `@${user.channel.handle}` : user?.email}
											</div>
										</div>
									</div>
									<div className="dropdown__body">
										{user?.channel && (
											<Link
												href={`/channel/${user.channel.handle}`}
												className="dropdown__item"
												onClick={() => setIsDropdownOpen(false)}
											>
												Your channel
											</Link>
										)}
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
											onClick={() => {
												setIsDropdownOpen(false)
												logout()
											}}
										>
											Sign out
										</button>
									</div>
								</div>
							</div>
						</>
					) : (
						<Link href="/auth/login" className="header__auth-btn">
							Sign in
						</Link>
					)}
				</div>
			</div>
		</header>
	)
}

