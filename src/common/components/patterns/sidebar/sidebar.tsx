'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
	HiHome,
	HiCollection,
	HiClock,
	HiHeart,
	HiCog,
} from 'react-icons/hi'
import { useAuth } from '@/modules/auth'
import { useSubscribedChannels } from '@/modules/channel'
import { Avatar } from '@/common/components/ui'

interface SidebarProps {
	isCollapsed: boolean
}

const mainNavItems = [
	{ href: '/', icon: HiHome, label: 'Home' },
	{ href: '/subscriptions', icon: HiCollection, label: 'Subscriptions', auth: true },
]

const libraryItems = [
	{ href: '/history', icon: HiClock, label: 'History', auth: true },
	{ href: '/liked', icon: HiHeart, label: 'Liked videos', auth: true },
]

export function Sidebar({ isCollapsed }: SidebarProps) {
	const pathname = usePathname()
	const { isAuthenticated } = useAuth()
	const { data: channels } = useSubscribedChannels()

	return (
		<aside className={clsx('sidebar', { 'sidebar--collapsed': isCollapsed })}>
			<div className="sidebar__content">
				{/* Main Navigation */}
				<nav className="sidebar__section">
					<div className="sidebar__nav">
						{mainNavItems.map((item) => {
							if (item.auth && !isAuthenticated) return null
							const Icon = item.icon
							const isActive = pathname === item.href

							return (
								<Link
									key={item.href}
									href={item.href}
									className={clsx('sidebar__item', { 'sidebar__item--active': isActive })}
								>
									<Icon className="sidebar__item-icon" />
									<span className="sidebar__item-text">{item.label}</span>
								</Link>
							)
						})}
					</div>
				</nav>

				{/* Library */}
				{isAuthenticated && (
					<nav className="sidebar__section">
						<h3 className="sidebar__section-title">Library</h3>
						<div className="sidebar__nav">
							{libraryItems.map((item) => {
								const Icon = item.icon
								const isActive = pathname === item.href

								return (
									<Link
										key={item.href}
										href={item.href}
										className={clsx('sidebar__item', { 'sidebar__item--active': isActive })}
									>
										<Icon className="sidebar__item-icon" />
										<span className="sidebar__item-text">{item.label}</span>
									</Link>
								)
							})}
						</div>
					</nav>
				)}

				{/* Subscriptions */}
				{isAuthenticated && channels && channels.length > 0 && (
					<nav className="sidebar__section">
						<div className="sidebar__divider">
							<span className="sidebar__divider-text">Subscriptions</span>
						</div>
						<div className="sidebar__nav">
							{channels.slice(0, 5).map((channel) => (
								<Link
									key={channel.id}
									href={`/channel/${channel.handle}`}
									className="sidebar__subscription"
								>
									<Avatar
										src={channel.avatarPath}
										alt={channel.owner.name || channel.handle}
										size="xs"
									/>
									<span className="sidebar__subscription-name">
										{channel.owner.name || channel.handle}
									</span>
								</Link>
							))}
						</div>
					</nav>
				)}

				{/* Settings */}
				<nav className="sidebar__section" style={{ marginTop: 'auto' }}>
					<div className="sidebar__nav">
						<Link
							href="/studio/settings"
							className={clsx('sidebar__item', {
								'sidebar__item--active': pathname === '/studio/settings',
							})}
						>
							<HiCog className="sidebar__item-icon" />
							<span className="sidebar__item-text">Settings</span>
						</Link>
					</div>
				</nav>
			</div>
		</aside>
	)
}

