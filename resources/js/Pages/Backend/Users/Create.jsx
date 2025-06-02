import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row, UncontrolledTooltip } from "reactstrap";
import Breadcrumbs from "@/Components/Common/Breadcrumb";
import "flatpickr/dist/themes/material_blue.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Create = ({ errors = {} }) => {
  document.title = "Create New User | Admin Panel";

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
    roles: ['User'], // Default role
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2048 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF)');
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
    // Reset the file input
    const fileInput = document.getElementById('profile-image-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle role selection with radio buttons
  const handleRoleChange = (role) => {
    setData('roles', [role]); // Set the selected role as a single-item array
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === "roles") {
        data[key].forEach((role, index) => {
          formData.append(`roles[${index}]`, role);
        });
      } else if (key === "profile_image" && data[key]) {
        formData.append(key, data[key]);
      } else if (key === "is_active" || key === "is_blocked" || key === "is_subscribed") {
        // Convert boolean to string representation that Laravel expects
        formData.append(key, data[key] ? '1' : '0');
      } else if (data[key] !== null && data[key] !== "" && key !== "profile_image") {
        formData.append(key, data[key]);
      }
    });

    post('/admin/users', {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        toast.success('User created successfully!');
      },
      onError: (errors) => {
        console.error('Create errors:', errors);
        if (errors.message) {
          toast.error(errors.message);
        } else {
          toast.error('Failed to create user. Please check the form for errors.');
        }
      },
    });
  };

  // Get the current selected role (first item in the array)
  const currentRole = data.roles && data.roles.length > 0 ? data.roles[0] : 'User';

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
                    <div className="mb-3">
                      <Label htmlFor="name-input">Full Name <span className="text-danger">*</span></Label>
                      <Input
                        id="name-input"
                        name="name"
                        type="text"
                        placeholder="Enter Full Name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        invalid={!!errors.name}
                      />
                      {errors.name && (
                        <FormFeedback type="invalid">{errors.name}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="email-input">Email <span className="text-danger">*</span></Label>
                      <Input
                        id="email-input"
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        invalid={!!errors.email}
                      />
                      {errors.email && (
                        <FormFeedback type="invalid">{errors.email}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="mobile-input">Mobile</Label>
                      <Input
                        id="mobile-input"
                        name="mobile"
                        type="text"
                        placeholder="Enter Mobile Number"
                        value={data.mobile}
                        onChange={(e) => setData('mobile', e.target.value)}
                        invalid={!!errors.mobile}
                      />
                      {errors.mobile && (
                        <FormFeedback type="invalid">{errors.mobile}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="password-input">Password <span className="text-danger">*</span></Label>
                      <Input
                        id="password-input"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        invalid={!!errors.password}
                      />
                      {errors.password && (
                        <FormFeedback type="invalid">{errors.password}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="password-confirm-input">Confirm Password <span className="text-danger">*</span></Label>
                      <Input
                        id="password-confirm-input"
                        name="password_confirmation"
                        type="password"
                        placeholder="Confirm Password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        invalid={!!errors.password_confirmation}
                      />
                      {errors.password_confirmation && (
                        <FormFeedback type="invalid">{errors.password_confirmation}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Profile Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label htmlFor="profile-image-input" className="mb-0" id="profileImageInput">
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip placement="right" target="profileImageInput" transition={{ timeout: 0 }}>
                              Select Image
                            </UncontrolledTooltip>
                            <input 
                              className="form-control d-none" 
                              id="profile-image-input" 
                              name="profile_image"
                              type="file" 
                              accept="image/png,image/gif,image/jpeg,image/jpg" 
                              onChange={handleImageChange} 
                            />
                          </div>
                          <div className="avatar-lg">
                            <div className="avatar-title bg-light rounded-circle position-relative">
                              <img 
                                src={selectedImage || '/assets/images/users/avatar.png'} 
                                id="profile-img" 
                                alt="Profile" 
                                className="avatar-md h-auto rounded-circle" 
                                onError={(e) => {
                                  e.target.src = '/assets/images/users/avatar.png';
                                }}
                              />
                              {selectedImage && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-xs position-absolute top-0 start-100 translate-middle rounded-circle"
                                  onClick={removeImage}
                                  style={{ zIndex: 1 }}
                                >
                                  <i className="bx bx-x"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {errors.profile_image && (
                          <FormFeedback type="invalid" className="d-block">{errors.profile_image}</FormFeedback>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Account Status</h5>
                    
                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_active"
                          checked={data.is_active}
                          onChange={(e) => setData('is_active', e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_active">Active</Label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_blocked"
                          checked={data.is_blocked}
                          onChange={(e) => setData('is_blocked', e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_blocked">Blocked</Label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_subscribed"
                          checked={data.is_subscribed}
                          onChange={(e) => setData('is_subscribed', e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_subscribed">Subscribed</Label>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">User Role <span className="text-danger">*</span></h5>
                    
                    {/* Radio buttons for role selection */}
                    <div className="mb-3">
                      <div className="form-check">
                        <Input
                          type="radio"
                          className="form-check-input"
                          id="super-admin-role"
                          name="role"
                          checked={currentRole === 'Super Admin'}
                          onChange={() => handleRoleChange('Super Admin')}
                        />
                        <Label className="form-check-label" htmlFor="super-admin-role">
                          Super Administrator
                        </Label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <Input
                          type="radio"
                          className="form-check-input"
                          id="admin-role"
                          name="role"
                          checked={currentRole === 'Admin'}
                          onChange={() => handleRoleChange('Admin')}
                        />
                        <Label className="form-check-label" htmlFor="admin-role">
                          Administrator
                        </Label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check">
                        <Input
                          type="radio"
                          className="form-check-input"
                          id="user-role"
                          name="role"
                          checked={currentRole === 'User'}
                          onChange={() => handleRoleChange('User')}
                        />
                        <Label className="form-check-label" htmlFor="user-role">
                          User
                        </Label>
                      </div>
                    </div>

                    {errors.roles && (
                      <div className="text-danger small">{errors.roles}</div>
                    )}
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href="/admin/users" className="btn btn-secondary me-2">
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : 'Create User'}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default Create;