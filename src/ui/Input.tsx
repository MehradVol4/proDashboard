import styled from "styled-components";


const Input = styled.input`
  border : 1px solid var(--border-1);
  background-color : var(--surface-1) ;
  border-radius : var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow : var(--shadow-sm) ;
  transition: box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;

`;

export default Input ;
