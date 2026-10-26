import styled from "styled-components";

import Heading from "../ui/Heading";
import Row from "../ui/Row";
import GuestTable from "../features/guests/GuestTable";
import GuestTableOperations from "../features/guests/GuestTableOperations";
import AddGuest from "../features/guests/AddGuest";

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

function Guests() {
  return (
    <>
      <Row type="horizontal" className="page-titlebar">
        <Heading as="h1">
          All <span className="accent-text">guests</span>
        </Heading>
        <Actions>
          <GuestTableOperations />
          <AddGuest />
        </Actions>
      </Row>

      <GuestTable />
    </>
  );
}

export default Guests;
