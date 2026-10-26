import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import AuthLayout from "../ui/AuthLayout";

function Login() {
  return (
    <AuthLayout>
      <Logo />
      <Heading as="h4">
        Log in to <span className="accent-text">your account</span>
      </Heading>
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
