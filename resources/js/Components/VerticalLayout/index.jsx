"use client"

import React, { useEffect, useCallback } from "react"
import { usePage } from "@inertiajs/react"

// Layout Related Components
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import RightSidebar from "@/Components/CommonForBoth/RightSidebar"

// Layout Context
import { LayoutProvider, useLayout, leftSidebarTypes } from "@/Contexts/LayoutContext"

const LayoutContent = ({ children }) => {
  const {
    isPreloader,
    leftSideBarTheme,
    leftSideBarType,
    showRightSidebar,
    isMobile,
    changeSidebarType,
    showRightSidebarAction,
    changeLayout,
  } = useLayout()

  const { url } = usePage()

  // Toggle menu callback with animation fix
  const toggleMenuCallback = useCallback(() => {
    const sidebar = document.getElementById("sidebar")
    const body = document.body

    if (leftSideBarType === leftSidebarTypes.DEFAULT) {
      changeSidebarType(leftSidebarTypes.CONDENSED)
      body.classList.add("sidebar-enable")
      body.classList.add("vertical-collpsed")

      // Add animation class
      if (sidebar) {
        sidebar.classList.add("sidebar-animating")
        setTimeout(() => {
          sidebar.classList.remove("sidebar-animating")
        }, 300)
      }
    } else if (leftSideBarType === leftSidebarTypes.CONDENSED) {
      changeSidebarType(leftSidebarTypes.DEFAULT)
      body.classList.remove("sidebar-enable")
      body.classList.remove("vertical-collpsed")

      // Add animation class
      if (sidebar) {
        sidebar.classList.add("sidebar-animating")
        setTimeout(() => {
          sidebar.classList.remove("sidebar-animating")
        }, 300)
      }
    }
  }, [leftSideBarType, changeSidebarType])

  // Hide right sidebar on body click
  const hideRightbar = useCallback(
    (event) => {
      const rightbar = document.getElementById("right-bar")
      const rightbarToggle = document.querySelector(".right-bar-toggle")

      // If clicked inside right bar or on toggle button, do nothing
      if ((rightbar && rightbar.contains(event.target)) || (rightbarToggle && rightbarToggle.contains(event.target))) {
        return
      } else {
        // If clicked outside of rightbar then hide it
        showRightSidebarAction(false)
      }
    },
    [showRightSidebarAction],
  )

  // Initialize layout settings
  useEffect(() => {
    // Set default layout
    changeLayout("vertical")

    // Initialize body click event for toggle rightbar
    document.body.addEventListener("click", hideRightbar, true)

    return () => {
      document.body.removeEventListener("click", hideRightbar, true)
    }
  }, [changeLayout, hideRightbar])

  // Handle preloader
  useEffect(() => {
    const preloader = document.getElementById("preloader")
    const status = document.getElementById("status")

    if (isPreloader) {
      if (preloader) preloader.style.display = "block"
      if (status) status.style.display = "block"

      setTimeout(() => {
        if (preloader) preloader.style.display = "none"
        if (status) status.style.display = "none"
      }, 2500)
    } else {
      if (preloader) preloader.style.display = "none"
      if (status) status.style.display = "none"
    }
  }, [isPreloader])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [url])

  // Handle right sidebar visibility
  useEffect(() => {
    const rightBar = document.getElementById("right-bar")
    const overlay = document.querySelector(".rightbar-overlay")

    if (showRightSidebar) {
      if (rightBar) rightBar.classList.add("right-bar-enabled")
      if (overlay) overlay.classList.add("show")
      document.body.classList.add("right-bar-enabled")
    } else {
      if (rightBar) rightBar.classList.remove("right-bar-enabled")
      if (overlay) overlay.classList.remove("show")
      document.body.classList.remove("right-bar-enabled")
    }
  }, [showRightSidebar])

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
        <Header toggleMenuCallback={toggleMenuCallback} />
        <Sidebar theme={leftSideBarTheme} type={leftSideBarType} isMobile={isMobile} />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">{children}</div>
          </div>
        </div>
        <Footer />
      </div>

      {showRightSidebar && <RightSidebar />}
    </React.Fragment>
  )
}

const Layout = ({ children }) => {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  )
}

export default Layout
