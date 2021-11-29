import { Form } from "react-bootstrap";
import styled from "styled-components";
import color from "../styles/color";

const StyledForm = styled(Form)`
  background-color: ${color.TEAL};
  margin-top: 10px;
  font-weight: 600;
  border-radius: 4px;
`;

export default StyledForm;
