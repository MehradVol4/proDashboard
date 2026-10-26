import { useQuery } from "@tanstack/react-query";
import { getBookingsByGuest } from "../../services/apiBookings";

export function useGuestBookings(guestId) {
    const { isPending, data: bookings, error } = useQuery({
        queryKey: ["bookings", "guest", guestId],
        queryFn: () => getBookingsByGuest(guestId),
        enabled: Boolean(guestId),
        retry: false,
    });

    return { isPending, error, bookings: bookings ?? [] };
}
