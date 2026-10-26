import { HiPlus } from "react-icons/hi2";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateGuestForm from "./CreateGuestForm";

function AddGuest() {
  return (
    <Modal>
      <Modal.Open opens="guest-form">
        <Button size="medium" variation="primary">
          <HiPlus /> Add guest
        </Button>
      </Modal.Open>

      <Modal.Window name="guest-form">
        <CreateGuestForm />
      </Modal.Window>
    </Modal>
  );
}

export default AddGuest;
