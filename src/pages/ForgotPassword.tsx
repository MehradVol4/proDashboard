import ForgotPasswordForm from "../features/authentication/ForgotPasswordForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import AuthLayout from "../ui/AuthLayout";

function ForgotPassword() {
  return (
    <AuthLayout>
      <Logo />
      <Heading as="h4">
        Reset <span className="accent-text">your password</span>
      </Heading>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;
