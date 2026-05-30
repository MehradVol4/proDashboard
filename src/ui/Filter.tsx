import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";

const StyledFilter = styled.div`
  border: 1px solid var(--border-1);
  background-color: var(--surface-1);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
  backdrop-filter: blur(10px);
`;

const FilterButton = styled.button`
  background-color: transparent;
  border: none;

  ${(props) =>
    props.active &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  padding: 0.44rem 0.8rem;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;


function Filter({ filterField, options }) {

  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options.at(0).value;

  function handleClick(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set(filterField, value);
      return next;
    });
  };

  return (
    <StyledFilter>

      {options.map((option) =>
        <FilterButton
          onClick={() => handleClick(option.value)}
          key={option.value}
          active={option.value === currentFilter}
          disabled={option.value === currentFilter}
        >
          {option.label}
        </FilterButton>
      )}

    </StyledFilter>
  );
};

export default Filter
