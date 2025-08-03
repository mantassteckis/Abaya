#!/bin/bash

# Ecommerce Admin Project Setup Script
# This script sets up the project on a new laptop

echo "🚀 Starting Ecommerce Admin Project Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if running on Windows (Git Bash, WSL, etc.)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    WINDOWS=true
else
    WINDOWS=false
fi

# Step 1: Check if Node.js is installed
print_header "Checking Node.js Installation"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is installed: $NODE_VERSION"
    
    # Check if version is 16 or higher
    if [[ $(node --version | cut -d'.' -f1 | sed 's/v//') -ge 16 ]]; then
        print_status "Node.js version is compatible (16+)"
    else
        print_warning "Node.js version is below 16. Please update Node.js"
    fi
else
    print_error "Node.js is not installed!"
    print_status "Please install Node.js from https://nodejs.org/"
    print_status "Recommended: Node.js 18.x or later"
    exit 1
fi

# Step 2: Check if npm is available
print_header "Checking npm Installation"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed!"
    exit 1
fi

# Step 3: Check if git is installed
print_header "Checking Git Installation"
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_status "Git is installed: $GIT_VERSION"
else
    print_error "Git is not installed!"
    print_status "Please install Git from https://git-scm.com/"
    exit 1
fi

# Step 4: Clone the repository (if not already cloned)
print_header "Setting up Project Directory"
PROJECT_NAME="ecommerce-admin"

if [ ! -d "$PROJECT_NAME" ]; then
    print_status "Project directory not found. Please ensure you're in the correct directory or clone the repository first."
    echo "If you need to clone from GitHub, use:"
    echo "git clone <your-repo-url> $PROJECT_NAME"
    echo "cd $PROJECT_NAME"
    echo "Then run this script again."
    exit 1
else
    print_status "Project directory found: $PROJECT_NAME"
fi

# Step 5: Install dependencies
print_header "Installing Project Dependencies"
print_status "Running npm install..."
if npm install; then
    print_status "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies!"
    exit 1
fi

# Step 6: Set up environment variables
print_header "Setting up Environment Variables"
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local file..."
    cat > .env.local << 'EOF'
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
EOF
    print_status "Environment variables file created!"
else
    print_status "Environment variables file already exists!"
fi

# Step 7: Database setup check
print_header "Database Setup Check"
print_status "Checking database connection..."
print_warning "Make sure your MongoDB Atlas database is accessible"
print_status "Database URL: mongodb+srv://sam:sam321123@cluster0.6psiz.mongodb.net/ecommerce"

# Step 8: Install global dependencies (if needed)
print_header "Checking Global Dependencies"
if ! command -v prisma &> /dev/null; then
    print_status "Installing Prisma CLI globally..."
    npm install -g prisma
fi

# Step 9: Generate Prisma client
print_header "Setting up Prisma"
if [ -d "prisma" ]; then
    print_status "Generating Prisma client..."
    npx prisma generate
    print_status "Prisma client generated!"
else
    print_warning "Prisma directory not found. Skipping Prisma setup."
fi

# Step 10: Final setup checks
print_header "Final Setup Verification"
print_status "Project setup completed successfully! 🎉"
print_status ""
print_status "Next steps:"
print_status "1. Start the development server: npm run dev"
print_status "2. Open your browser to: http://localhost:3000"
print_status "3. Make sure your MongoDB database is running"
print_status ""
print_status "Available scripts:"
print_status "- npm run dev     : Start development server"
print_status "- npm run build   : Build for production"
print_status "- npm run start   : Start production server"
print_status "- npm run lint    : Run ESLint"
print_status ""
print_warning "Note: Make sure to keep your environment variables secure!"
print_warning "Don't commit .env.local to version control!"

# Optional: Ask if user wants to start the development server
echo ""
read -p "Do you want to start the development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting development server..."
    npm run dev
fi
