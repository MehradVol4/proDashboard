import { api } from "./apiClient";
import { getToday } from "../utils/helpers";

function buildQuery(params) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getBookings({ filter, sortBy, page } = {}) {
  const query = buildQuery({
    // The only filter the bookings table offers is by status.
    status: filter?.value,
    sortBy: sortBy ? `${sortBy.field}-${sortBy.direction}` : undefined,
    page,
  });

  return api.get(`/bookings${query}`);
}

export async function getBooking(id) {
  return api.get(`/bookings/${id}`);
}

// Returns all BOOKINGS created after the given date. Useful to get bookings
// created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  return api.get(`/bookings/created-after?date=${encodeURIComponent(date)}`);
}

// Returns all STAYS that started after the given date
export async function getStaysAfterDate(date) {
  return api.get(`/bookings/stays-after?date=${encodeURIComponent(date)}`);
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  return api.get("/bookings/today-activity");
}

export async function createBooking(newBooking) {
  return api.post("/bookings", newBooking);
}

// Every booking of a cabin that has not ended yet. Used to stop the new-booking
// form from double-booking a cabin.
export async function getCabinBookedRanges(cabinId) {
  if (cabinId === null || cabinId === undefined || cabinId === "") return [];

  return api.get(`/bookings/cabin/${cabinId}/ranges`);
}

// Full stay history for one guest, newest arrival first.
export async function getBookingsByGuest(guestId) {
  return api.get(`/bookings/guest/${guestId}`);
}

export async function updateBooking(id, obj) {
  return api.patch(`/bookings/${id}`, obj);
}

export async function deleteBooking(id) {
  await api.delete(`/bookings/${id}`);
  return id;
}

// Kept so callers that still want "the end of today" have one place to get it.
export { getToday };
