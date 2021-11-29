import { Button } from "react-bootstrap";
import styled from "styled-components";
import color from "../styles/color";

const StyledButton = styled(Button)`
  color: white;
  font-weight: 500;
  background-color: ${color.LIGHT_TEAL};
  border: none;
  margin-bottom: 5px;
  &:hover {
    background-color: ${color.DARK_TEAL};
  }
`;
export default StyledButton;
