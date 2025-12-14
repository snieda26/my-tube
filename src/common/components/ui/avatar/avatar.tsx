'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { STORAGE_URL } from '@/common/constants/api.constants'

export interface AvatarProps {
	src?: string | null
	alt?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
	fallback?: string
	className?: string
}

export function Avatar({ src, alt = 'Avatar', size = 'md', fallback, className }: AvatarProps) {
	const [hasError, setHasError] = useState(false)

	const getFallback = () => {
		if (fallback) return fallback.charAt(0).toUpperCase()
		if (alt) return alt.charAt(0).toUpperCase()
		return '?'
	}

	const getImageUrl = (path: string) => {
		if (path.startsWith('http')) return path
		return `${STORAGE_URL}${path}`
	}

	const sizeMap = {
		xs: 24,
		sm: 32,
		md: 40,
		lg: 56,
		xl: 80,
		'2xl': 120,
	}

	const showImage = src && !hasError

	return (
		<div className={clsx('avatar', `avatar--${size}`, className)}>
			{showImage ? (
				<img
					src={getImageUrl(src)}
					alt={alt}
					width={sizeMap[size]}
					height={sizeMap[size]}
					className="avatar__image"
					onError={() => setHasError(true)}
				/>
			) : (
				<span className="avatar__fallback">{getFallback()}</span>
			)}
		</div>
	)
}

