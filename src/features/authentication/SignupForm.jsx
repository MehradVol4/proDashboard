import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import SpinnerMini from "../../ui/SpinnerMini";
import { useSignup } from "./useSignup";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {

  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const { signup, isPending } = useSignup();

  const onSubmit = ({ fullName, email, password }) => {
    signup(
      { fullName, email, password },
      {
        onSettled:() => reset(),
      }
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isPending}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register("email", {
            required: "This field is required",
            pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Please provide a valid email",
          },
        })}
        />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          disabled={isPending}
          autoComplete="new-password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must at least have 8 characters!",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          autoComplete="new-password"
          {...register("passwordConfirm", {
            required: "This field is required!",
            validate: (value) =>
              value === getValues().password || "Passwords must match",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isPending}>
          Cancel
        </Button>
        <Button disabled={isPending}>
          {!isPending ? "Create new user" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
