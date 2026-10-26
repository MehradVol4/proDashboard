import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBooking as createBookingApi } from "../../services/apiBookings";

export function useCreateBooking() {
    const queryClient = useQueryClient();

    const { isPending: isCreatingBooking, mutateAsync: createBooking } = useMutation({
        mutationFn: createBookingApi,
        onSuccess: () => {
            toast.success("New booking created!");
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['today-activity'] });
            queryClient.invalidateQueries({ queryKey: ['cabin-booked-ranges'] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { isCreatingBooking, createBooking };
}
