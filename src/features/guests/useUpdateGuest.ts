import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateGuest as updateGuestApi } from "../../services/apiGuests";

export function useUpdateGuest() {
    const queryClient = useQueryClient();

    const { isPending: isUpdatingGuest, mutate: updateGuest } = useMutation({
        mutationFn: ({ id, newGuestData }) => updateGuestApi(id, newGuestData),
        onSuccess: (guest) => {
            toast.success("Guest details updated");
            queryClient.invalidateQueries({ queryKey: ["guests"] });
            queryClient.invalidateQueries({ queryKey: ["guest", String(guest?.id)] });
            // Bookings carry the guest's name and email through a join.
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { isUpdatingGuest, updateGuest };
}
