import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";

const LoginLayout = styled.main.attrs({ className: "animate-fade-up" })`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background:
    radial-gradient(900px 500px at 10% 10%, color-mix(in oklab, var(--color-brand-200) 45%, transparent) 0%, transparent 55%),
    radial-gradient(800px 450px at 90% 15%, color-mix(in oklab, var(--color-blue-100) 35%, transparent) 0%, transparent 60%),
    var(--color-grey-50);
`;

function Login() {
  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">
        Log in to <span className="accent-text">your account</span>
      </Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;
