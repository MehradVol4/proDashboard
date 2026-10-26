import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import { useCreateGuest } from "./useCreateGuest";
import { useUpdateGuest } from "./useUpdateGuest";

function CreateGuestForm({ guestToEdit = {}, onCloseModal }) {
  const { createGuest, isCreatingGuest } = useCreateGuest();
  const { updateGuest, isUpdatingGuest } = useUpdateGuest();
  const isWorking = isCreatingGuest || isUpdatingGuest;

  const { id: editId, ...guestFields } = guestToEdit;
  const isEditSession = Boolean(editId);

  // created_at is read-only, and react-hook-form would otherwise send it back.
  const editValues = { ...guestFields };
  delete editValues.created_at;

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;

  async function onSubmit(data) {
    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      nationality: data.nationality?.trim() || null,
      nationalID: data.nationalID?.trim() || null,
      countryFlag: data.countryFlag?.trim() || null,
    };

    if (isEditSession) {
      updateGuest(
        { id: editId, newGuestData: payload },
        {
          onSuccess: () => {
            onCloseModal?.();
          },
        }
      );
      return;
    }

    try {
      await createGuest(payload);
      reset();
      onCloseModal?.();
    } catch {
      // useCreateGuest already reports the failure; keep what was typed so it
      // can be corrected and sent again.
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isWorking}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isWorking}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email",
            },
          })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          disabled={isWorking}
          {...register("nationality")}
        />
      </FormRow>

      <FormRow label="National ID" error={errors?.nationalID?.message}>
        <Input
          type="text"
          id="nationalID"
          disabled={isWorking}
          {...register("nationalID")}
        />
      </FormRow>

      <FormRow label="Flag image URL" error={errors?.countryFlag?.message}>
        <Input
          type="url"
          id="countryFlag"
          placeholder="https://flagcdn.com/pt.svg"
          disabled={isWorking}
          {...register("countryFlag")}
        />
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
        <Button disabled={isWorking}>
          {isEditSession ? "Save changes" : "Add guest"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateGuestForm;
