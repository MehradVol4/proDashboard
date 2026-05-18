import supabase, { supabaseUrl } from "./supabase";

function unwrapId(value) {
    if (value === null || value === undefined) return null;
    if (typeof value === "number" || typeof value === "string") return value;
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "object") {
        if (typeof value.valueOf === "function") {
            const primitive = value.valueOf();
            if (primitive !== value) return unwrapId(primitive);
        }
        if ("id" in value) return unwrapId(value.id);
        if ("value" in value) return unwrapId(value.value);
        if ("raw" in value) return unwrapId(value.raw);
        if ("_id" in value) return unwrapId(value._id);

        const objectValues = Object.values(value);
        if (objectValues.length === 1) return unwrapId(objectValues[0]);
    }
    return value;
}

export async function getCabins() {

    const { data, error } = await supabase
        .from('cabins')
        .select('*');

    if (error) {
        console.error(error);
        throw new Error('cabins could not be loaded');
    }

    return data?.map((cabin) => {
        const rawId = unwrapId(cabin.id);
        const normalizedId =
            typeof rawId === "string" && rawId.trim() !== "" && Number.isFinite(Number(rawId))
                ? Number(rawId)
                : rawId;
        return { ...cabin, id: normalizedId };
    });
}

export async function createEditCabin({ newCabinData, id } = {}) {
    const newCabin = newCabinData;
    if (!newCabin || typeof newCabin !== "object") {
        throw new Error("Invalid cabin data.");
    }
    const isFileImage =
        typeof File !== "undefined" && newCabin.image instanceof File;
    const hasImagePath =
        typeof newCabin.image === "string" && newCabin.image.startsWith(supabaseUrl);

    if (!isFileImage && !hasImagePath) {
        throw new Error("Please provide a cabin image file.");
    }

    const rawCabinId = unwrapId(id);
    const cabinId =
        rawCabinId === null || rawCabinId === undefined
            ? null
            : typeof rawCabinId === "number"
                ? rawCabinId
                : typeof rawCabinId === "string" && rawCabinId.trim() !== "" && Number.isFinite(Number(rawCabinId))
                    ? Number(rawCabinId)
                    : rawCabinId;
    if (id !== undefined && id !== null && (cabinId === null || typeof cabinId === "object")) {
        throw new Error(`Invalid cabin id: ${String(id)}`);
    }
    if (id !== undefined && id !== null && typeof cabinId === "string") {
        const trimmed = cabinId.trim();
        if (trimmed === "" || !Number.isFinite(Number(trimmed))) {
            throw new Error(`Invalid cabin id: ${String(id)}`);
        }
    }

    const cabinPayload = {
        name: newCabin.name,
        maxCapacity: Number(newCabin.maxCapacity),
        regularPrice: Number(newCabin.regularPrice),
        discount: Number(newCabin.discount ?? 0),
        description: newCabin.description,
    };

    if (!cabinPayload.name) throw new Error("Cabin name is required.");
    if (Number.isNaN(cabinPayload.maxCapacity))
        throw new Error("Max capacity must be a number.");
    if (Number.isNaN(cabinPayload.regularPrice))
        throw new Error("Regular price must be a number.");
    if (Number.isNaN(cabinPayload.discount))
        throw new Error("Discount must be a number.");

    for (const [key, value] of Object.entries(cabinPayload)) {
        if (value !== null && typeof value === "object") {
            throw new Error(`Invalid value for ${key}: ${String(value)}`);
        }
    }

    const imageName = isFileImage
        ? `${(crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`)}-${newCabin.image.name}`.replaceAll("/", "")
        : null;
    const imagePath = hasImagePath
        ? newCabin.image
        : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

    let query = supabase.from('cabins')
    //  CREATE
    if (!cabinId)
        query = query.insert([{ ...cabinPayload, image: imagePath }]);
    //  EDIT
    if (cabinId) query = query.update({ ...cabinPayload, image: imagePath }).eq('id', cabinId);
    const { data, error } = await query.select().single();

    if (error) {
        console.error(error);
        const messageParts = [
            error.message,
            error.details,
            error.hint,
            `(id=${cabinId ?? "null"})`,
        ].filter(Boolean);
        throw new Error(messageParts.join(" | ") || "Cabin could not be created");
    }

    if (isFileImage) {
        const { error: storageError } = await supabase.storage
            .from("cabin-images")
            .upload(imageName, newCabin.image);

        if (storageError) {
            if (!cabinId) await supabase.from("cabins").delete().eq("id", data.id);
            console.error(storageError);
            throw new Error(storageError.message || "Cabin image could not be uploaded");
        }
    }

    return data;
};


export async function deleteCabins(id) {
    const cabinId = unwrapId(id);
    if (cabinId === null || cabinId === undefined || typeof cabinId === "object") {
        throw new Error(`Invalid cabin id: ${String(id)}`);
    }
    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq("id", cabinId);

    if (error) {
        console.error(error);
        throw new Error('cabins could not be deleted');
    }

    return data;
}
