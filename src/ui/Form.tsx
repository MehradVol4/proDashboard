import styled, { css } from "styled-components";

const Form = styled.form`
  ${(props) =>
    props.type === "regular" &&
    css`
      width: min(92rem, 100%);
      margin: 0 auto;
      padding: 2.4rem 3.2rem;

      /* Box */
      background-color: var(--surface-1);
      border: 1px solid var(--border-1);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
      backdrop-filter: blur(10px);
    `}

  ${(props) =>
    props.type === "modal" &&
    css`
      width: 80rem;
    `}
    
  overflow: hidden;
  font-size: 1.4rem;
`;

Form.defaultProps = {
  type:'regular',
}



export default Form;
