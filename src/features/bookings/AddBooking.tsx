import { HiPlus } from "react-icons/hi2";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateBookingForm from "./CreateBookingForm";

function AddBooking() {
  return (
    <Modal>
      <Modal.Open opens="booking-form">
        <Button size="medium" variation="primary">
          <HiPlus /> New booking
        </Button>
      </Modal.Open>

      <Modal.Window name="booking-form">
        <CreateBookingForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddBooking;
