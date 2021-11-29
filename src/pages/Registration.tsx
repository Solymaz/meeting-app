/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import YupPassword from "yup-password";
import * as Yup from "yup";
import { AuthContext } from "../contexts/authContext";
import { registration } from "../services/auth";

YupPassword(Yup); // extend Yup

type TFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string().required("Password is required").password(),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
const formOptions = { resolver: yupResolver(validationSchema) };

export default function Registration() {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const history = useHistory();

  const { setShowWelcome } = useContext(AuthContext);

  type TRegistrationData = {
    name: string;
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TFormValues>(formOptions);

  const handleRegistration = async ({
    name,
    email,
    password,
  }: TRegistrationData) => {
    setLoading(true);
    setShowWelcome(false);
    const result = await registration(name, email, password);
    if (result.error) {
      setErrMsg(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setErrMsg("");
      setShowWelcome(true);
      history.push("/login");
    }
  };

  const memoizedHandleSubmit = useCallback(
    handleSubmit((data) => handleRegistration(data)),
    []
  );

  useEffect(() => {
    const subscription = watch(() => {
      setErrMsg("");
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Row className="d-flex justify-content-center">
      <Col md="4">
        <Form onSubmit={memoizedHandleSubmit}>
          <h1>Sign up</h1>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              isInvalid={!!errors.name?.message}
              {...register("name")}
            />{" "}
            <Form.Control.Feedback type="invalid" role="alert">
              {errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              isInvalid={!!errors.email?.message}
              {...register("email")}
            />{" "}
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
            {!errors.password && (
              <Form.Text className="text-muted">
                The password must be at least 8 characters in length and contain
                a mix of letters including uppercase, numbers, and special
                characters.
              </Form.Text>
            )}
            <Form.Control.Feedback type="invalid" role="alert">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repeat Password"
              isInvalid={!!errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Form.Control.Feedback type="invalid" role="alert">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="mb-3 w-100"
            disabled={loading}
          >
            {!loading ? "Register" : "Registering ..."}
          </Button>
          {errMsg.length > 0 && <Alert variant="danger">{errMsg}</Alert>}
          <Form.Group controlId="link">
            <strong>
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Login
              </Link>
            </strong>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
