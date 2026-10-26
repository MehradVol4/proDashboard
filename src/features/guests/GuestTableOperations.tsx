import SortBy from "../../ui/SortBy";
import SearchInput from "../../ui/SearchInput";
import TableOperations from "../../ui/TableOperations";

function GuestTableOperations() {
  return (
    <TableOperations>
      <SearchInput placeholder="Search name, email, ID..." />

      <SortBy
        options={[
          { value: "fullName-asc", label: "Sort by name (A–Z)" },
          { value: "fullName-desc", label: "Sort by name (Z–A)" },
          { value: "created_at-desc", label: "Sort by added (newest first)" },
          { value: "created_at-asc", label: "Sort by added (oldest first)" },
          { value: "nationality-asc", label: "Sort by nationality (A–Z)" },
        ]}
      />
    </TableOperations>
  );
}

export default GuestTableOperations;
