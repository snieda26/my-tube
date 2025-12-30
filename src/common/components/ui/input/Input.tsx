import clsx from 'clsx'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label className="input-group__label">{label}</label>}
        <input
          ref={ref}
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

export default Input
