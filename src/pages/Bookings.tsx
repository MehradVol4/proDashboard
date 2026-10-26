import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";
import AddBooking from "../features/bookings/AddBooking";
import styled from "styled-components";

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

function Bookings() {
  return (
    <>
      <Row type="horizontal" className="page-titlebar">
        <Heading as="h1">
          All <span className="accent-text">bookings</span>
        </Heading>
        <Actions>
          <BookingTableOperations />
          <AddBooking />
        </Actions>
      </Row>

      <BookingTable></BookingTable>
    </>
  );
}

export default Bookings;
