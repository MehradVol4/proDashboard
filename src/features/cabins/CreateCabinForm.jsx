import { useForm } from "react-hook-form";
import useCreateCabin from "./useCreateCabin";



import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useEditCabin } from "./useEditCabin";


function CreateCabinForm({ cabinToEdit = {} }) {

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();
  const isWorking = isCreating || isEditing;

  const { id: rawEditId, ...editValues } = cabinToEdit;

  const editId =
    rawEditId && typeof rawEditId === "object"
      ? rawEditId.id ?? rawEditId.value ?? rawEditId.raw ?? null
      : rawEditId;

  const isEditSession = editId !== null && editId !== undefined && editId !== "";

  const { register, handleSubmit, reset, getValues, formState } = useForm(
    {
      defaultValues: isEditSession ? editValues : { discount: 0 },
    });

  const { errors } = formState;




  function onSubmit(data) {

    const image =
      typeof data.image === "string"
        ? data.image
        : data.image?.length
          ? data.image[0]
          : editValues.image;

    if (isEditSession) {
      editCabin({ newCabinData: { ...data, image }, id: editId }, {
        onSuccess: (data) => {
          reset(data);
        }
      });
    } else {
      createCabin({ newCabinData: { ...data, image } }, {
        onSuccess: (data) => {
          reset(data);
        },
      });
    }

  };

  function onError(errors) {
    console.log(errors)
  };


  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>

      <FormRow label='Cabin name' error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label='Max Capacity' error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking} {...register("maxCapacity",
            { required: 'This field is required', valueAsNumber: true })} />
      </FormRow>

      <FormRow label='Regular Price' error={errors?.regularPrice?.message}>
        <Input
          type="number"
          disabled={isWorking}
          id="regularPrice"{...register("regularPrice",
            {
              required: 'This field is required',
              valueAsNumber: true,
              min: {
                value: 2,
                message: 'blah'
              }
            })} />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          {...register("discount",
            {
              required: 'This field is required',
              valueAsNumber: true,
              validate: (value) => {
                const regularPrice = getValues("regularPrice");
                if (regularPrice === undefined || regularPrice === null || Number.isNaN(regularPrice))
                  return true;
                return value <= regularPrice || 'Discount should be less than regular price';
              },
            })} />
      </FormRow>

      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea
          type="text"
          id="description"
          disabled={isWorking}
          {...register("description", { required: 'This field is required' })} />
      </FormRow>

      <FormRow label="Cabin photo" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", { required: isEditSession ? false : 'This field is required' })} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isWorking}>{isEditSession ? 'Edit Cabin' : "Add Cabin"}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
