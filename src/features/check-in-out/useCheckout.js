import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";


export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data, variables) => {
      toast.success(`Booking #${data.id} successfully checked Out!`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      if (variables?.bookingId)
        queryClient.invalidateQueries({
          queryKey: ["booking", variables.bookingId],
        });
    },

    onError: () => toast.error("An error occurred!"),
  });

  return { checkout, isCheckingOut };
}
