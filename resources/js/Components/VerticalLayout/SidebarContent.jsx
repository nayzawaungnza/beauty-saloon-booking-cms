import React, { useEffect, useRef, useCallback } from "react";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import { Link, usePage } from "@inertiajs/react";
import { menuItems } from "@/constants/menuItems"; // Import the menu configuration

const SidebarContent = ({ type }) => {
  const ref = useRef();
  const { url } = usePage();

  // ... (keep all the existing functions: activateParentDropdown, removeActivation, activeMenu, scrollElement)

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active");
          parent3.childNodes[0].classList.add("mm-active");
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show");
              parent5.childNodes[0].classList.add("mm-active");
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active");
            parent3.childNodes[0].classList.remove("mm-active");
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show");
                parent5.childNodes[0].classList.remove("mm-active");
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = url;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    if (!ul) return;
    
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      const href = items[i].getAttribute("href");
      if (pathName === href || pathName.startsWith(href + "/")) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [url, activateParentDropdown]);

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate();
    }
  }, []);

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();

    return () => {
      if (metisMenu && metisMenu.dispose) {
        metisMenu.dispose();
      }
    };
  }, [activeMenu]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item && ref.current) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  // Recursive function to render menu items
  const renderMenuItem = (item) => {
    if (item.isHeader) {
      return (
        <li key={item.id} className="menu-title">
          {item.label}
        </li>
      );
    }

    if (item.subItems && item.subItems.length > 0) {
      return (
        <li key={item.id}>
          <Link href={item.link} className="has-arrow">
            {item.icon && <i className={item.icon}></i>}
            {item.badge && (
              <span className={`badge rounded-pill ${item.badgecolor} float-end`}>
                {item.badge}
              </span>
            )}
            <span>{item.label}</span>
          </Link>
          <ul className="sub-menu" aria-expanded="false">
            {item.subItems.map((subItem) => renderMenuItem(subItem))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.id}>
        <Link href={item.link} className="">
          {item.icon && <i className={item.icon}></i>}
          {item.badge && (
            <span className={`badge rounded-pill ${item.badgecolor} float-end`}>
              {item.badge}
            </span>
          )}
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

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
  );
};

export default SidebarContent;