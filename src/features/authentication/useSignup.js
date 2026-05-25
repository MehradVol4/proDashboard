import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signup as signupApi } from "../../services/apiAuth";

export function useSignup() {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: ({ fullName, email, password }) =>
      signupApi({ fullName, email, password }),
    onError: (err) => toast.error(err.message),
  });

  return { signup, isPending };
}

