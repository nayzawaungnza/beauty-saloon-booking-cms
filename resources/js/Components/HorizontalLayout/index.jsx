import React, { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import PropTypes from "prop-types";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Actions
import {
  changeLayout,
  changeTopbarTheme,
  changeLayoutWidth,
  showRightSidebarAction,
  changeLayoutMode,
} from "@/store/actions";

// Components
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
import RightSidebar from "../CommonForBoth/RightSidebar";

const Layout = (props) => {
  const dispatch = useDispatch();
  const { url } = usePage();

  const selectLayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      topbarTheme: layout.topbarTheme,
      layoutWidth: layout.layoutWidth,
      isPreloader: layout.isPreloader,
      showRightSidebar: layout.showRightSidebar,
      layoutModeType: layout.layoutModeType,
    })
  );

  const {
    topbarTheme,
    layoutModeType,
    layoutWidth,
    isPreloader,
    showRightSidebar
  } = useSelector(selectLayoutProperties);

  // Document title
  useEffect(() => {
    const path = url.split('/').filter(Boolean);
    const currentPage = path.length > 0 
      ? path[path.length - 1].charAt(0).toUpperCase() + path[path.length - 1].slice(1)
      : 'Dashboard';
    
    document.title = `${currentPage} | Skote - Vite React Admin & Dashboard Template`;
  }, [url]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hides right sidebar on body click
  const hideRightbar = (event) => {
    const rightbar = document.getElementById("right-bar");
    if (rightbar && rightbar.contains(event.target)) {
      return;
    } else {
      dispatch(showRightSidebarAction(false));
    }
  };

  // Layout settings
  useEffect(() => {
    dispatch(changeLayout("horizontal"));
  }, [dispatch]);

  useEffect(() => {
    document.body.addEventListener("click", hideRightbar, true);

    if (isPreloader) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }

    return () => {
      document.body.removeEventListener("click", hideRightbar, true);
    };
  }, [isPreloader]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }
  }, [layoutModeType, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header
          theme={topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu}
        />
        <Navbar menuOpen={isMenuOpened} />
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>

      {showRightSidebar && <RightSidebar />}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default Layout;