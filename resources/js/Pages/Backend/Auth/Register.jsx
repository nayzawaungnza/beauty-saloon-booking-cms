import React from "react";
import { Link, Head, useForm } from "@inertiajs/react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";

// Import images
import profileImg from "@/assets/images/profile-img.png";
import logo from "@/assets/images/logo.svg";
import lightlogo from "@/assets/images/logo-light.svg";

const Register = () => {
  const { data, setData, post, errors, processing, reset } = useForm({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password_confirmation: '',
    
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
      post(route('admin.register'), {
      onSuccess:()=>{
        router.visit(route('admin.login'));
      },
      onError: (errors) => {
        console.error('Registration errors:', errors);
      },
      onFinish: () => reset('password'),
      preserveScroll: true
    });
    
    
  };

  return (
    <React.Fragment>
      <Head title="Register" />
      <div className="home-btn d-none d-sm-block">
        <Link href="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col className="col-7">
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Free Register</h5>
                        <p>Get your free Skote account now.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
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
                    <Form className="form-horizontal" onSubmit={handleSubmit}>
                      {errors.email && <Alert color="danger">{errors.email}</Alert>}
                      {errors.name && <Alert color="danger">{errors.name}</Alert>}
                      {errors.password && <Alert color="danger">{errors.password}</Alert>}
                      <div className="mb-3">
                        <Label className="form-label">Name</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter name"
                          type="text"
                          onChange={(e) => setData('name', e.target.value)}
                          value={data.name}
                          invalid={!!errors.name}
                        />
                        {errors.name && (
                          <FormFeedback type="invalid">{errors.name}</FormFeedback>
                        )}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          onChange={(e) => setData('email', e.target.value)}
                          value={data.email}
                          invalid={!!errors.email}
                        />
                        {errors.email && (
                          <FormFeedback type="invalid">{errors.email}</FormFeedback>
                        )}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Mobile</Label>
                        <Input
                          name="mobile"
                          className="form-control"
                          placeholder="Enter mobile"
                          type="text"
                          onChange={(e) => setData('mobile', e.target.value)}
                          value={data.mobile}
                          invalid={!!errors.mobile}
                        />  
                        {errors.mobile && (
                          <FormFeedback type="invalid">{errors.mobile}</FormFeedback>
                        )}
                      </div>


                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={(e) => setData('password', e.target.value)}
                          value={data.password}
                          invalid={!!errors.password}
                        />
                        {errors.password && (
                          <FormFeedback type="invalid">{errors.password}</FormFeedback>
                        )}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="password_confirmation"
                          type="password"
                          placeholder="Enter Confirm Password"
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          value={data.password_confirmation}
                          invalid={!!errors.password_confirmation}
                        />
                        {errors.password_confirmation && (
                          <FormFeedback type="invalid">
                            {errors.password_confirmation}
                          </FormFeedback>
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block"
                          type="submit"
                          disabled={processing}
                        >
                          {processing ? 'Registering...' : 'Register'}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="mb-0">
                          By registering you agree to the Skote{" "}
                          <Link href="#" className="text-primary">
                            Terms of Use
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="font-weight-medium text-primary">
                    Login
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

export default Register;