"use client"

import PropTypes from "prop-types"
import React, { useEffect, useRef } from "react"

// Import Scrollbar
import SimpleBar from "simplebar-react"

// MetisMenu
import MetisMenu from "metismenujs"
import { Link, usePage } from "@inertiajs/react"

//i18n
import { withTranslation } from "react-i18next"
import { useCallback } from "react"

// Import menu items configuration
import { menuItems } from "@/constants/menuItems"

const SidebarContent = (props) => {
  const ref = useRef()
  const { url } = usePage() // Get current URL from Inertia

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active")
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show")
    }

    if (parent) {
      parent.classList.add("mm-active")
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add("mm-show") // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add("mm-active") // li
          parent3.childNodes[0].classList.add("mm-active") //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add("mm-show") // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add("mm-show") // li
              parent5.childNodes[0].classList.add("mm-active") // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains("active")) {
        item.classList.remove("active")
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1] ? parent.childNodes[1] : null
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show")
        }

        parent.classList.remove("mm-active")
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove("mm-show")

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove("mm-active") // li
            parent3.childNodes[0].classList.remove("mm-active")

            const parent4 = parent3.parentElement // ul
            if (parent4) {
              parent4.classList.remove("mm-show") // ul
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove("mm-show") // li
                parent5.childNodes[0].classList.remove("mm-active") // a tag
              }
            }
          }
        }
      }
    }
  }

  const activeMenu = useCallback(() => {
    const pathName = url // Use Inertia's current URL
    let matchingMenuItem = null
    const ul = document.getElementById("side-menu")
    const items = ul.getElementsByTagName("a")
    removeActivation(items)

    for (let i = 0; i < items.length; ++i) {
      // Compare with href attribute for Inertia links
      if (pathName === items[i].getAttribute("href")) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [url, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  }, [])

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu")
    activeMenu()

    // Cleanup on component unmount
    return () => {
      metisMenu.dispose()
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    activeMenu()
  }, [activeMenu])

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  // Recursive function to render menu items
  const renderMenuItem = (item, level = 0) => {
    // Render header items
    if (item.isHeader) {
      return (
        <li key={item.id} className="menu-title">
          {props.t(item.label)}
        </li>
      )
    }

    // Render menu items with sub-items
    if (item.subItems && item.subItems.length > 0) {
      return (
        <li key={item.id}>
          <Link href={item.link || "#"} className="has-arrow">
            {item.icon && <i className={item.icon}></i>}
            <span>{props.t(item.label)}</span>
            {item.badge && (
              <span className={`badge rounded-pill ${item.badgecolor || "bg-primary"}`}>{item.badge}</span>
            )}
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            {item.subItems.map((subItem) => renderSubMenuItem(subItem, level + 1))}
          </ul>
        </li>
      )
    }

    // Render simple menu items
    return (
      <li key={item.id}>
        <Link href={item.link}>
          {item.icon && <i className={item.icon}></i>}
          <span>{props.t(item.label)}</span>
          {item.badge && <span className={`badge rounded-pill ${item.badgecolor || "bg-primary"}`}>{item.badge}</span>}
        </Link>
      </li>
    )
  }

  // Function to render sub-menu items (can be nested)
  const renderSubMenuItem = (item, level = 1) => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <li key={item.id}>
          <Link href={item.link || "#"} className="has-arrow">
            <span>{props.t(item.label)}</span>
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            {item.subItems.map((subItem) => renderSubMenuItem(subItem, level + 1))}
          </ul>
        </li>
      )
    }

    return (
      <li key={item.id}>
        <Link href={item.link}>{props.t(item.label)}</Link>
      </li>
    )
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {menuItems.map((item) => renderMenuItem(item))}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(SidebarContent)
