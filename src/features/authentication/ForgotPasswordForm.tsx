import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SpinnerMini from "../../ui/SpinnerMini";
import { useRequestPasswordReset } from "./useRequestPasswordReset";

const Note = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  padding: 1.2rem 0;
`;

const BackLink = styled(Link)`
  font-size: 1.4rem;
  color: var(--color-brand-600);
  font-weight: 500;
`;

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { sendResetLink, isPending, isSuccess } = useRequestPasswordReset();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    sendResetLink({ email });
  }

  if (isSuccess)
    return (
      <Form>
        <Note>
          If an account exists for <strong>{email}</strong>, a reset link is on
          its way. The link expires after a short while, so use it soon.
        </Note>
        <FormRow>
          <BackLink to="/login">&larr; Back to login</BackLink>
        </FormRow>
      </Form>
    );

  return (
    <Form onSubmit={handleSubmit}>
      <Note>
        Enter the email you log in with and we will send you a link to choose a
        new password.
      </Note>

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

      <FormRow>
        <BackLink to="/login">&larr; Back to login</BackLink>
        <Button size="large" disabled={isPending}>
          {!isPending ? "Send reset link" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default ForgotPasswordForm;
