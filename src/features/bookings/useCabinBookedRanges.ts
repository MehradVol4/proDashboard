import { useQuery } from "@tanstack/react-query";
import { getCabinBookedRanges } from "../../services/apiBookings";

export function useCabinBookedRanges(cabinId) {
    const hasCabin = cabinId !== null && cabinId !== undefined && cabinId !== "";

    const { isPending, data: bookedRanges, error } = useQuery({
        queryKey: ['cabin-booked-ranges', cabinId],
        queryFn: () => getCabinBookedRanges(cabinId),
        enabled: hasCabin,
    });

    return {
        isPending: hasCabin && isPending,
        error,
        bookedRanges: bookedRanges ?? [],
    };
}
