import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
    background-color: var(--surface-1);
    padding: 3.2rem 2.4rem;
    border-right:1px solid var(--border-1) ;
    grid-row: 1 / -1 ;
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
    backdrop-filter: blur(10px);

    position: sticky;
    top: 0;
    height: 100vh;

    @media (max-width: 900px) {
      position: relative;
      height: auto;
      grid-row: auto;
      border-right: none;
      border-bottom: 1px solid var(--border-1);
      padding: 1.6rem var(--page-padding-x);
    }
`;



function Sidebar() {

    return (
        <StyledSidebar>
            <Logo />
            <MainNav />
        </StyledSidebar>
    )
}

export default Sidebar;
