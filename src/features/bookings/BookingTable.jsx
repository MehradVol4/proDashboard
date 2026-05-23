import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useBookings } from "./useBookings";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 10;

function BookingTable() {
  const [searchParams] = useSearchParams();

  const { isPending, error, bookings = [] } = useBookings();

  if (isPending) return <Spinner />
  if (error) return <Empty resourceName={error.message || "bookings"} />
  if (!bookings.length) return <Empty resourceName='bookings' />

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(bookings.length / PAGE_SIZE);
  const safePage =
    Number.isFinite(currentPage) && currentPage > 0
      ? Math.min(currentPage, pageCount)
      : 1;

  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const bookingsPage = bookings.slice(start, end);

  return (
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
          data={bookingsPage}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={bookings.length} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;
