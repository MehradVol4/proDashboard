import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

const ForgotLink = styled(Link)`
  font-size: 1.4rem;
  color: var(--color-brand-600);
  font-weight: 500;
`;

function LoginForm() {
  // Prefilled with the account the API's seed script creates.
  const [email, setEmail] = useState("admin@prodashboard.local");
  const [password, setPassword] = useState("password1234");
  const { isPending, login } = useLogin();

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return;
    login({ email, password }, {
      onError: () => setPassword(''),
      onSuccess: () => {
        setEmail('');
        setPassword('');
      }
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input
          type="email"
          id="email"

          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRow>
      <FormRow label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRow>


      <FormRow>
        <ForgotLink to="/forgot-password">Forgot your password?</ForgotLink>
        <Button size="large" disabled={isPending}>{!isPending ? 'Log-in' : <SpinnerMini />}</Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;
