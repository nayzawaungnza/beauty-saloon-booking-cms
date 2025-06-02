import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Col, Row, Card, CardBody, Badge, Container, Button } from "reactstrap";
import Breadcrumbs from "@/Components/Common/Breadcrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Show = ({ user }) => {
  document.title = "User Details | Admin Dashboard";

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-danger';
      case 'Admin':
        return 'bg-warning';
      case 'User':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-success' : 'bg-danger';
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs 
            title="Users" 
            breadcrumbItems="User Details"/>

          <Row>
            <Col lg={4}>
              {/* Profile Card */}
              <Card className="shadow-sm">
                <CardBody className="text-center">
                  <div className="mb-4">
                    <div className="avatar-xl mx-auto mb-3">
                      <img
                        src={user.default_image || '/src/assets/images/users/avatar.png'}
                        alt={user.name}
                        className="rounded-circle img-thumbnail"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/src/assets/images/users/avatar.png';
                        }}
                      />
                    </div>
                    <h5 className="mb-1">{user.name}</h5>
                    <p className="text-muted mb-2">{user.email}</p>
                    
                    {/* Status Badge */}
                    <Badge 
                      className={`${getStatusColor(user.is_active)} font-size-12 px-3 py-2`}
                      pill
                    >
                      <i className={`bx ${user.is_active ? 'bx-check-circle' : 'bx-x-circle'} me-1`}></i>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Quick Stats */}
                  <Row className="text-center">
                    <Col xs={4}>
                      <div className="p-2">
                        <h5 className="mb-1">#{user.id}</h5>
                        <p className="text-muted mb-0 font-size-11">User ID</p>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-2">
                        <h5 className="mb-1">
                          <i className={`bx ${user.is_blocked ? 'bx-block text-danger' : 'bx-check-shield text-success'}`}></i>
                        </h5>
                        <p className="text-muted mb-0 font-size-11">
                          {user.is_blocked ? 'Blocked' : 'Allowed'}
                        </p>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className="p-2">
                        <h5 className="mb-1">
                          <i className={`bx ${user.is_subscribed ? 'bx-bell text-primary' : 'bx-bell-off text-muted'}`}></i>
                        </h5>
                        <p className="text-muted mb-0 font-size-11">
                          {user.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Roles Card */}
              <Card className="shadow-sm">
                <CardBody>
                  <h6 className="card-title mb-3">
                    <i className="bx bx-user-check me-2 text-primary"></i>
                    User Roles
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                  

                    {user.roles && user.roles.length > 0 ? (
                      user.roles.map((role, index) => (
                        <Badge 
                          key={index}
                          className={`${getRoleBadgeColor(role)} font-size-12 px-3 py-2`}
                          pill
                        >
                          <i className="bx bx-shield me-1"></i>
                          {role}
                        </Badge>
                      ))
                    ) : (
                      <Badge className="bg-light text-dark font-size-12 px-3 py-2" pill>
                        <i className="bx bx-user me-1"></i>
                        No roles assigned
                      </Badge>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={8}>
              {/* User Information Card */}
              <Card className="shadow-sm">
                <CardBody>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="card-title mb-0">
                      <i className="bx bx-user-detail me-2 text-primary"></i>
                      User Information
                    </h5>
                    <div>
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="btn btn-primary btn-sm me-2"
                      >
                        <i className="bx bx-edit me-1"></i>
                        Edit User
                      </Link>
                      <Link
                        href="/admin/users"
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <i className="bx bx-arrow-back me-1"></i>
                        Back to List
                      </Link>
                    </div>
                  </div>

                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <label className="form-label text-muted font-size-12 text-uppercase">Full Name</label>
                        <div className="d-flex align-items-center">
                          <i className="bx bx-user me-2 text-primary"></i>
                          <h6 className="mb-0">{user.name}</h6>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <label className="form-label text-muted font-size-12 text-uppercase">Email Address</label>
                        <div className="d-flex align-items-center">
                          <i className="bx bx-envelope me-2 text-primary"></i>
                          <h6 className="mb-0">{user.email}</h6>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <label className="form-label text-muted font-size-12 text-uppercase">Mobile Number</label>
                        <div className="d-flex align-items-center">
                          <i className="bx bx-phone me-2 text-primary"></i>
                          <h6 className="mb-0">{user.mobile || 'Not provided'}</h6>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <label className="form-label text-muted font-size-12 text-uppercase">User ID</label>
                        <div className="d-flex align-items-center">
                          <i className="bx bx-hash me-2 text-primary"></i>
                          <h6 className="mb-0">{user.id}</h6>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Account Status Card */}
              <Card className="shadow-sm">
                <CardBody>
                  <h6 className="card-title mb-3">
                    <i className="bx bx-cog me-2 text-primary"></i>
                    Account Settings
                  </h6>
                  
                  <Row>
                    <Col md={4}>
                      <div className="border rounded p-3 text-center mb-3 mb-md-0">
                        <div className={`avatar-sm mx-auto mb-2 ${user.is_active ? 'bg-success-subtle' : 'bg-danger-subtle'} rounded-circle d-flex align-items-center justify-content-center`}>
                          <i className={`bx ${user.is_active ? 'bx-check-circle text-success' : 'bx-x-circle text-danger'} font-size-16`}></i>
                        </div>
                        <h6 className="mb-1">Account Status</h6>
                        <p className={`mb-0 font-size-13 ${user.is_active ? 'text-success' : 'text-danger'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 text-center mb-3 mb-md-0">
                        <div className={`avatar-sm mx-auto mb-2 ${user.is_blocked ? 'bg-danger-subtle' : 'bg-success-subtle'} rounded-circle d-flex align-items-center justify-content-center`}>
                          <i className={`bx ${user.is_blocked ? 'bx-block text-danger' : 'bx-check-shield text-success'} font-size-16`}></i>
                        </div>
                        <h6 className="mb-1">Access Status</h6>
                        <p className={`mb-0 font-size-13 ${user.is_blocked ? 'text-danger' : 'text-success'}`}>
                          {user.is_blocked ? 'Blocked' : 'Allowed'}
                        </p>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="border rounded p-3 text-center">
                        <div className={`avatar-sm mx-auto mb-2 ${user.is_subscribed ? 'bg-primary-subtle' : 'bg-light'} rounded-circle d-flex align-items-center justify-content-center`}>
                          <i className={`bx ${user.is_subscribed ? 'bx-bell text-primary' : 'bx-bell-off text-muted'} font-size-16`}></i>
                        </div>
                        <h6 className="mb-1">Notifications</h6>
                        <p className={`mb-0 font-size-13 ${user.is_subscribed ? 'text-primary' : 'text-muted'}`}>
                          {user.is_subscribed ? 'Subscribed' : 'Unsubscribed'}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Additional Actions Card */}
              <Card className="shadow-sm">
                <CardBody>
                  <h6 className="card-title mb-3">
                    <i className="bx bx-cog me-2 text-primary"></i>
                    Quick Actions
                  </h6>
                  
                  <div className="d-flex flex-wrap gap-2">
                    <Button 
                      color="primary" 
                      size="sm" 
                      outline
                      onClick={() => window.location.href = `mailto:${user.email}`}
                    >
                      <i className="bx bx-envelope me-1"></i>
                      Send Email
                    </Button>
                    
                    {user.mobile && (
                      <Button 
                        color="success" 
                        size="sm" 
                        outline
                        onClick={() => window.location.href = `tel:${user.mobile}`}
                      >
                        <i className="bx bx-phone me-1"></i>
                        Call User
                      </Button>
                    )}
                    
                    <Button 
                      color={user.is_active ? "warning" : "success"} 
                      size="sm" 
                      outline
                    >
                      <i className={`bx ${user.is_active ? 'bx-pause' : 'bx-play'} me-1`}></i>
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button 
                      color={user.is_blocked ? "success" : "danger"} 
                      size="sm" 
                      outline
                    >
                      <i className={`bx ${user.is_blocked ? 'bx-check-shield' : 'bx-block'} me-1`}></i>
                      {user.is_blocked ? 'Unblock' : 'Block'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
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

export default Show;