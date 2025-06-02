import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown components (you'll need to convert these too)
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";

// Import images - place these in public/images/
import megamenuImg from "@/assets/images/megamenu-img.png";
import github from "@/assets/images/brands/github.png";
import bitbucket from "@/assets/images/brands/bitbucket.png";
import dribbble from "@/assets/images/brands/dribbble.png";
import dropbox from "@/assets/images/brands/dropbox.png";
import mail_chimp from "@/assets/images/brands/mail_chimp.png";
import slack from "@/assets/images/brands/slack.png";
import logo from "@/assets/images/logo.svg";
import logoLightSvg from "@/assets/images/logo-light.svg";

const Header = ({ 
  toggleMenuCallback, 
  layoutSettings, 
  showRightSidebarAction,
  changeLayoutMode,
  changeSidebarTheme,
  changeTopbarTheme,
  changeLayoutWidth 
}) => {
  const [search, setSearch] = useState(false);
  const [megaMenu, setMegaMenu] = useState(false);
  const [socialDrp, setSocialDrp] = useState(false);
  const { props } = usePage();

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link href="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logo || "/placeholder.svg"} alt="" height="22" />
                </span>
              </Link>

              <Link href="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logoLightSvg || "/placeholder.svg"} alt="" height="22" />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>

            <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <span className="bx bx-search-alt" />
              </div>
            </form>

            <Dropdown
              className="dropdown-mega d-none d-lg-block ms-2"
              isOpen={megaMenu}
              toggle={() => {
                setMegaMenu(!megaMenu);
              }}
            >
              <DropdownToggle className="btn header-item" caret tag="button">
                Mega Menu <i className="mdi mdi-chevron-down" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-megamenu">
                <Row>
                  <Col sm={8}>
                    <Row>
                      <Col md={4}>
                        <h5 className="font-size-14 mt-0">UI Components</h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link href="#">Lightbox</Link>
                          </li>
                          <li>
                            <Link href="#">Range Slider</Link>
                          </li>
                          <li>
                            <Link href="#">Sweet Alert</Link>
                          </li>
                          <li>
                            <Link href="#">Rating</Link>
                          </li>
                          <li>
                            <Link href="#">Forms</Link>
                          </li>
                          <li>
                            <Link href="#">Tables</Link>
                          </li>
                          <li>
                            <Link href="#">Charts</Link>
                          </li>
                        </ul>
                      </Col>
                      {/* Add more columns as needed */}
                    </Row>
                  </Col>
                  <Col sm={4}>
                    <Row>
                      <Col sm={6}>
                        <h5 className="font-size-14 mt-0">UI Components</h5>
                        <ul className="list-unstyled megamenu-list">
                          <li>
                            <Link href="#">Lightbox</Link>
                          </li>
                          <li>
                            <Link href="#">Range Slider</Link>
                          </li>
                        </ul>
                      </Col>
                      <Col sm={5}>
                        <div>
                          <img
                            src={megamenuImg || "/placeholder.svg"}
                            alt=""
                            className="img-fluid mx-auto d-block"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="d-flex">
            <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setSearch(!search);
                }}
                type="button"
                className="btn header-item noti-icon"
                id="page-header-search-dropdown"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-primary" type="submit">
                          <i className="mdi mdi-magnify" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <LanguageDropdown />

            <Dropdown
              className="d-none d-lg-inline-block ms-1"
              isOpen={socialDrp}
              toggle={() => {
                setSocialDrp(!socialDrp);
              }}
            >
              <DropdownToggle className="btn header-item noti-icon" tag="button">
                <i className="bx bx-customize" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg dropdown-menu-end">
                <div className="px-lg-2">
                  <Row className="no-gutters">
                    <Col>
                      <Link className="dropdown-icon-item" href="#">
                        <img src={github || "/placeholder.svg"} alt="Github" />
                        <span>GitHub</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" href="#">
                        <img src={bitbucket || "/placeholder.svg"} alt="bitbucket" />
                        <span>Bitbucket</span>
                      </Link>
                    </Col>
                    <Col>
                      <Link className="dropdown-icon-item" href="#">
                        <img src={dribbble || "/placeholder.svg"} alt="dribbble" />
                        <span>Dribbble</span>
                      </Link>
                    </Col>
                  </Row>
                  {/* Add more rows as needed */}
                </div>
              </DropdownMenu>
            </Dropdown>

            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>

            <NotificationDropdown />
            <ProfileMenu />

            <div
              onClick={() => {
                showRightSidebarAction(!layoutSettings.showRightSidebar);
              }}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle"
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default Header;