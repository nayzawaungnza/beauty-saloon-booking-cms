import React, {useEffect} from "react";
import { Link, Head, useForm, usePage } from "@inertiajs/react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";

// import images
import profile from "@/assets/images/profile-img.png";
import logo from "@/assets/images/logo.svg";
import lightlogo from "@/assets/images/logo-light.svg";

const Login = () => {
  const { flash } = usePage().props;
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "superadmin@admin.com",
    password: "Password123!",
    remember: false,
  });

  useEffect(() => {
    // Clear flash messages after 5 seconds
    if (flash.success || flash.error) {
      const timer = setTimeout(() => {
        flash.success = null;
        flash.error = null;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.login'), {
      
      onError: (errors) => {
        console.error('Login errors:', errors);
      },
      onFinish: () => reset('password'),
      preserveScroll: true
    });
  };

  return (
    <React.Fragment>
      <Head title="Admin Log in" />
      <div className="home-btn d-none d-sm-block">
        <Link href="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
            {/* Success Message from Registration */}
              {flash.success && (
                <Alert color="success" className="mt-3">
                  {flash.success}
                </Alert>
              )}

              {/* Error Messages */}
              {flash.error && (
                <Alert color="danger" className="mt-3">
                  {flash.error}
                </Alert>
              )}

              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to continue to Skote.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="auth-logo">
                    <Link href="/" className="auth-logo-light">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={lightlogo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                    <Link href="/" className="auth-logo-dark">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form className="form-horizontal" onSubmit={submit}>
                      {/* {errors.email && <Alert color="danger">{errors.email}</Alert>}
                      {errors.password && <Alert color="danger">{errors.password}</Alert>} */}

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={(e) => setData('email', e.target.value)}
                          value={data.email}
                          invalid={errors.email ? true : false}
                        />
                        {errors.email && (
                          <FormFeedback type="invalid">
                            {errors.email}
                          </FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          autoComplete="off"
                          value={data.password}
                          type="password"
                          placeholder="Enter Password"
                          onChange={(e) => setData('password', e.target.value)}
                          invalid={errors.password ? true : false}
                        />
                        {errors.password && (
                          <FormFeedback type="invalid">
                            {errors.password}
                          </FormFeedback>
                        )}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                          checked={data.remember}
                          onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          disabled={processing}
                        >
                          {processing ? 'Logging in...' : 'Log In'}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <Link
                              href="#"
                              className="social-list-item bg-primary text-white border-primary"
                            >
                              <i className="mdi mdi-facebook" />
                            </Link>
                          </li>
                          <li className="list-inline-item">
                            <Link
                              href="#"
                              className="social-list-item bg-danger text-white border-danger"
                            >
                              <i className="mdi mdi-google" />
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 text-center">
                        <Link href="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Forgot your password?
                        </Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Don&#39;t have an account ?{" "}
                  <Link href="/admin/register" className="fw-medium text-primary">
                    Signup now
                  </Link>
                </p>
                <p>
                  © {new Date().getFullYear()} Skote. Crafted with{" "}
                  <i className="mdi mdi-heart text-danger" /> by Themesbrand
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Login;