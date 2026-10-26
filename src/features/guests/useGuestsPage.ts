import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getGuestsPage } from "../../services/apiGuests";
import { PAGE_SIZE } from "../../utils/constants";

export function useGuestsPage() {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const search = searchParams.get("search") ?? "";

    const sortByRaw = searchParams.get("sortBy") || "fullName-asc";
    const [field, direction] = sortByRaw.split("-");
    const sortBy = { field, direction };

    const rawPage = searchParams.get("page");
    const page = rawPage ? Number(rawPage) : 1;
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;

    const {
        isPending,
        data: { data: guests, count } = {},
        error,
    } = useQuery({
        queryKey: ["guests", "page", search, sortBy, safePage],
        queryFn: () => getGuestsPage({ search, sortBy, page: safePage }),
        retry: false,
    });

    const pageCount = Math.ceil((count ?? 0) / PAGE_SIZE);

    if (safePage < pageCount)
        queryClient.prefetchQuery({
            queryKey: ["guests", "page", search, sortBy, safePage + 1],
            queryFn: () =>
                getGuestsPage({ search, sortBy, page: safePage + 1 }),
        });

    return { isPending, error, guests: guests ?? [], count: count ?? 0 };
}
