import { useState } from "react";

// The API's reset link lands on /reset-password?token=<token>. There is no
// session to exchange any more: the token itself is the credential, and it is
// checked when the new password is submitted.
export function useRecoverySession() {
    const [token] = useState(() => {
        if (typeof window === "undefined") return "";
        return new URLSearchParams(window.location.search).get("token") ?? "";
    });

    return {
        token,
        status: token ? "ready" : "invalid",
        errorMessage: token
            ? ""
            : "This reset link is missing its token. Request a new one.",
    };
}

export default useRecoverySession;
