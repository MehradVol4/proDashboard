import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export function useBookings() {
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  const rawPage = searchParams.get("page");
  const page = rawPage ? Number(rawPage) : 1;
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const {
    isPending,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, safePage],
    queryFn: () => getBookings({ filter, sortBy, page: safePage }),
    retry: false,
  });

  return { isPending, error, bookings: bookings ?? [], count: count ?? 0 };
}
