import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "@inertiajs/react";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

// Import images
import avatar3 from "@/assets/images/users/avatar-3.jpg";
import avatar4 from "@/assets/images/users/avatar-4.jpg";

// i18n
import { useTranslation } from "react-i18next";

const NotificationDropdown = () => {
  const [menu, setMenu] = useState(false);
  const { t } = useTranslation();

  return (
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
        <span className="badge bg-danger rounded-pill">3</span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">{t("Notifications")}</h6>
            </Col>
            <div className="col-auto">
              <Link href="#" className="small">
                View All
              </Link>
            </div>
          </Row>
        </div>

        <SimpleBar style={{ height: "230px" }}>
          <Link href="#" className="text-reset notification-item">
            <div className="d-flex">
              <div className="avatar-xs me-3">
                <span className="avatar-title bg-primary rounded-circle font-size-16">
                  <i className="bx bx-cart" />
                </span>
              </div>
              <div className="flex-grow-1">
                <h6 className="mt-0 mb-1">
                  {t("Your order is placed")}
                </h6>
                <div className="font-size-12 text-muted">
                  <p className="mb-1">
                    {t("If several languages coalesce the grammar")}
                  </p>
                  <p className="mb-0">
                    <i className="mdi mdi-clock-outline" />{" "}
                    {t("3 min ago")}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="#" className="text-reset notification-item">
            <div className="d-flex">
              <img
                src={avatar3}
                className="me-3 rounded-circle avatar-xs"
                alt="user-pic"
              />
              <div className="flex-grow-1">
                <h6 className="mt-0 mb-1">James Lemire</h6>
                <div className="font-size-12 text-muted">
                  <p className="mb-1">
                    {t("It will seem like simplified English") + "."}
                  </p>
                  <p className="mb-0">
                    <i className="mdi mdi-clock-outline" />
                    {t("1 hours ago")}
                  </p>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="#" className="text-reset notification-item">
            <div className="d-flex">
              <div className="avatar-xs me-3">
                <span className="avatar-title bg-success rounded-circle font-size-16">
                  <i className="bx bx-badge-check" />
                </span>
              </div>
              <div className="flex-grow-1">
                <h6 className="mt-0 mb-1">
                  {t("Your item is shipped")}
                </h6>
                <div className="font-size-12 text-muted">
                  <p className="mb-1">
                    {t("If several languages coalesce the grammar")}
                  </p>
                  <p className="mb-0">
                    <i className="mdi mdi-clock-outline" />{" "}
                    {t("3 min ago")}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="#" className="text-reset notification-item">
            <div className="d-flex">
              <img
                src={avatar4}
                className="me-3 rounded-circle avatar-xs"
                alt="user-pic"
              />
              <div className="flex-grow-1">
                <h6 className="mt-0 mb-1">Salena Layfield</h6>
                <div className="font-size-12 text-muted">
                  <p className="mb-1">
                    {t(
                      "As a skeptical Cambridge friend of mine occidental"
                    ) + "."}
                  </p>
                  <p className="mb-0">
                    <i className="mdi mdi-clock-outline" />
                    {t("1 hours ago")}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </SimpleBar>
        
        <div className="p-2 border-top d-grid">
          <Link
            className="btn btn-sm btn-link font-size-14 btn-block text-center"
            href="#"
          >
            <i className="mdi mdi-arrow-right-circle me-1"></i>
            {t("View all")}
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default NotificationDropdown;