import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import SpinnerMini from "../../ui/SpinnerMini";
import { useResetPassword } from "./useResetPassword";
import { useRecoverySession } from "./useRecoverySession";

const Note = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-500);
  padding: 1.2rem 0;
`;

const ErrorNote = styled(Note)`
  color: var(--color-red-700);
`;

const BackLink = styled(Link)`
  font-size: 1.4rem;
  color: var(--color-brand-600);
  font-weight: 500;
`;

function ResetPasswordForm() {
  const { status, errorMessage, token } = useRecoverySession();
  const { resetPassword, isPending } = useResetPassword();

  const { register, handleSubmit, getValues, formState } = useForm();
  const { errors } = formState;

  if (status === "checking") return <Spinner />;

  if (status === "invalid")
    return (
      <Form>
        <ErrorNote>{errorMessage}</ErrorNote>
        <FormRow>
          <BackLink to="/forgot-password">Request a new reset link</BackLink>
        </FormRow>
      </Form>
    );

  function onSubmit({ password }) {
    resetPassword({ password, token });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Note>Choose a new password for your account.</Note>

      <FormRow label="New password" error={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          autoComplete="new-password"
          disabled={isPending}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Repeat new password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          autoComplete="new-password"
          disabled={isPending}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        <Button size="large" disabled={isPending}>
          {!isPending ? "Set new password" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default ResetPasswordForm;
