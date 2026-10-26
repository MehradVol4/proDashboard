import { api, clearToken, setToken, toFormData } from "./apiClient";

export async function login({ email, password }) {
    const data = await api.post("/auth/login", { email, password }, { auth: false });

    setToken(data?.session?.token);
    return data;
}

// Creating a staff account from the Users page. The returned token is
// deliberately discarded: the admin doing this stays signed in as themselves.
export async function signup({ fullName, email, password }) {
    const data = await api.post("/auth/signup", { fullName, email, password });
    return { user: data?.user, session: null };
}

export async function getCurrentUser() {
    if (!localStorageHasToken()) return null;

    try {
        return await api.get("/auth/me");
    } catch (err) {
        // An expired or revoked token should log the person out rather than
        // leaving the app retrying forever.
        if (err.status === 401) {
            clearToken();
            return null;
        }
        throw err;
    }
}

function localStorageHasToken() {
    try {
        return Boolean(window.localStorage.getItem("proDashboard.token"));
    } catch {
        return false;
    }
}

export async function logout() {
    // Nothing to invalidate server side: the JWT simply stops being sent.
    clearToken();
}

export async function updateCurrentUser({ password, fullName, avatar }) {
    if (!password && !fullName && !avatar) return null;

    const body = avatar
        ? toFormData({ fullName, password, avatar })
        : { ...(fullName ? { fullName } : {}), ...(password ? { password } : {}) };

    return api.patch("/auth/me", body);
}

// --- Password recovery -----------------------------------------------------

export async function requestPasswordReset({ email }) {
    return api.post("/auth/forgot-password", { email }, { auth: false });
}

export async function updatePassword({ password, token }) {
    const data = await api.post(
        "/auth/reset-password",
        { password, token },
        { auth: false }
    );

    setToken(data?.session?.token);
    return data;
}
