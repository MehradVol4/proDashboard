import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  font-size: 1.4rem;
  padding: 0.8rem 3.6rem;
  border: 1px solid var(--border-1);
  border-radius: var(--border-radius-sm);
  background-color: var(--surface-1);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
  width: 26rem;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
`;

const SearchIcon = styled(HiMagnifyingGlass)`
  position: absolute;
  left: 1rem;
  width: 1.8rem;
  height: 1.8rem;
  color: var(--color-grey-400);
  pointer-events: none;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.8rem;
  background: none;
  border: none;
  padding: 0.2rem;
  display: flex;
  cursor: pointer;

  & svg {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--color-grey-500);
  }
`;

const DEBOUNCE_MS = 350;

function SearchInput({ paramName = "search", placeholder = "Search..." }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeValue = searchParams.get(paramName) ?? "";
  const [value, setValue] = useState(activeValue);

  // Typing shouldn't fire a query per keystroke, and it shouldn't leave the
  // reader on page 4 of the previous result set either.
  useEffect(() => {
    if (value === activeValue) return;

    const timer = setTimeout(() => {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(paramName, value);
        else next.delete(paramName);
        next.delete("page");
        return next;
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, activeValue, paramName, setSearchParams]);

  return (
    <Wrapper>
      <SearchIcon />
      <StyledInput
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
      {value && (
        <ClearButton
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
        >
          <HiXMark />
        </ClearButton>
      )}
    </Wrapper>
  );
}

export default SearchInput;
