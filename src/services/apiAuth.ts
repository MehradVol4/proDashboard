import supabase, { supabaseUrl } from "./supabase";

export async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error)
        throw new Error(error.message)

    return data;

}

export async function signup({ fullName, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                avatar: '',
            },
        },
    });

    if (error) throw new Error(error.message);

    return data;
}

export async function getCurrentUser() {

    const { data: session } = await supabase.auth.getSession();

    if (!session.session) return null;

    const { data, error } = await supabase.auth.getUser()

    if (error) throw new Error(error.message);

    return data?.user;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}


export async function updateCurrentUser({ password, fullName, avatar }) {
    if (!password && !fullName && !avatar) return null;

    const updateData = {};

    if (password) updateData.password = password;
    if (fullName) updateData.data = { ...(updateData.data ?? {}), fullName };

    if (avatar) {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw new Error(userError.message);
        if (!user) throw new Error("No authenticated user found.");

        const fileName = `avatar-${user.id}-${Math.random()}`;

        const { error: storageError } = await supabase.storage
            .from("avatars")
            .upload(fileName, avatar);
        if (storageError) throw new Error(storageError.message);

        updateData.data = {
            ...(updateData.data ?? {}),
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
        };
    }

    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) throw new Error(error.message);
    return data;
}
