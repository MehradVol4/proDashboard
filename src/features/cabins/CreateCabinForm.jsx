import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { createEditCabin } from "../../services/apiCabins";
import FormRow from "../../ui/FormRow";


function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, getValues, formState } = useForm(
    {
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New Cabin Created!");
      queryClient.invalidateQueries({
        queryKey: ['cabin'],
      });
      reset();
    },
    onError: (err) => toast.error(err.message)
  });


  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: (newCabinData, id) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin Edited!");
      queryClient.invalidateQueries({
        queryKey: ['cabin'],
      });
      reset();
    },
    onError: (err) => toast.error(err.message)
  });

  const isWorking = isCreating || isEditing;


  function onSubmit(data) {

    const image = typeof data.image === 'string' ? data.image : data.image[0];

    if (isEditSession) {
      editCabin({ newCabinData: { ...data, image }, id: editId });
    } else {
      createCabin({ ...data, image: image });
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
            { required: 'This field is required' })} />
      </FormRow>

      <FormRow label='Regular Price' error={errors?.regularPrice?.message}>
        <Input
          type="number"
          disabled={isWorking}
          id="regularPrice"{...register("regularPrice",
            {
              required: 'This field is required',
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
          defaultValue={0} {...register("discount",
            {
              required: 'This field is required',
              validate: (value) => value <= getValues().regularPrice || 'Discount should be less than regular price',
            })} />
      </FormRow>

      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue={0} {...register("description", { required: 'This field is required' })} />
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
