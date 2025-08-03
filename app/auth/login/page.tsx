import { SignIn } from '@clerk/nextjs';
import Container from '@/components/ui/container';

export default function Login() {

  return (
    <Container>
      <div className="flex items-center justify-center min-h-[60vh]">
        <SignIn 
          path="/auth/login"
          routing="path"
          signUpUrl="/auth/signup"
          redirectUrl="/"
        />
      </div>
    </Container>
  )
}
