import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  HiOutlineEnvelope,
  HiOutlineFlag,
  HiOutlineIdentification,
  HiPencil,
} from "react-icons/hi2";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import DataItem from "../../ui/DataItem";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { Flag } from "../../ui/Flag";

import { useMoveBack } from "../../hooks/useMoveBack";
import { formatCurrency } from "../../utils/helpers";
import BookingRow from "../bookings/BookingRow";
import CreateGuestForm from "./CreateGuestForm";
import { useGuest } from "./useGuest";
import { useGuestBookings } from "./useGuestBookings";
import { useDeleteGuest } from "./useDeleteGuest";

const HeadingGroup = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
`;

const Card = styled.section`
  background-color: var(--surface-1);
  border: 1px solid var(--border-1);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: 2.4rem 4rem;
  display: grid;
  gap: 0.4rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.6rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: var(--surface-2);
  border: 1px solid var(--border-1);
  border-radius: var(--border-radius-sm);
  padding: 1.6rem 2rem;
  display: grid;
  gap: 0.4rem;
`;

const StatLabel = styled.span`
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-500);
`;

const StatValue = styled.span`
  font-size: 2rem;
  font-weight: 600;
  font-family: "Sono";
  color: var(--color-grey-700);
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-grey-700);
`;

function GuestDetail() {
  const { guest, isPending, error } = useGuest();
  const { bookings, isPending: isLoadingBookings } = useGuestBookings(guest?.id);
  const { deleteGuest, isDeletingGuest } = useDeleteGuest();
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (isPending) return <Spinner />;
  if (error) return <Empty resourceName={error.message || "guest"} />;
  if (!guest) return <Empty resourceName="guest" />;

  const {
    id: guestId,
    fullName,
    email,
    nationality,
    nationalID,
    countryFlag,
    created_at,
  } = guest;

  const numBookings = bookings.length;
  const totalNights = bookings.reduce(
    (acc, booking) => acc + Number(booking.numNights ?? 0),
    0
  );
  // Only count what the guest has actually settled.
  const totalPaid = bookings.reduce(
    (acc, booking) =>
      booking.isPaid ? acc + Number(booking.totalPrice ?? 0) : acc,
    0
  );

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          {countryFlag && (
            <Flag
              src={countryFlag}
              alt={nationality ? `Flag of ${nationality}` : "Flag"}
            />
          )}
          <Heading as="h1">{fullName}</Heading>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <Card>
        <DataItem icon={<HiOutlineEnvelope />} label="Email">
          {email}
        </DataItem>

        <DataItem icon={<HiOutlineFlag />} label="Nationality">
          {nationality || "Not recorded"}
        </DataItem>

        <DataItem icon={<HiOutlineIdentification />} label="National ID">
          {nationalID || "Not recorded"}
        </DataItem>

        {created_at && (
          <DataItem icon={<HiOutlineIdentification />} label="Guest since">
            {format(new Date(created_at), "MMM dd yyyy")}
          </DataItem>
        )}
      </Card>

      <StatsGrid>
        <StatCard>
          <StatLabel>Bookings</StatLabel>
          <StatValue>{isLoadingBookings ? "—" : numBookings}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Nights stayed</StatLabel>
          <StatValue>{isLoadingBookings ? "—" : totalNights}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Paid to date</StatLabel>
          <StatValue>
            {isLoadingBookings ? "—" : formatCurrency(totalPaid)}
          </StatValue>
        </StatCard>
      </StatsGrid>

      <SectionTitle>Booking history</SectionTitle>

      {isLoadingBookings ? (
        <Spinner />
      ) : numBookings === 0 ? (
        <Empty resourceName="bookings for this guest" />
      ) : (
        <Menus>
          <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
            <Table.Header>
              <div>Cabin</div>
              <div>Guest</div>
              <div>Dates</div>
              <div>Status</div>
              <div>Amount</div>
              <div></div>
            </Table.Header>

            <Table.Body
              data={bookings}
              render={(booking) => (
                <BookingRow key={booking.id} booking={booking} />
              )}
            />
          </Table>
        </Menus>
      )}

      <ButtonGroup>
        <Modal>
          <Modal.Open opens="edit-guest">
            <Button icon={<HiPencil />}>Edit guest</Button>
          </Modal.Open>
          <Modal.Window name="edit-guest">
            <CreateGuestForm guestToEdit={guest} />
          </Modal.Window>

          <Modal.Open opens="delete-guest">
            <Button variation="danger">Delete guest</Button>
          </Modal.Open>
          <Modal.Window name="delete-guest">
            <ConfirmDelete
              resourceName="guest"
              disabled={isDeletingGuest}
              onConfirm={() =>
                deleteGuest(guestId, {
                  onSuccess: () => navigate("/guests", { replace: true }),
                })
              }
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default GuestDetail;
