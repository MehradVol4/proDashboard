import styled from "styled-components";

const DashboardBox = styled.div`
  /* Box */
  background-color: var(--surface-1);
  border: 1px solid var(--border-1);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);

  padding: 3.2rem;

  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  backdrop-filter: blur(10px);
`;

export default DashboardBox;
