import { Header } from '@/common/components/patterns/header/header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-layout">
      <Header />
      {/* <Sidebar /> */}
      <main className="main-layout__content">{children}</main>
    </div>
  )
}
