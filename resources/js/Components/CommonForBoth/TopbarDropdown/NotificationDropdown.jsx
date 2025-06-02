import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

// Import images - place these in public/images/
import avatar3 from "@/assets/images/users/avatar-3.jpg";
import avatar4 from "@/assets/images/users/avatar-4.jpg";

const NotificationDropdown = () => {
  const [menu, setMenu] = useState(false);

  // Mock notifications data - in real app, this would come from props or API
  const notifications = [
    {
      id: 1,
      type: "order",
      title: "Your order is placed",
      message: "If several languages coalesce the grammar",
      time: "3 min ago",
      icon: "bx bx-cart",
      iconBg: "bg-primary",
    },
    {
      id: 2,
      type: "user",
      title: "James Lemire",
      message: "It will seem like simplified English.",
      time: "1 hours ago",
      avatar: avatar3,
    },
    {
      id: 3,
      type: "shipped",
      title: "Your item is shipped",
      message: "If several languages coalesce the grammar",
      time: "3 min ago",
      icon: "bx bx-badge-check",
      iconBg: "bg-success",
    },
    {
      id: 4,
      type: "user",
      title: "Salena Layfield",
      message: "As a skeptical Cambridge friend of mine occidental.",
      time: "1 hours ago",
      avatar: avatar4,
    },
  ];

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">{notifications.length}</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0">Notifications</h6>
              </Col>
              <div className="col-auto">
                <Link href="#" className="small">
                  View All
                </Link>
              </div>
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href="#"
                className="text-reset notification-item"
              >
                <div className="d-flex">
                  {notification.avatar ? (
                    <img
                      src={notification.avatar || "/placeholder.svg"}
                      className="me-3 rounded-circle avatar-xs"
                      alt="user-pic"
                    />
                  ) : (
                    <div className="avatar-xs me-3">
                      <span
                        className={`avatar-title ${notification.iconBg} rounded-circle font-size-16`}
                      >
                        <i className={notification.icon} />
                      </span>
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">{notification.title}</h6>
                    <div className="font-size-12 text-muted">
                      <p className="mb-1">{notification.message}</p>
                      <p className="mb-0">
                        <i className="mdi mdi-clock-outline" /> {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </SimpleBar>
          
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              href="#"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              View all
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;