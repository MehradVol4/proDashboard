import styled from "styled-components";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
    props.type === "white"
      ? "var(--border-1)"
      : "var(--border-1)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--surface-1);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
`;


function Select({ options = [], value = undefined, onChange = undefined, children = null, ...props }) {
  // Omitting `value` entirely keeps the select uncontrolled, which is what
  // react-hook-form's `register` needs when its props are spread in.
  const valueProps = value === undefined ? {} : { value };

  return (
    <StyledSelect {...props} {...valueProps} onChange={onChange}>
      {children}
      {options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
    </StyledSelect>
  )
};

export default Select;
