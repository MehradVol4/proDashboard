import { api, toFormData } from "./apiClient";

export async function getCabins() {
    return api.get("/cabins");
}

// One entry point for both create and edit, because that is how the cabin form
// and its hooks already call it. `image` is either a File picked in the form or
// the URL of an image the server already has (the "duplicate cabin" path).
export async function createEditCabin({ newCabinData, id } = {}) {
    const newCabin = newCabinData;

    if (!newCabin || typeof newCabin !== "object")
        throw new Error("Invalid cabin data.");

    const isFileImage =
        typeof File !== "undefined" && newCabin.image instanceof File;
    const hasImageUrl =
        typeof newCabin.image === "string" && newCabin.image.trim() !== "";

    if (!isFileImage && !hasImageUrl)
        throw new Error("Please provide a cabin image file.");

    if (!newCabin.name) throw new Error("Cabin name is required.");

    const fields = {
        name: newCabin.name,
        maxCapacity: Number(newCabin.maxCapacity),
        regularPrice: Number(newCabin.regularPrice),
        discount: Number(newCabin.discount ?? 0),
        description: newCabin.description ?? "",
        image: newCabin.image,
    };

    if (Number.isNaN(fields.maxCapacity))
        throw new Error("Max capacity must be a number.");
    if (Number.isNaN(fields.regularPrice))
        throw new Error("Regular price must be a number.");
    if (Number.isNaN(fields.discount))
        throw new Error("Discount must be a number.");

    // Multipart either way: the server reads an uploaded file when there is
    // one and falls back to the `image` field when it holds a URL.
    const body = toFormData(fields);

    return id ? api.patch(`/cabins/${id}`, body) : api.post("/cabins", body);
}

export async function deleteCabins(id) {
    if (id === null || id === undefined)
        throw new Error(`Invalid cabin id: ${String(id)}`);

    return api.delete(`/cabins/${id}`);
}
