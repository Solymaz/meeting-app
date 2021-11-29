import React, { useCallback, useContext, useEffect } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { AuthContext } from "../contexts/authContext";
import TLoginData from "../types/login";

YupPassword(Yup); // extend Yup

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string().required("Password is required").password(),
});

export default function Login() {
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TLoginData>(formOptions);

  const { login, loginErrorMsg, loginLoading, showWelcome, setLoginErrorMsg } =
    useContext(AuthContext);

  const memoizedHandleSubmit = useCallback(
    handleSubmit((data) => login(data)),
    []
  );

  // clear login error message on field change
  useEffect(() => {
    const subscription = watch(() => {
      setLoginErrorMsg(undefined);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Row className="d-flex justify-content-center">
      <Col md="4">
        <Form onSubmit={memoizedHandleSubmit}>
          <h1>Login</h1>
          {showWelcome && (
            <Alert variant="success">Welcome, now you can login 😊</Alert>
          )}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              isInvalid={!!errors.email?.message}
              /* eslint-disable react/jsx-props-no-spreading */
              {...register("email")}
            />
            <Form.Control.Feedback type="invalid" role="alert">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              isInvalid={!!errors.password?.message}
              {...register("password")}
            />
            <Form.Control.Feedback type="invalid" role="alert">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="primary"
            disabled={loginLoading}
            size="lg"
            type="submit"
            className="mb-3 w-100"
          >
            {!loginLoading ? "Login" : "Logging in..."}
          </Button>
          {loginErrorMsg && <Alert variant="danger">{loginErrorMsg}</Alert>}
          <Form.Group controlId="link">
            <strong>
              Not a member yet?{" "}
              <Link to="/registration" className="text-decoration-none">
                Create an account
              </Link>
            </strong>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
