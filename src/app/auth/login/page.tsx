'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Link from 'next/link'
import { FaPlay } from 'react-icons/fa'
import Input from '@/common/components/ui/input/Input'
import Button from '@/common/components/ui/button/Button'
import { useLogin } from '@/modules/auth/hooks/use-auth'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const { login, isLoading } = useLogin()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: 'demo@example.com',
      password: 'password123',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)
      await login(data)
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
          <div className="auth-card__error">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email is required',
          })}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
          })}
          error={errors.password?.message}
        />

        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
          Sign In
        </Button>
      </form>

      <div className="auth-card__footer">
        Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
      </div>
    </div>
  )
}
