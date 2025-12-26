# MyTube - Video Sharing Platform

A modern video sharing platform built with Next.js 16, TypeScript, and professional authentication system.

## 🚀 Features

- ✅ **Professional Authentication System**
  - JWT-based authentication with access & refresh tokens
  - Silent token refresh with automatic retry
  - Secure cookie-based token storage
  - Route protection with middleware
  - Auth guards for components
  - CSRF protection

- 🎨 **Modern UI**
  - Responsive design
  - Custom SCSS styling
  - Reusable components
  - Beautiful auth pages

- 🔒 **Security**
  - No localStorage/sessionStorage for tokens
  - HttpOnly refresh tokens
  - Secure cookies in production
  - Request/response interceptors
  - Protected routes

## 📦 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** SCSS
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **State Management:** React Context API
- **Notifications:** React Hot Toast
- **Icons:** React Icons

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-tube
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

5. Start development server:
```bash
yarn dev
# or
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
my-tube/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # Main layout group
│   │   │   ├── page.tsx       # Home page
│   │   │   └── subscriptions/ # Subscriptions page
│   │   ├── auth/              # Auth pages
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Register page
│   │   └── layout.tsx         # Root layout
│   ├── common/                # Shared components
│   │   └── components/
│   │       ├── patterns/      # Layout patterns
│   │       └── ui/            # UI components
│   ├── modules/               # Feature modules
│   │   └── auth/              # Auth module
│   │       ├── components/    # Auth components
│   │       ├── context/       # Auth context
│   │       ├── hooks/         # Auth hooks
│   │       ├── services/      # Auth services
│   │       ├── types/         # Auth types
│   │       └── config/        # Auth config
│   ├── infrastructure/        # Core infrastructure
│   │   └── api/              # API client
│   ├── providers/            # Global providers
│   ├── styles/               # Global styles
│   └── middleware.ts         # Route protection
├── public/                   # Static assets
├── .env.local.example       # Environment template
└── package.json
```

## 🔐 Authentication

This project implements a professional authentication system. See [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md) for detailed documentation.

### Quick Start

#### Login
```typescript
import { useLogin } from '@/modules/auth'

const { login, isLoading } = useLogin()

await login({
  email: 'user@example.com',
  password: 'password123'
})
```

#### Register
```typescript
import { useRegister } from '@/modules/auth'

const { register, isLoading } = useRegister()

await register({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  name: 'John Doe'
})
```

#### Protect Routes
```typescript
import { AuthGuard } from '@/modules/auth'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <YourContent />
    </AuthGuard>
  )
}
```

#### Check Auth Status
```typescript
import { useAuth } from '@/modules/auth'

const { user, isAuthenticated, isLoading } = useAuth()
```

## 🎯 Available Scripts

```bash
# Development
yarn dev          # Start dev server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint

# Type checking
yarn type-check   # Check TypeScript types
```

## 🌐 API Integration

The app connects to a backend API. Ensure your backend implements:

- `POST /auth/login` - Login endpoint
- `POST /auth/register` - Registration endpoint
- `POST /auth/logout` - Logout endpoint
- `POST /auth/refresh` - Token refresh endpoint (with HttpOnly cookie)
- `GET /account/me` - Get current user profile

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |

### Middleware Configuration

Edit `src/middleware.ts` to configure protected routes:

```typescript
export const config = {
  matcher: [
    '/auth/:path*',
    '/subscriptions',
    '/studio/:path*',
    // Add more protected routes
  ],
}
```

## 📚 Documentation

- [Authentication Documentation](./AUTH_DOCUMENTATION.md) - Complete auth system guide
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🎨 Styling

This project uses SCSS modules with a custom design system:

- **Variables:** `src/styles/_variables.scss`
- **Mixins:** `src/styles/_mixins.scss`
- **Components:** `src/styles/components/`
- **Layout:** `src/styles/layout/`
- **Modules:** `src/styles/modules/`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built for Next.js 16 Course

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React team for React 19
- All open-source contributors

---

**Happy Coding! 🚀**
