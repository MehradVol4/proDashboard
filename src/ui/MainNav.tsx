import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineCalendarDays, HiOutlineCog6Tooth, HiOutlineHome, HiOutlineHomeModern, HiOutlineUsers } from "react-icons/hi2";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    border-radius: var(--border-radius-sm);
    position: relative;
    transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
  }

  
  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--surface-2);
    transform: translateX(2px);
  }

  &.active:link::before,
  &.active:visited::before {
    content: "";
    position: absolute;
    left: 10px;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: linear-gradient(180deg, var(--color-brand-600), var(--color-brand-500));
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: color 0.15s ease;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;


function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/dashboard">
            <HiOutlineHome /><span>Home</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/bookings">
            <HiOutlineCalendarDays /><span>Bookings</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/cabins">
            <HiOutlineHomeModern /><span>Cabins</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/users">
            <HiOutlineUsers /><span>Users</span>
          </StyledNavLink>
        </li>
        <li>
          <StyledNavLink to="/settings">
            <HiOutlineCog6Tooth /><span>Settings</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  )
}

export default MainNav;
