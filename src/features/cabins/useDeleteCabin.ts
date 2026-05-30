import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabins as deleteCabinsApi } from "../../services/apiCabins";
import toast from "react-hot-toast";


export default function useDeleteCabin() {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
        mutationFn: deleteCabinsApi,
        onSuccess: () => {
            toast.success('Cabin has been deleted')
            queryClient.invalidateQueries({
                queryKey: ['cabin']
            });
        },
        onError: err => toast.error(err.message),
    });

    return {isDeleting,deleteCabin}
} ;
