import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";

const StyledHeader = styled.header`
    background-color: var(--surface-1);
    padding:1.2rem 4.8rem ;
    border-bottom: 1px solid var(--border-1);
    display: flex;
    gap: 2.4rem;
    align-items: center;
    justify-content: flex-end;
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 50;
`;


function Header() {
    return (
        <StyledHeader>
            <UserAvatar />
            <HeaderMenu />
        </StyledHeader>
    )
}

export default Header;

//cause we havin bugs!!!
