'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import clsx from 'clsx'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
	hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, hint, className, id, ...props }, ref) => {
		const inputId = id || props.name

		return (
			<div className="input-group">
				{label && (
					<label htmlFor={inputId} className="input-group__label">
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={inputId}
					className={clsx('input', { 'input--error': error }, className)}
					{...props}
				/>
				{error && <span className="input-group__error">{error}</span>}
				{hint && !error && <span className="input-group__hint">{hint}</span>}
			</div>
		)
	}
)

Input.displayName = 'Input'

