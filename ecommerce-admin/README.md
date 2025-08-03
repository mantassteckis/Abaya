# Ecommerce Admin Dashboard

A modern, full-stack ecommerce admin dashboard built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **Next.js 13+** with App Router
- **TypeScript** for type safety
- **Clerk** for authentication
- **Prisma** with MongoDB
- **Stripe** for payments
- **Cloudinary** for image management
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Hook Form** with Zod validation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## 🛠️ Quick Setup (New Laptop)

### Option 1: Using the Setup Script (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url> ecommerce-admin
   cd ecommerce-admin
   ```

2. **Run the setup script:**
   ```bash
   # On Linux/Mac/WSL
   chmod +x setup-project.sh
   ./setup-project.sh
   
   # On Windows (Git Bash)
   bash setup-project.sh
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Option 2: Manual Setup

1. **Clone and navigate:**
   ```bash
   git clone <your-repo-url> ecommerce-admin
   cd ecommerce-admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://sam:sam321123@cluster0.6psiz.mongodb.net/ecommerce"
   
   # Clerk Authentication
   CLERK_SECRET_KEY=sk_test_xRcw8YjDFj5GxfabiwRZHz9yQM9I43PYM2nrjYAst4
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y29uY3JldGUtbXV0dC02LmNsZXJrLmFjY291bnRzLmRldiQ
   
   # Stripe Payment
   STRIPE_API_KEY=sk_test_51RFzGqSAlPa30nMjgMTMOYFkfxCu78Vr2FiWMa0T6VxGcdZUuZOgXWh8XfmYOnTNov0axUlIRYpKucZ2PG6wFQK700BdUoQKbm
   STRIPE_WEBHOOK_SECRET=whsec_local_development_secret
   
   # Cloudinary Image Storage
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dq03afeam
   
   # Frontend URL for Redirects
   FRONTEND_STORE_URL=http://localhost:3001
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🌐 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Project Structure

```
ecommerce-admin/
├── actions/          # Server actions
├── app/              # Next.js app directory
├── components/       # Reusable components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── prisma/          # Database schema
├── providers/       # Context providers
├── public/          # Static assets
├── .env.local       # Environment variables
├── package.json     # Dependencies
└── README.md        # This file
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MongoDB connection string |
| `CLERK_SECRET_KEY` | Clerk authentication secret |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `STRIPE_API_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `FRONTEND_STORE_URL` | Frontend store URL |

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Import your repository
   - Add environment variables
   - Deploy!

### Deploy to Other Platforms

- **Netlify**: Connect GitHub repo, set build command to `npm run build`
- **Railway**: Connect GitHub repo, supports databases
- **Render**: Connect GitHub repo, supports full-stack apps

## 📱 Accessing the Application

- **Development**: http://localhost:3000
- **Production**: Your deployed URL

## 🐛 Troubleshooting

### Common Issues:

1. **Node.js version error**: Ensure Node.js v16+ is installed
2. **Database connection error**: Check MongoDB Atlas connection string
3. **Environment variables**: Ensure all required variables are set
4. **Port already in use**: Kill process on port 3000 or use different port

### Getting Help:

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database is accessible
4. Try deleting `node_modules` and running `npm install` again

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
