import { SignUp } from '@clerk/nextjs';
import Container from '@/components/ui/container';

export default function Signup() {

  return (
    <Container>
      <div className="flex items-center justify-center min-h-[60vh]">
        <SignUp 
          path="/auth/signup"
          routing="path"
          signInUrl="/auth/login"
          redirectUrl="/"
        />
      </div>
    </Container>
  )
} 