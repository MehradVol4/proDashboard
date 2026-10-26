import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { requestPasswordReset } from "../../services/apiAuth";

export function useRequestPasswordReset() {
    const { mutate: sendResetLink, isPending, isSuccess } = useMutation({
        mutationFn: requestPasswordReset,
        onSuccess: () =>
            toast.success("Check your inbox for the password reset link"),
        onError: (err) => toast.error(err.message),
    });

    return { sendResetLink, isPending, isSuccess };
}
