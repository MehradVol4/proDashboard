import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background: linear-gradient(
      135deg,
      var(--color-brand-600) 0%,
      var(--color-brand-500) 100%
    );

    &:hover {
      background: linear-gradient(
        135deg,
        var(--color-brand-700) 0%,
        var(--color-brand-600) 100%
      );
    }

    &:active {
      transform: translateY(1px);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--surface-1);
    border: 1px solid var(--border-1);

    &:hover {
      background-color: var(--surface-2);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background 0.2s, transform 0.05s, box-shadow 0.2s, opacity 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:focus-visible {
    outline: 2px solid var(--color-brand-600);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }

  ${(props) => sizes[props.size ?? "medium"]}
  ${(props) => variations[props.variation ?? "primary"]}
`;

export default Button;
