import styled from "styled-components";
import { useDarkMode } from "../context/useDarkMode";

const StyledLogo = styled.div`
  text-align: center;
  display: grid;
  gap: 0.8rem;
  justify-items: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
  object-fit: contain;
`;

const HotelName = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-700);
  letter-spacing: -0.2px;
`;

function Logo({ hotelName = "", hotelLogoUrl = "" }) {

  const { isDarkMode } = useDarkMode();
  const bundledSrc = isDarkMode ? "/logo-dark.png" : "/logo-light.png";
  const src = hotelLogoUrl || bundledSrc;

  return (
    <StyledLogo>
      <Img src={src} alt={hotelName ? `${hotelName} logo` : "Logo"} />
      {hotelName && <HotelName>{hotelName}</HotelName>}
    </StyledLogo>
  );
}

export default Logo;
