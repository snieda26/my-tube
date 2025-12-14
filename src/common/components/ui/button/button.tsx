'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
	size?: 'sm' | 'md' | 'lg'
	isLoading?: boolean
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			isLoading = false,
			leftIcon,
			rightIcon,
			fullWidth = false,
			children,
			className,
			disabled,
			...props
		},
		ref
	) => {
		return (
			<button
				ref={ref}
				className={clsx(
					'btn',
					`btn--${variant}`,
					`btn--${size}`,
					{
						'btn--full': fullWidth,
						'btn--loading': isLoading,
					},
					className
				)}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading ? (
					<span className="btn__spinner" />
				) : (
					<>
						{leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
						{children}
						{rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
					</>
				)}
			</button>
		)
	}
)

Button.displayName = 'Button'

