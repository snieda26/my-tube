import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppProviders } from '@/providers/app-providers'
import '@/styles/globals.scss'
import '@/styles/components/index.scss'
import '@/styles/layout/index.scss'
import '@/styles/modules/index.scss'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
})

export const metadata: Metadata = {
	title: 'MyTube - Watch & Share Videos',
	description: 'Discover, watch, and share videos on MyTube',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={inter.variable}>
			<body>
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	)
}
