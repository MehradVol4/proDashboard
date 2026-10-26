import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";


export function useSettings() {
    const { isPending, error, data: settings } = useQuery({
        queryKey: ['settings'],
        queryFn: getSettings,
        // The app shell waits on this query, so don't sit behind three retries
        // when the table or the row is missing.
        retry: 1,
    });

    return { isPending, error, settings };
}