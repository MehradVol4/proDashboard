import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";



export function useUpdateSetting() {

    const queryClient = useQueryClient();
    const { mutate: updateSetting, isPending: isUpdating } = useMutation({
        mutationFn: updateSettingApi,
        onSuccess: () => {
            toast.success("Setting successfully edited");
            // Currency, locale and the hotel name are rendered by screens that
            // don't read `settings` themselves, so refresh everything once.
            queryClient.invalidateQueries();
        },
        onError: (err) => toast.error(err.message),
    });

    return { isUpdating, updateSetting };
};

