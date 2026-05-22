import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
    return (
        <TableOperations>
            <Filter filterField='discount' options={[
                { value: 'all', label: 'All' },
                { value: 'no-discount', label: 'No discount' },
                { value: 'with-discount', label: 'With discount' },
            ]} />

            <SortBy options={[
                { value: 'name-asc', label: 'Sort by name (A-Z)' },
                { value: 'name-desc', label: 'Sort by name (Z-A)' },
                { value: 'regularPrice-asc', label: 'Regular Price low to high' },
                { value: 'regularPrice-desc', label: 'Regular Price high to low' },
                { value: 'maxCapacity-asc', label: 'Max Capacity low to high' },
                { value: 'maxCapacity-desc', label: 'Max Capacity high to low' },
            ]} />
        </TableOperations>
    );
};

export default CabinTableOperations
