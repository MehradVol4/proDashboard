import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";
import Empty from "../../ui/Empty";

function CabinTable() {

  const { isPending, cabins = [] } = useCabins();
  const [searchParams] = useSearchParams();
  if (!cabins) return <Empty resourceName='cabins' />
  if (isPending) return <Spinner />
  // FILTER
  const filterValue = searchParams.get('discount') || 'all';

  let filteredCabins;
  if (filterValue === 'all') filteredCabins = cabins;
  if (filterValue === 'no-discount') filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  if (filterValue === 'with-discount') filteredCabins = cabins.filter((cabin) => cabin.discount > 0);

  //SORT

  const sortBy = searchParams.get('sortBy') || 'name-asc';
  const [field, direction] = sortBy.split('-');
  const modifier = direction === 'asc' ? 1 : -1;
  const sortedCabins = [...filteredCabins].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "string" || typeof bValue === "string")
      return String(aValue).localeCompare(String(bValue)) * modifier;

    return (aValue - bValue) * modifier;
  });



  return (
    <Menus>

      <Table columns='0.6fr 1.8fr 2.2fr 1fr 1fr 1fr'>

        <Table.Header role='row'>

          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>

        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />

      </Table>

    </Menus>
  )
}

export default CabinTable
