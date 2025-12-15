'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Header, Sidebar } from '@/common/components/patterns'

export default function MainLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

	return (
		<div className={clsx('main-layout', { 'main-layout--sidebar-collapsed': isSidebarCollapsed })}>
			<Header onMenuClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
			<Sidebar isCollapsed={isSidebarCollapsed} />
			<main className="main-layout__content">{children}</main>
		</div>
	)
}

