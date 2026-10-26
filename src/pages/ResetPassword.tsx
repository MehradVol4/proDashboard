import ResetPasswordForm from "../features/authentication/ResetPasswordForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import AuthLayout from "../ui/AuthLayout";

function ResetPassword() {
  return (
    <AuthLayout>
      <Logo />
      <Heading as="h4">
        Choose a <span className="accent-text">new password</span>
      </Heading>
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPassword;
