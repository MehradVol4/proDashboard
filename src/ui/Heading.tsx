import styled, { css } from "styled-components";

const Heading = styled.h1`
    ${props => props.as === "h1" &&
        css`  
    font-size: clamp(2.6rem, 2.2rem + 1vw, 3.2rem);
    font-weight : 650;
    letter-spacing: -0.02em;`
    } 
    ${props => props.as === "h2" &&
        css`  
    font-size: clamp(1.8rem, 1.6rem + 0.4vw, 2.2rem);
    font-weight : 650;
    letter-spacing: -0.01em;`
    } 
    ${props => props.as === "h3" &&
        css`  
    font-size: 1.8rem;
    font-weight : 600;`
    } 
    line-height:1.4;

    ${props => props.as === "h4" &&
        css`  
    font-size:2.4rem;
    font-weight : 650;
    text-align: center;
    `
    } 
    line-height:1.4;
` ;

export default Heading;
