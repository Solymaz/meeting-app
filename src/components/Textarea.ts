import styled, { css } from "styled-components";
import colors from "../styles/color";

type TProps = {
  isInvalid?: boolean;
};
const StyledTextarea = styled.textarea<TProps>`
  width: 100%;
  border-radius: 4px;
  padding: 10px;
  border-color: lightgray;
  ${({ isInvalid }) =>
    isInvalid &&
    css`
      border-color: ${colors.RED};
    `}
`;

export default StyledTextarea;
