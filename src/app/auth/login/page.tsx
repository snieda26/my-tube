'use client'

import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import { useState } from 'react'
import Input from '@/common/components/ui/input/Input'
import Button from '@/common/components/ui/button/Button'
import { useLogin } from '@/modules/auth'

interface LoginFormData {
	email: string
	password: string
}

export default function LoginPage() {
	const { login, isLoading } = useLogin()
	const [error, setError] = useState<string | null>(null)

	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
		defaultValues: {
			email: '',
			password: '',
		}
	})

	const onSubmit = async (data: LoginFormData) => {
		try {
			setError(null)
			await login({
				email: data.email,
				password: data.password,
			})
		} catch (err) {
			setError('Login failed. Please check your credentials.')
		}
	}

	return (
		<div className="auth-card">
			<div className="auth-card__header">
				<div className="auth-card__logo">
					<FaPlay />
					<span>MyTube</span>
				</div>
				<h1 className="auth-card__title">Welcome back</h1>
				<p className="auth-card__subtitle">Sign in to your account</p>
			</div>

			<form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>
				{error && (
					<div style={{ 
						padding: '12px', 
						backgroundColor: '#fee', 
						color: '#c33', 
						borderRadius: '8px',
						marginBottom: '16px',
						fontSize: '14px'
					}}>
						{error}
					</div>
				)}

				<Input
					label="Email"
					type="email"
					{...register('email', {
						required: 'Email is required',
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: 'Invalid email address',
						},
					})}
					error={errors.email?.message}
					disabled={isLoading}
				/>

				<Input
					label="Password"
					type="password"
					{...register('password', {
						required: 'Password is required',
						minLength: {
							value: 6,
							message: 'Password must be at least 6 characters',
						},
					})}
					error={errors.password?.message}
					disabled={isLoading}
				/>

				<Button
					type="submit"
					variant="primary"
					fullWidth
					disabled={isLoading}
				>
					{isLoading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>

			<div className="auth-card__footer">
				Don't have an account?{' '}
				<Link href="/auth/register">Sign up</Link>
			</div>
		</div>
	)
}

