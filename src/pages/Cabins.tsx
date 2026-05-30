import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable";
import AddCabin from "../features/cabins/AddCabin";
import CabinTableOperations from "../features/cabins/CabinTableOperations";
import styled from "styled-components";

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

function Cabins() {

  return (
    <>
      <Row type="horizontal" className="page-titlebar">
        <Heading as="h1">
          All <span className="accent-text">cabins</span>
        </Heading>
        <Actions>
          <CabinTableOperations />
          <AddCabin />
        </Actions>
      </Row>

      <Row>
        <CabinTable />
      </Row>
    </>
  );
}

export default Cabins;
