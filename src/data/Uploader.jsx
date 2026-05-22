import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";
import toast from "react-hot-toast";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

// const originalSettings = {
//   minBookingLength: 3,
//   maxBookingLength: 30,
//   maxGuestsPerBooking: 10,
//   breakfastPrice: 15,
// };

async function deleteGuests() {
  const { error } = await supabase.from("guests").delete().not("id", "is", null);
  if (error) throw new Error(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabins").delete().not("id", "is", null);
  if (error) throw new Error(error.message);
}

async function deleteBookings() {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .not("id", "is", null);
  if (error) throw new Error(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) throw new Error(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) throw new Error(error.message);
}

async function createBookings() {
  // Bookings need a guestId and a cabinId. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestIds and cabinIds, and then replace the original IDs in the booking data with the actual ones from the DB
  const { data: guestsIds, error: guestsIdsError } = await supabase
    .from("guests")
    .select("id")
    .order("id");
  if (guestsIdsError) throw new Error(guestsIdsError.message);
  if (!guestsIds?.length) throw new Error("No guests found. Upload guests first.");
  const allGuestIds = guestsIds.map((cabin) => cabin.id);
  const { data: cabinsIds, error: cabinsIdsError } = await supabase
    .from("cabins")
    .select("id")
    .order("id");
  if (cabinsIdsError) throw new Error(cabinsIdsError.message);
  if (!cabinsIds?.length) throw new Error("No cabins found. Upload cabins first.");
  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    // Here relying on the order of cabins, as they don't have and ID yet
    const cabin = cabins.at(booking.cabinId - 1);
    if (!cabin)
      throw new Error(
        `Invalid cabinId=${booking.cabinId} in seed data (no matching cabin).`
      );
    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";

    return {
      ...booking,
      numNights,
      totalPrice,
      guestId: allGuestIds.at(booking.guestId - 1),
      cabinId: allCabinIds.at(booking.cabinId - 1),
      status,
    };
  });

  const { error } = await supabase.from("bookings").insert(finalBookings);
  if (error) throw new Error(error.message);
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    if (
      !window.confirm(
        "This will DELETE and re-upload sample data for bookings, guests, and cabins. Continue?"
      )
    )
      return;

    setIsLoading(true);
    try {
      // Bookings need to be deleted FIRST
      await deleteBookings();
      await deleteGuests();
      await deleteCabins();

      // Bookings need to be created LAST
      await createGuests();
      await createCabins();
      await createBookings();

      toast.success("Sample data uploaded.");
    } catch (err) {
      toast.error(err?.message || "Sample data upload failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadBookings() {
    if (
      !window.confirm(
        "This will DELETE and re-upload sample bookings. Continue?"
      )
    )
      return;

    setIsLoading(true);
    try {
      await deleteBookings();
      await createBookings();
      toast.success("Sample bookings uploaded.");
    } catch (err) {
      toast.error(err?.message || "Bookings upload failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
