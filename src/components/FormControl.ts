import { Form } from "react-bootstrap";
import styled from "styled-components";
import colors from "../styles/color";

const StyledFormControl = styled(Form.Control)`
  width: 100%;
  border-radius: 5px;
  border: solid 1px lightgray;
  padding: 5px;
  margin-bottom: 10px;
  color: ${colors.GRAY};
`;

export default StyledFormControl;
