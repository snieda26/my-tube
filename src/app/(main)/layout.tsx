'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { Header } from '@/common/components/patterns/header/header'
import { Sidebar } from '@/common/components/patterns/sidebar/Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className={clsx('main-layout', { 'main-layout--sidebar-collapsed': isSidebarCollapsed })}>
      <Header onMenuClick={handleMenuClick} />
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <main className="main-layout__content">{children}</main>
    </div>
  )
}
