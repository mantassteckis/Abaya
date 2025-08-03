# 🚀 Deployment Guide - Vercel

This guide will help you deploy your Ecommerce Admin Dashboard to Vercel.

## 🎯 Why Vercel?

- **Built for Next.js**: Vercel is created by the Next.js team
- **Zero Configuration**: Automatic builds and deployments
- **Global CDN**: Fast loading worldwide
- **Serverless Functions**: Built-in API routes support
- **Free Tier**: Generous free tier for personal projects

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ **GitHub Account** - [Sign up here](https://github.com)
2. ✅ **Vercel Account** - [Sign up here](https://vercel.com)
3. ✅ **Project pushed to GitHub** (we'll do this in Step 3)

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Project

1. **Ensure your project builds locally:**
   ```bash
   npm run build
   ```

2. **Test the production build:**
   ```bash
   npm run start
   ```

3. **Check for any build errors and fix them**

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Website (Recommended)

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Log In"
   - Choose "Continue with GitHub"

2. **Import Your Project:**
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Build Settings:**
   - **Framework Preset**: Next.js (should be detected automatically)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   DATABASE_URL = mongodb+srv://sam:sam321123@cluster0.6psiz.mongodb.net/ecommerce
   CLERK_SECRET_KEY = sk_test_xRcw8YjDFj5GxfabiwRZHz9yQM9I43PYM2nrjYAst4
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_Y29uY3JldGUtbXV0dC02LmNsZXJrLmFjY291bnRzLmRldiQ
   STRIPE_API_KEY = sk_test_51RFzGqSAlPa30nMjgMTMOYFkfxCu78Vr2FiWMa0T6VxGcdZUuZOgXWh8XfmYOnTNov0axUlIRYpKucZ2PG6wFQK700BdUoQKbm
   STRIPE_WEBHOOK_SECRET = whsec_local_development_secret
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dq03afeam
   FRONTEND_STORE_URL = https://your-frontend-url.vercel.app
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (2-5 minutes)
   - 🎉 Your app is live!

#### Option B: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (Choose your account)
   - Link to existing project? `N`
   - Project name? `ecommerce-admin`
   - Directory? `./`

5. **Add Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add CLERK_SECRET_KEY
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add STRIPE_API_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   vercel env add FRONTEND_STORE_URL
   ```

6. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Step 3: Post-Deployment Setup

1. **Update Environment Variables:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to "Settings" → "Environment Variables"
   - Update `FRONTEND_STORE_URL` with your actual deployed URL

2. **Update Clerk Settings:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Add your Vercel URL to allowed origins

3. **Update Stripe Settings:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Update webhook endpoints with your new domain

4. **Test Your Deployment:**
   - Visit your deployed URL
   - Test authentication
   - Test core functionality

## 🔧 Custom Domain (Optional)

1. **Go to Vercel Dashboard:**
   - Select your project
   - Go to "Settings" → "Domains"

2. **Add Custom Domain:**
   - Enter your domain name
   - Follow DNS configuration instructions

3. **Update Environment Variables:**
   - Update `FRONTEND_STORE_URL` with your custom domain

## 📊 Monitoring and Analytics

1. **Vercel Analytics:**
   - Enable in project settings
   - Get insights on performance and usage

2. **Error Monitoring:**
   - Check Vercel Functions tab for errors
   - Monitor build logs

## 🐛 Common Deployment Issues

### Build Errors

1. **Type Errors:**
   ```bash
   # Fix TypeScript errors locally first
   npm run build
   ```

2. **Missing Environment Variables:**
   - Check all required variables are set in Vercel
   - Ensure no typos in variable names

3. **Database Connection:**
   - Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
   - Check database URL format

### Runtime Errors

1. **Authentication Issues:**
   - Verify Clerk configuration
   - Check allowed origins in Clerk dashboard

2. **API Route Errors:**
   - Check Vercel Function logs
   - Verify environment variables

## 🚀 Automatic Deployments

Once connected to GitHub:

1. **Every push to main branch** triggers automatic deployment
2. **Pull requests** create preview deployments
3. **Rollback** is available in Vercel dashboard

## 📝 Best Practices

1. **Environment Variables:**
   - Never commit `.env.local` to Git
   - Use different values for production vs development

2. **Database Security:**
   - Use strong passwords
   - Restrict database access to specific IPs when possible

3. **Monitoring:**
   - Set up alerts for errors
   - Monitor performance metrics

## 🔗 Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Open project in browser
vercel open

# Remove deployment
vercel rm <deployment-url>
```

## 🎉 Success!

Your Ecommerce Admin Dashboard is now live on Vercel! 

- **Your URL**: `https://your-project-name.vercel.app`
- **Admin Dashboard**: Access through your deployed URL
- **Automatic Updates**: Push to GitHub to update

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Review build logs in Vercel dashboard
4. Check environment variables are correctly set
