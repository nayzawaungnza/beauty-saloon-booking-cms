import React, { useState } from "react";
import { Link, useForm, usePage } from "@inertiajs/react"; // Import usePage
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row, UncontrolledTooltip } from "reactstrap";
import Breadcrumbs from "@/Components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create = () => { // Props will be accessed via usePage()
  document.title = "Create New User | Admin Panel";
  const { errors: pageErrors = {}, allRoles = [] } = usePage().props; // Get allRoles and errors from Inertia props

  const [selectedImage, setSelectedImage] = useState(null);
  const { data, setData, post, processing } = useForm({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password_confirmation: '',
    is_active: true,
    is_blocked: false,
    is_subscribed: false,
    profile_image: null,
    roles: allRoles.length > 0 ? [allRoles[0]] : ['User'], // Default to the first available role or 'User'
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF, WebP)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      setData('profile_image', file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setData('profile_image', null);
    const fileInput = document.getElementById('profile-image-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRoleChange = (role) => {
    setData('roles', [role]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if (key === "roles") {
        data[key].forEach((role, index) => { // Sends roles as roles[0]=RoleName
          formData.append(`roles[${index}]`, role);
        });
      } else if (key === "profile_image" && data[key]) {
        formData.append(key, data[key]);
      } else if (key === "is_active" || key === "is_blocked" || key === "is_subscribed") {
        formData.append(key, data[key] ? '1' : '0');
      } else if (data[key] !== null && data[key] !== "" && key !== "profile_image") {
        formData.append(key, data[key]);
      }
    });

    post('/admin/users', { // Using relative path, or route('admin.users.store') if Ziggy is configured
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        toast.success('User created successfully!');
        // Optional: Redirect or reset form if needed
      },
      onError: (errorsSubmit) => { // errorsSubmit contains validation errors
        console.error('Create errors:', errorsSubmit);
        if (errorsSubmit.message) {
          toast.error(errorsSubmit.message);
        } else if (Object.keys(errorsSubmit).length > 0) {
          toast.error('Failed to create user. Please check the form for errors.');
        }
      },
    });
  };

  const currentRole = data.roles && data.roles.length > 0 ? data.roles[0] : (allRoles.length > 0 ? allRoles[0] : '');

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Users" breadcrumbItem="Create User" />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    {/* Name Input */}
                    <div className="mb-3">
                      <Label htmlFor="name-input">Full Name <span className="text-danger">*</span></Label>
                      <Input id="name-input" name="name" type="text" placeholder="Enter Full Name"
                        value={data.name} onChange={(e) => setData('name', e.target.value)}
                        invalid={!!pageErrors.name} />
                      {pageErrors.name && <FormFeedback type="invalid">{pageErrors.name}</FormFeedback>}
                    </div>
                    {/* Email Input */}
                    <div className="mb-3">
                      <Label htmlFor="email-input">Email <span className="text-danger">*</span></Label>
                      <Input id="email-input" name="email" type="email" placeholder="Enter Email"
                        value={data.email} onChange={(e) => setData('email', e.target.value)}
                        invalid={!!pageErrors.email} />
                      {pageErrors.email && <FormFeedback type="invalid">{pageErrors.email}</FormFeedback>}
                    </div>
                    {/* Mobile Input */}
                    <div className="mb-3">
                      <Label htmlFor="mobile-input">Mobile</Label>
                      <Input id="mobile-input" name="mobile" type="text" placeholder="Enter Mobile Number"
                        value={data.mobile} onChange={(e) => setData('mobile', e.target.value)}
                        invalid={!!pageErrors.mobile} />
                      {pageErrors.mobile && <FormFeedback type="invalid">{pageErrors.mobile}</FormFeedback>}
                    </div>
                    {/* Password Input */}
                    <div className="mb-3">
                      <Label htmlFor="password-input">Password <span className="text-danger">*</span></Label>
                      <Input id="password-input" name="password" type="password" placeholder="Enter Password"
                        value={data.password} onChange={(e) => setData('password', e.target.value)}
                        invalid={!!pageErrors.password} />
                      {pageErrors.password && <FormFeedback type="invalid">{pageErrors.password}</FormFeedback>}
                    </div>
                    {/* Confirm Password Input */}
                    <div className="mb-3">
                      <Label htmlFor="password-confirm-input">Confirm Password <span className="text-danger">*</span></Label>
                      <Input id="password-confirm-input" name="password_confirmation" type="password" placeholder="Confirm Password"
                        value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)}
                        invalid={!!pageErrors.password_confirmation} />
                      {pageErrors.password_confirmation && <FormFeedback type="invalid">{pageErrors.password_confirmation}</FormFeedback>}
                    </div>
                    {/* Profile Image Input */}
                    <div className="mb-3">
                      <Label className="form-label">Profile Image</Label>
                      <div className="text-center">
                        {/* ... Image selection UI ... */}
                         <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label htmlFor="profile-image-input" className="mb-0" id="profileImageInput">
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip placement="right" target="profileImageInput" transition={{ timeout: 0 }}>Select Image</UncontrolledTooltip>
                            <input className="form-control d-none" id="profile-image-input" name="profile_image" type="file" accept="image/png,image/gif,image/jpeg,image/jpg,image/webp" onChange={handleImageChange} />
                          </div>
                          <div className="avatar-lg">
                            <div className="avatar-title bg-light rounded-circle position-relative">
                              <img src={selectedImage || '/src/assets/images/users/avatar.png'} id="profile-img" alt="Profile" className="avatar-md h-auto rounded-circle" onError={(e) => { e.target.src = '/src/assets/images/users/avatar.png'; }} />
                              {selectedImage && (<button type="button" className="btn btn-danger btn-xs position-absolute top-0 start-100 translate-middle rounded-circle" onClick={removeImage} style={{ zIndex: 1 }}><i className="bx bx-x"></i></button>)}
                            </div>
                          </div>
                        </div>
                        {pageErrors.profile_image && (<FormFeedback type="invalid" className="d-block">{pageErrors.profile_image}</FormFeedback>)}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                {/* Account Status Card */}
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Account Status</h5>
                    <div className="mb-3 form-check form-switch form-switch-md">
                      <Input type="checkbox" className="form-check-input" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                      <Label className="form-check-label" htmlFor="is_active">Active</Label>
                    </div>
                    <div className="mb-3 form-check form-switch form-switch-md">
                      <Input type="checkbox" className="form-check-input" id="is_blocked" checked={data.is_blocked} onChange={(e) => setData('is_blocked', e.target.checked)} />
                      <Label className="form-check-label" htmlFor="is_blocked">Blocked</Label>
                    </div>
                    <div className="mb-3 form-check form-switch form-switch-md">
                      <Input type="checkbox" className="form-check-input" id="is_subscribed" checked={data.is_subscribed} onChange={(e) => setData('is_subscribed', e.target.checked)} />
                      <Label className="form-check-label" htmlFor="is_subscribed">Subscribed</Label>
                    </div>
                  </CardBody>
                </Card>

                {/* User Role Card - DYNAMIC */}
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">User Role <span className="text-danger">*</span></h5>
                    {allRoles && allRoles.length > 0 ? (
                      allRoles.map((role) => (
                        <div className="mb-3 form-check" key={role}>
                          <Input
                            type="radio"
                            className="form-check-input"
                            id={`role-${role.toLowerCase().replace(/\s+/g, '-')}`}
                            name="role" // Ensure all radio buttons share the same name
                            checked={currentRole === role}
                            onChange={() => handleRoleChange(role)}
                            value={role}
                          />
                          <Label className="form-check-label" htmlFor={`role-${role.toLowerCase().replace(/\s+/g, '-')}`}>
                            {role}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p>No roles available. Please add roles in the system.</p>
                    )}
                    {pageErrors.roles && <div className="text-danger small mt-2">{pageErrors.roles}</div>}
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href="/admin/users" className="btn btn-secondary me-2">Cancel</Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (<><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Creating...</>) : 'Create User'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </React.Fragment>
  );
};

export default Create;