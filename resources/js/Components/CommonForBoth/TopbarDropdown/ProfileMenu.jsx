import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, usePage, router } from "@inertiajs/react";

// Import user avatar - place this in public/images/
import user1 from "@/assets/images/users/avatar-1.jpg";

const ProfileMenu = () => {
  const [menu, setMenu] = useState(false);
  const [username, setUsername] = useState("Admin");
  const { props } = usePage();

  useEffect(() => {
    // Get user data from Inertia props
    if (props.auth?.user) {
      setUsername(props.auth.user.name || props.auth.user.email || "Admin");
    }
  }, [props.auth]);

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={props.auth?.user?.avatar || user1 || "/placeholder.svg"}
            alt="Header Avatar"
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="div">
            <Link href="/profile" className="dropdown-item">
              <i className="bx bx-user font-size-16 align-middle me-1" />
              Profile
            </Link>
          </DropdownItem>
          
          <DropdownItem tag="div">
            <Link href="/wallet" className="dropdown-item">
              <i className="bx bx-wallet font-size-16 align-middle me-1" />
              My Wallet
            </Link>
          </DropdownItem>
          
          <DropdownItem tag="div">
            <Link href="/settings" className="dropdown-item">
              <span className="badge bg-success float-end">11</span>
              <i className="bx bx-wrench font-size-16 align-middle me-1" />
              Settings
            </Link>
          </DropdownItem>
          
          <DropdownItem tag="div">
            <Link href="/lock-screen" className="dropdown-item">
              <i className="bx bx-lock-open font-size-16 align-middle me-1" />
              Lock screen
            </Link>
          </DropdownItem>
          
          <div className="dropdown-divider" />
          
          <DropdownItem tag="div">
            <button 
              onClick={handleLogout}
              className="dropdown-item"
              style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
            >
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>Logout</span>
            </button>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileMenu;