import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";

import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { Flag } from "../../ui/Flag";
import CreateGuestForm from "./CreateGuestForm";
import { useDeleteGuest } from "./useDeleteGuest";

const Name = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Identity = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const Muted = styled.div`
  color: var(--color-grey-500);
`;

const Mono = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function GuestRow({ guest }) {
  const navigate = useNavigate();
  const { deleteGuest, isDeletingGuest } = useDeleteGuest();

  const {
    id: guestId,
    fullName,
    email,
    nationality,
    nationalID,
    countryFlag,
  } = guest;

  return (
    <Table.Row>
      <Identity>
        {countryFlag && (
          <Flag
            src={countryFlag}
            alt={nationality ? `Flag of ${nationality}` : "Flag"}
          />
        )}
        <Name>{fullName}</Name>
      </Identity>

      <div>{email}</div>

      {nationality ? <div>{nationality}</div> : <Muted>&mdash;</Muted>}

      {nationalID ? <Mono>{nationalID}</Mono> : <Muted>&mdash;</Muted>}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={guestId} />
            <Menus.List id={guestId}>
              <Menus.Button
                icon={<HiEye />}
                onClick={() => navigate(`/guests/${guestId}`)}
              >
                See details
              </Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="edit">
            <CreateGuestForm guestToEdit={guest} />
          </Modal.Window>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="guest"
              disabled={isDeletingGuest}
              onConfirm={() => deleteGuest(guestId)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default GuestRow;
