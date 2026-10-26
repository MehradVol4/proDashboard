import { useSearchParams } from "react-router-dom";

import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import GuestRow from "./GuestRow";
import { useGuestsPage } from "./useGuestsPage";

function GuestTable() {
  const { isPending, error, guests, count } = useGuestsPage();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";

  if (isPending) return <Spinner />;
  if (error) return <Empty resourceName={error.message || "guests"} />;

  if (!count)
    return (
      <Empty
        resourceName={search ? `guests matching "${search}"` : "guests"}
      />
    );

  return (
    <Menus>
      <Table columns="2.4fr 2.4fr 1.4fr 1.4fr 3.2rem">
        <Table.Header>
          <div>Guest</div>
          <div>Email</div>
          <div>Nationality</div>
          <div>National ID</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={guests}
          render={(guest) => <GuestRow key={guest.id} guest={guest} />}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default GuestTable;
