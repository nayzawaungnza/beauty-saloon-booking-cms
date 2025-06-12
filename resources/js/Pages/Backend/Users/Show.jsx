import React from "react";
import { Link, usePage } from "@inertiajs/react"; // Show.jsx
import { Col, Row, Card, CardBody, Badge, Container, Button } from "reactstrap"; // Show.jsx
import Breadcrumbs from "@/Components/Common/Breadcrumb"; // Show.jsx
import { ToastContainer } from "react-toastify"; // Show.jsx
import "react-toastify/dist/ReactToastify.css"; // Show.jsx

const Show = ({ user }) => { // user prop already contains roles as an array of names from UserController // Show.jsx
  document.title = "User Details | Admin Dashboard"; // Show.jsx

  const isSuperAdmin = user.roles && user.roles.includes('Super Admin'); // Show.jsx

  const getRoleBadgeColor = (role) => { // Show.jsx
    switch (role) { // Show.jsx
      case 'Super Admin': // Show.jsx
        return 'bg-danger'; // Show.jsx
      case 'Admin': // Show.jsx
        return 'bg-warning'; // Show.jsx
      case 'User': // Show.jsx
        return 'bg-primary'; // Show.jsx
      default: // Show.jsx
        return 'bg-secondary'; // Show.jsx
    }
  };

  const getStatusColor = (isActive) => { // Show.jsx
    return isActive ? 'bg-success' : 'bg-danger'; // Show.jsx
  };

  return (
    <React.Fragment>
      <div className="page-content"> 
        <Container fluid> 
          <Breadcrumbs // Show.jsx
            title="Users" // Show.jsx
            breadcrumbItems="User Details"/> 

          <Row> 
            <Col lg={4}> 
              {/* Profile Card */}
              <Card className="shadow-sm"> 
                <CardBody className="text-center"> 
                  <div className="mb-4"> 
                    <div className="avatar-xl mx-auto mb-3"> 
                      <img // Show.jsx
                        src={user.default_image || '/src/assets/images/users/avatar.png'} // Show.jsx
                        alt={user.name} // Show.jsx
                        className="rounded-circle img-thumbnail" // Show.jsx
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }} // Show.jsx
                        onError={(e) => { // Show.jsx
                          e.target.src = '/src/assets/images/users/avatar.png'; // Show.jsx
                        }}
                      />
                    </div>
                    <h5 className="mb-1">{user.name}</h5> 
                    <p className="text-muted mb-2">{user.email}</p> 
                    
                    <Badge // Show.jsx
                      className={`${getStatusColor(user.is_active)} font-size-12 px-3 py-2`} // Show.jsx
                      pill // Show.jsx
                    >
                      <i className={`bx ${user.is_active ? 'bx-check-circle' : 'bx-x-circle'} me-1`}></i> 
                      {user.is_active ? "Active" : "Inactive"} 
                    </Badge>
                  </div>
                  {/* ... Quick Stats ... */}
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
                    {user.roles && user.roles.length > 0 ? ( // Show.jsx
                      user.roles.map((role, index) => ( // Show.jsx
                        <Badge // Show.jsx
                          key={index} // Show.jsx
                          className={`${getRoleBadgeColor(role)} font-size-12 px-3 py-2`} // Show.jsx
                          pill // Show.jsx
                        >
                          <i className="bx bx-shield me-1"></i> 
                          {role} 
                        </Badge>
                      )) // Show.jsx
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
                        href={isSuperAdmin ? "#" : `/admin/users/${user.id}/edit`} // Show.jsx
                        className={`btn btn-primary btn-sm me-2 ${isSuperAdmin ? 'disabled' : ''}`} // Show.jsx
                        aria-disabled={isSuperAdmin} // Show.jsx
                        onClick={(e) => isSuperAdmin && e.preventDefault()} // Prevent navigation for disabled link
                      >
                        <i className="bx bx-edit me-1"></i> 
                        Edit User
                      </Link>
                      <Link // Show.jsx
                        href="/admin/users" // Show.jsx
                        className="btn btn-outline-secondary btn-sm" // Show.jsx
                      >
                        <i className="bx bx-arrow-back me-1"></i> 
                        Back to List
                      </Link>
                    </div>
                  </div>
                  {/* ... User details display ... */}
                </CardBody>
              </Card>

              {/* Account Status Card - No direct actions here, just display */}
              {/* ... */}

              {/* Additional Actions Card */}
              <Card className="shadow-sm"> 
                <CardBody> 
                  <h6 className="card-title mb-3"> 
                    <i className="bx bx-cog me-2 text-primary"></i> 
                    Quick Actions
                  </h6>
                  
                  <div className="d-flex flex-wrap gap-2"> 
                    <Button // Show.jsx
                      color="primary" // Show.jsx
                      size="sm" // Show.jsx
                      outline // Show.jsx
                      onClick={() => window.location.href = `mailto:${user.email}`} // Show.jsx
                      // No Super Admin check needed for sending an email
                    >
                      <i className="bx bx-envelope me-1"></i> 
                      Send Email
                    </Button>
                    
                    {user.mobile && ( // Show.jsx
                      <Button // Show.jsx
                        color="success" // Show.jsx
                        size="sm" // Show.jsx
                        outline // Show.jsx
                        onClick={() => window.location.href = `tel:${user.mobile}`} // Show.jsx
                        // No Super Admin check needed for calling
                      >
                        <i className="bx bx-phone me-1"></i> 
                        Call User
                      </Button>
                    )}
                    
                    <Button // Show.jsx
                      color={user.is_active ? "warning" : "success"} // Show.jsx
                      size="sm" // Show.jsx
                      outline // Show.jsx
                      disabled={isSuperAdmin} // Disable if Super Admin // Show.jsx
                      // onClick would ideally trigger the changeStatus action.
                      // Since this is the Show page, these buttons might be for display or trigger modals/API calls.
                      // For now, just disabling.
                    >
                      <i className={`bx ${user.is_active ? 'bx-pause' : 'bx-play'} me-1`}></i> 
                      {user.is_active ? 'Deactivate' : 'Activate'} 
                    </Button>
                    
                    <Button // Show.jsx
                      color={user.is_blocked ? "success" : "danger"} // Show.jsx
                      size="sm" // Show.jsx
                      outline // Show.jsx
                      disabled={isSuperAdmin} // Disable if Super Admin // Show.jsx
                      // onClick would ideally trigger a block/unblock action.
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
      <ToastContainer // Show.jsx
        position="top-right" // Show.jsx
        autoClose={5000} // Show.jsx
        hideProgressBar={false} // Show.jsx
        newestOnTop={false} // Show.jsx
        closeOnClick // Show.jsx
        rtl={false} // Show.jsx
        pauseOnFocusLoss // Show.jsx
        draggable // Show.jsx
        pauseOnHover // Show.jsx
      />
    </React.Fragment>
  );
};

export default Show; // Show.jsx