import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";

function Bookings() {
  return (
    <>
      <Row type="horizontal" className="page-titlebar">
        <Heading as="h1">
          All <span className="accent-text">bookings</span>
        </Heading>
        <BookingTableOperations />
      </Row>

      <BookingTable></BookingTable>
    </>
  );
}

export default Bookings;
