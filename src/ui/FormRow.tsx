import styled from "styled-components";


const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span.attrs({ "data-formrow-error": true })`
  font-size: 1.4rem;
  color: var(--color-red-700);
  grid-column: 2;
`;

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 20rem 1fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--border-1);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    align-items: start;

    & [data-formrow-error] {
      grid-column: 1;
    }
  }
`;





function FormRow({ label, error, children }) {

    return (
        <StyledFormRow>
            {label && <Label htmlFor={children.props.id}>{label}</Label>}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    )
}

export default FormRow
