'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import Input from '@/common/components/ui/input/Input'
import Button from '@/common/components/ui/button/Button'
import { useForm } from 'react-hook-form'
import { useRegister } from '@/modules/auth/hooks/use-auth'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useRegister()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null)
      await registerUser({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        name: data.name || undefined,
      })
    } catch (err) {
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <div className="auth-card__logo">
          <FaPlay />
          <span>MyTube</span>
        </div>
        <h1 className="auth-card__title">Create account</h1>
        <p className="auth-card__subtitle">Start sharing your videos today</p>
      </div>

      <form className="auth-card__form" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="auth-card__error">
            {error}
          </div>
        )}

        <Input
          label="Name (optional)"
          type="text"
          {...register('name')}
          disabled={isLoading}
        />

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
          hint="At least 8 characters"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.password?.message}
          disabled={isLoading}
        />

        <Input
          label="Confirm Password"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="auth-card__footer">
        Already have an account? <Link href="/auth/login">Sign in</Link>
      </div>
    </div>
  )
}
