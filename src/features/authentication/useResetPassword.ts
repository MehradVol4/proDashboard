import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { updatePassword } from "../../services/apiAuth";

export function useResetPassword() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: resetPassword, isPending } = useMutation({
        mutationFn: updatePassword,
        onSuccess: (data) => {
            toast.success("Password updated — you are logged in");
            if (data?.user) queryClient.setQueryData(["user"], data.user);
            navigate("/dashboard", { replace: true });
        },
        onError: (err) => toast.error(err.message),
    });

    return { resetPassword, isPending };
}
