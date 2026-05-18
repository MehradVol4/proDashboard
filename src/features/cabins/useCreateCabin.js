import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export default function useCreateCabin() {
    const queryClient = useQueryClient();

    const { mutate: createCabin, isPending: isCreating } = useMutation({
        mutationFn: (variables) => {
            const newCabinData = variables?.newCabinData ?? variables;
            return createEditCabin({ newCabinData });
        },
        onSuccess: () => {
            toast.success("New Cabin Created!");
            queryClient.invalidateQueries({
                queryKey: ['cabin'],
            });
        },
        onError: (err) => toast.error(err.message)
    });

    return { isCreating, createCabin }
}

