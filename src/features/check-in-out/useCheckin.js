import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast = {} }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),

    onSuccess: (data, variables) => {
      toast.success(`Booking #${data.id} successfully checked in!`);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      if (variables?.bookingId)
        queryClient.invalidateQueries({
          queryKey: ["booking", variables.bookingId],
        });
      navigate("/");
    },

    onError: () => toast.error("An error occurred!"),
  });

  return { checkin, isCheckingIn };
}
