import { api } from "./apiClient";

function buildQuery(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

// Unpaginated: the booking form's picker and the activity feed both want the
// whole list at once.
export async function getGuests() {
  return api.get("/guests/all");
}

export async function getGuestsPage({ search, sortBy, page } = {}) {
  const query = buildQuery({
    search,
    sortBy: sortBy ? `${sortBy.field}-${sortBy.direction}` : undefined,
    page,
  });

  return api.get(`/guests${query}`);
}

export async function getGuest(id) {
  return api.get(`/guests/${id}`);
}

export async function createGuest(newGuest) {
  return api.post("/guests", newGuest);
}

export async function updateGuest(id, obj) {
  return api.patch(`/guests/${id}`, obj);
}

export async function deleteGuest(id) {
  await api.delete(`/guests/${id}`);
  return id;
}
