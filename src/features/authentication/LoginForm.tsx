import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";


function LoginForm() {
  const [email, setEmail] = useState("mehrad@example.com");
  const [password, setPassword] = useState("1234");
  const { isPending, login } = useLogin();

  function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) return;
    login({ email, password }, {
      onSettled: () => {
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
        <Button size="large" disabled={isPending}>{!isPending ? 'Log-in' : <SpinnerMini />}</Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;
