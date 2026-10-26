import { useForm } from "react-hook-form";
import styled from "styled-components";
import { differenceInCalendarDays, parseISO } from "date-fns";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import Checkbox from "../../ui/Checkbox";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

import { useCabins } from "../cabins/useCabins";
import { useSettings } from "../settings/useSettings";
import { useGuests } from "../guests/useGuests";
import { useCreateGuest } from "../guests/useCreateGuest";
import { useCreateBooking } from "./useCreateBooking";
import { useCabinBookedRanges } from "./useCabinBookedRanges";
import { formatCurrency } from "../../utils/helpers";

const Summary = styled.div`
  display: grid;
  gap: 0.8rem;
  padding: 1.6rem 2rem;
  background-color: var(--surface-2);
  border: 1px solid var(--border-1);
  border-radius: var(--border-radius-sm);
  font-size: 1.4rem;
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;

  &:last-child {
    padding-top: 0.8rem;
    border-top: 1px solid var(--border-1);
    font-weight: 600;
    font-size: 1.6rem;
  }
`;

const Hint = styled.p`
  font-size: 1.3rem;
  color: var(--color-grey-500);
  margin-top: 0.4rem;
`;

const ConflictList = styled.ul`
  font-size: 1.3rem;
  color: var(--color-red-700);
  margin-top: 0.4rem;
  list-style: disc;
  padding-left: 1.8rem;
`;

function toDayString(value) {
  return value ? String(value).slice(0, 10) : "";
}

function toTimestamp(dayString) {
  return dayString ? `${dayString}T00:00:00.000Z` : null;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function nightsBetween(start, end) {
  if (!start || !end) return 0;
  const nights = differenceInCalendarDays(parseISO(end), parseISO(start));
  return Number.isFinite(nights) ? nights : 0;
}

// A new stay clashes with an existing one when it starts before that one ends
// and ends after that one starts. Dates are plain YYYY-MM-DD, so comparing the
// strings directly is correct.
function findConflicts(bookedRanges, start, end) {
  if (!start || !end) return [];

  return bookedRanges.filter((range) => {
    const rangeStart = toDayString(range.startDate);
    const rangeEnd = toDayString(range.endDate);
    return rangeStart < end && rangeEnd > start;
  });
}

function CreateBookingForm({ onCloseModal }) {
  const { cabins, isPending: isLoadingCabins } = useCabins();
  const { guests, isPending: isLoadingGuests } = useGuests();
  const { settings, isPending: isLoadingSettings } = useSettings();

  const { createBooking, isCreatingBooking } = useCreateBooking();
  const { createGuest, isCreatingGuest } = useCreateGuest();

  const { register, handleSubmit, watch, setValue, formState, setError } =
    useForm({
      defaultValues: {
        cabinId: "",
        guestId: "",
        createNewGuest: false,
        fullName: "",
        email: "",
        nationality: "",
        nationalID: "",
        startDate: todayString(),
        endDate: "",
        numGuests: 1,
        hasBreakfast: false,
        isPaid: false,
        observations: "",
      },
    });

  const { errors } = formState;

  const cabinId = watch("cabinId");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const numGuests = Number(watch("numGuests")) || 0;
  const hasBreakfast = watch("hasBreakfast");
  const isPaid = watch("isPaid");
  const createNewGuest = watch("createNewGuest");

  const { bookedRanges, isPending: isLoadingRanges } =
    useCabinBookedRanges(cabinId);

  if (isLoadingCabins || isLoadingGuests || isLoadingSettings)
    return <Spinner />;

  const isWorking = isCreatingBooking || isCreatingGuest;

  const minBookingLength = Number(settings?.minBookingLength ?? 1);
  const maxBookingLength = Number(settings?.maxBookingLength ?? 90);
  const maxGuestPerBooking = Number(settings?.maxGuestPerBooking ?? 10);
  const breakfastPrice = Number(settings?.breakfastPrice ?? 0);

  const selectedCabin = cabins?.find(
    (cabin) => String(cabin.id) === String(cabinId)
  );

  const numNights = nightsBetween(startDate, endDate);
  const unitPrice = selectedCabin
    ? Number(selectedCabin.regularPrice ?? 0) -
      Number(selectedCabin.discount ?? 0)
    : 0;
  const cabinPrice = unitPrice * Math.max(numNights, 0);
  const extrasPrice = hasBreakfast
    ? breakfastPrice * Math.max(numNights, 0) * Math.max(numGuests, 0)
    : 0;
  const totalPrice = cabinPrice + extrasPrice;

  const conflicts = findConflicts(bookedRanges, startDate, endDate);

  async function onSubmit(data) {
    const nights = nightsBetween(data.startDate, data.endDate);

    // Re-check availability against the freshest data we have, so a stale
    // cache cannot let a double booking through.
    if (findConflicts(bookedRanges, data.startDate, data.endDate).length) {
      setError("endDate", {
        type: "manual",
        message: "The cabin is already booked for these dates",
      });
      return;
    }

    let guestId = data.guestId;

    if (data.createNewGuest) {
      const newGuest = await createGuest({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        nationality: data.nationality?.trim() || null,
        nationalID: data.nationalID?.trim() || null,
      });
      guestId = newGuest?.id;
    }

    if (!guestId) {
      setError("guestId", { type: "manual", message: "Pick or create a guest" });
      return;
    }

    const nightlyPrice =
      Number(selectedCabin?.regularPrice ?? 0) -
      Number(selectedCabin?.discount ?? 0);
    const stayPrice = nightlyPrice * nights;
    const extras = data.hasBreakfast
      ? breakfastPrice * nights * Number(data.numGuests)
      : 0;

    await createBooking({
      cabinId: Number(data.cabinId),
      guestId: Number(guestId),
      startDate: toTimestamp(data.startDate),
      endDate: toTimestamp(data.endDate),
      numNights: nights,
      numGuests: Number(data.numGuests),
      cabinPrice: stayPrice,
      extrasPrice: extras,
      totalPrice: stayPrice + extras,
      status: "unconfirmed",
      hasBreakfast: Boolean(data.hasBreakfast),
      isPaid: Boolean(data.isPaid),
      observations: data.observations?.trim() || "",
    });

    onCloseModal?.();
  }

  const cabinOptions = (cabins ?? []).map((cabin) => ({
    value: String(cabin.id),
    label: `${cabin.name} — up to ${cabin.maxCapacity} guests, ${formatCurrency(
      Number(cabin.regularPrice ?? 0) - Number(cabin.discount ?? 0)
    )}/night`,
  }));

  const guestOptions = (guests ?? []).map((guest) => ({
    value: String(guest.id),
    label: guest.email ? `${guest.fullName} — ${guest.email}` : guest.fullName,
  }));

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <Select
          id="cabinId"
          disabled={isWorking}
          options={cabinOptions}
          {...register("cabinId", { required: "Pick a cabin" })}
        >
          <option value="">Select a cabin...</option>
        </Select>
      </FormRow>

      <FormRow label="Guest" error={errors?.guestId?.message}>
        <Select
          id="guestId"
          disabled={isWorking || createNewGuest}
          options={guestOptions}
          {...register("guestId", {
            validate: (value) =>
              createNewGuest || value ? true : "Pick or create a guest",
          })}
        >
          <option value="">Select a guest...</option>
        </Select>
      </FormRow>

      <FormRow label="New guest">
        <Checkbox
          id="createNewGuest"
          checked={createNewGuest}
          disabled={isWorking}
          onChange={() => {
            setValue("createNewGuest", !createNewGuest);
            setValue("guestId", "");
          }}
        >
          This guest is not in the system yet
        </Checkbox>
      </FormRow>

      {createNewGuest && (
        <>
          <FormRow label="Full name" error={errors?.fullName?.message}>
            <Input
              type="text"
              id="fullName"
              disabled={isWorking}
              {...register("fullName", {
                validate: (value) =>
                  !createNewGuest || value.trim()
                    ? true
                    : "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Email" error={errors?.email?.message}>
            <Input
              type="email"
              id="email"
              disabled={isWorking}
              {...register("email", {
                validate: (value) =>
                  !createNewGuest || value.trim()
                    ? true
                    : "This field is required",
              })}
            />
          </FormRow>

          <FormRow label="Nationality">
            <Input
              type="text"
              id="nationality"
              disabled={isWorking}
              {...register("nationality")}
            />
          </FormRow>

          <FormRow label="National ID">
            <Input
              type="text"
              id="nationalID"
              disabled={isWorking}
              {...register("nationalID")}
            />
          </FormRow>
        </>
      )}

      <FormRow label="Check in" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          min={todayString()}
          disabled={isWorking}
          {...register("startDate", {
            required: "This field is required",
            validate: (value) =>
              value >= todayString() || "Check in cannot be in the past",
          })}
        />
      </FormRow>

      <FormRow label="Check out" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          min={startDate || todayString()}
          disabled={isWorking}
          {...register("endDate", {
            required: "This field is required",
            validate: (value) => {
              const nights = nightsBetween(startDate, value);
              if (nights < 1) return "Check out must be after check in";
              if (nights < minBookingLength)
                return `Minimum stay is ${minBookingLength} nights`;
              if (nights > maxBookingLength)
                return `Maximum stay is ${maxBookingLength} nights`;
              if (findConflicts(bookedRanges, startDate, value).length)
                return "The cabin is already booked for these dates";
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Number of guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          min={1}
          disabled={isWorking}
          {...register("numGuests", {
            required: "This field is required",
            valueAsNumber: true,
            min: { value: 1, message: "At least one guest" },
            validate: (value) => {
              if (value > maxGuestPerBooking)
                return `Up to ${maxGuestPerBooking} guests per booking`;
              if (selectedCabin && value > Number(selectedCabin.maxCapacity))
                return `${selectedCabin.name} holds ${selectedCabin.maxCapacity} guests`;
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Breakfast">
        <Checkbox
          id="hasBreakfast"
          checked={hasBreakfast}
          disabled={isWorking}
          onChange={() => setValue("hasBreakfast", !hasBreakfast)}
        >
          Include breakfast at {formatCurrency(breakfastPrice)} per guest per
          night
        </Checkbox>
      </FormRow>

      <FormRow label="Payment">
        <Checkbox
          id="isPaid"
          checked={isPaid}
          disabled={isWorking}
          onChange={() => setValue("isPaid", !isPaid)}
        >
          The guest has already paid
        </Checkbox>
      </FormRow>

      <FormRow label="Observations">
        <Textarea
          id="observations"
          disabled={isWorking}
          {...register("observations")}
        />
      </FormRow>

      <FormRow label="Summary">
        <div>
          <Summary>
            <SummaryLine>
              <span>
                {selectedCabin ? selectedCabin.name : "No cabin selected"}
                {numNights > 0
                  ? ` / ${numNights} night${numNights === 1 ? "" : "s"}`
                  : ""}
              </span>
              <span>{formatCurrency(cabinPrice)}</span>
            </SummaryLine>
            <SummaryLine>
              <span>Breakfast</span>
              <span>
                {hasBreakfast ? formatCurrency(extrasPrice) : "Not included"}
              </span>
            </SummaryLine>
            <SummaryLine>
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </SummaryLine>
          </Summary>

          {!cabinId && <Hint>Pick a cabin to check its availability.</Hint>}

          {cabinId && isLoadingRanges && <Hint>Checking availability...</Hint>}

          {cabinId && !isLoadingRanges && conflicts.length > 0 && (
            <ConflictList>
              {conflicts.map((range) => (
                <li key={range.id}>
                  Booked {toDayString(range.startDate)} to{" "}
                  {toDayString(range.endDate)} ({range.status})
                </li>
              ))}
            </ConflictList>
          )}

          {cabinId &&
            !isLoadingRanges &&
            conflicts.length === 0 &&
            numNights > 0 && <Hint>These dates are free.</Hint>}
        </div>
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="button"
          disabled={isWorking}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>Create booking</Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
