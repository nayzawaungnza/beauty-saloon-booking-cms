import React from "react";
import { Link } from "@inertiajs/react";
import SidebarContent from "./SidebarContent";

// Import images - you'll need to place these in public/images/
import logo from "@/assets/images/logo.svg";
import logoLightPng from "@/assets/images/logo-light.png";
import logoLightSvg from "@/assets/images/logo-light.svg";
import logoDark from "@/assets/images/logo-dark.png";

const Sidebar = ({ type, theme, isMobile, layoutSettings }) => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link href="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logo || "/placeholder.svg"} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoDark || "/placeholder.svg"} alt="" height="17" />
            </span>
          </Link>

          <Link href="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoLightSvg || "/placeholder.svg"} alt="" height="22" />
            </span>
            <span className="logo-lg">
              <img src={logoLightPng || "/placeholder.svg"} alt="" height="19" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          <SidebarContent type={type} />
        </div>

        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;