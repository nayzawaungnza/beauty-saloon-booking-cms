import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";

// Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, usePage } from "@inertiajs/react";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";

const SidebarContent = (props) => {
  const ref = useRef();
  const { url } = usePage(); // Get current URL from Inertia

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
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
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
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = url; // Use Inertia's current URL
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      // Compare with href attribute for Inertia links
      if (pathName === items[i].getAttribute('href')) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [url, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    const metisMenu = new MetisMenu("#side-menu");
    activeMenu();

    // Cleanup on component unmount
    return () => {
      metisMenu.dispose();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            
            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboards")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/dashboard">{props.t("Default")}</Link>
                </li>
                <li>
                  <Link href="/admin/dashboard/saas">{props.t("Saas")}</Link>
                </li>
                <li>
                  <Link href="/admin/dashboard/crypto">{props.t("Crypto")}</Link>
                </li>
                <li>
                  <Link href="/admin/dashboard/blog">{props.t("Blog")}</Link>
                </li>
                <li>
                  <Link href="/admin/dashboard/job">{props.t("Job")}</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{props.t("Apps")}</li>

            <li>
              <Link href="/admin/calendar" className="">
                <i className="bx bx-calendar"></i>
                <span>{props.t("Calendar")}</span>
              </Link>
            </li>

            <li>
              <Link href="/admin/chat" className="">
                <i className="bx bx-chat"></i>
                <span>{props.t("Chat")}</span>
              </Link>
            </li>

            <li>
              <Link href="/admin/file-manager">
                <i className="bx bx-file"></i>
                <span>{props.t("File Manager")}</span>
              </Link>
            </li>

            {/* User Management */}
            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bxs-group"></i>
                <span>{props.t("User Management")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/users">{props.t("Users List")}</Link>
                </li>
                <li>
                  <Link href="/admin/users/create">{props.t("Create User")}</Link>
                </li>
                <li>
                  <Link href="/admin/roles">{props.t("Roles & Permissions")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bxs-group"></i>
                <span>{props.t("Service Management")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/services">{props.t("Services List")}</Link>
                </li>
                <li>
                  <Link href="/admin/services/create">{props.t("Create Service")}</Link>
                </li>
                
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-store"></i>
                <span>{props.t("Ecommerce")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/ecommerce/products">{props.t("Products")}</Link>
                </li>
                <li>
                  <Link href="/admin/ecommerce/products/create">
                    {props.t("Add Product")}
                  </Link>
                </li>
                <li>
                  <Link href="/admin/ecommerce/orders">{props.t("Orders")}</Link>
                </li>
                <li>
                  <Link href="/admin/ecommerce/customers">{props.t("Customers")}</Link>
                </li>
                <li>
                  <Link href="/admin/ecommerce/categories">{props.t("Categories")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-envelope"></i>
                <span>{props.t("Email")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/email/inbox">{props.t("Inbox")}</Link>
                </li>
                <li>
                  <Link href="/admin/email/compose">{props.t("Compose")}</Link>
                </li>
                <li>
                  <Link href="#" className="has-arrow">
                    <span>{props.t("Templates")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link href="/admin/email/templates/basic">
                        {props.t("Basic Action")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/email/templates/alert">
                        {props.t("Alert Email")}
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/email/templates/billing">
                        {props.t("Billing Email")}
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-receipt"></i>
                <span>{props.t("Invoices")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/invoices">{props.t("Invoice List")}</Link>
                </li>
                <li>
                  <Link href="/admin/invoices/create">{props.t("Create Invoice")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-briefcase-alt-2"></i>
                <span>{props.t("Projects")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/projects">{props.t("Projects List")}</Link>
                </li>
                <li>
                  <Link href="/admin/projects/create">{props.t("Create Project")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-task"></i>
                <span>{props.t("Tasks")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/tasks">{props.t("Task List")}</Link>
                </li>
                <li>
                  <Link href="/admin/tasks/kanban">{props.t("Tasks Kanban")}</Link>
                </li>
                <li>
                  <Link href="/admin/tasks/create">{props.t("Create Task")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bxs-detail" />
                <span>{props.t("Blog")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/blog/posts">{props.t("Blog Posts")}</Link>
                </li>
                <li>
                  <Link href="/admin/blog/posts/create">{props.t("Create Post")}</Link>
                </li>
                <li>
                  <Link href="/admin/blog/categories">{props.t("Categories")}</Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{props.t("Settings")}</li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-cog"></i>
                <span>{props.t("Settings")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/settings/general">{props.t("General Settings")}</Link>
                </li>
                <li>
                  <Link href="/admin/settings/email">{props.t("Email Settings")}</Link>
                </li>
                <li>
                  <Link href="/admin/settings/notifications">{props.t("Notifications")}</Link>
                </li>
                <li>
                  <Link href="/admin/settings/security">{props.t("Security")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-user-circle"></i>
                <span>{props.t("Authentication")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link href="/login">{props.t("Login")}</Link>
                </li>
                <li>
                  <Link href="/register">{props.t("Register")}</Link>
                </li>
                <li>
                  <Link href="/forgot-password">
                    {props.t("Forgot Password")}
                  </Link>
                </li>
                <li>
                  <Link href="/reset-password">
                    {props.t("Reset Password")}
                  </Link>
                </li>
                <li>
                  <Link href="/email/verify">
                    {props.t("Email Verification")}
                  </Link>
                </li>
                <li>
                  <Link href="/two-factor-challenge">
                    {props.t("Two Factor Authentication")}
                  </Link>
                </li>
              </ul>
            </li>

            <li className="menu-title">{props.t("Components")}</li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-tone"></i>
                <span>{props.t("UI Elements")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/ui/alerts">{props.t("Alerts")}</Link>
                </li>
                <li>
                  <Link href="/admin/ui/buttons">{props.t("Buttons")}</Link>
                </li>
                <li>
                  <Link href="/admin/ui/cards">{props.t("Cards")}</Link>
                </li>
                <li>
                  <Link href="/admin/ui/modals">{props.t("Modals")}</Link>
                </li>
                <li>
                  <Link href="/admin/ui/tabs">{props.t("Tabs & Accordions")}</Link>
                </li>
                <li>
                  <Link href="/admin/ui/typography">{props.t("Typography")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bxs-eraser"></i>
                <span>{props.t("Forms")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/forms/elements">{props.t("Form Elements")}</Link>
                </li>
                <li>
                  <Link href="/admin/forms/layouts">{props.t("Form Layouts")}</Link>
                </li>
                <li>
                  <Link href="/admin/forms/validation">{props.t("Form Validation")}</Link>
                </li>
                <li>
                  <Link href="/admin/forms/advanced">{props.t("Form Advanced")}</Link>
                </li>
                <li>
                  <Link href="/admin/forms/editors">{props.t("Form Editors")}</Link>
                </li>
                <li>
                  <Link href="/admin/forms/upload">{props.t("File Upload")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-list-ul"></i>
                <span>{props.t("Tables")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/tables/basic">{props.t("Basic Tables")}</Link>
                </li>
                <li>
                  <Link href="/admin/tables/data">{props.t("Data Tables")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bxs-bar-chart-alt-2"></i>
                <span>{props.t("Charts")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/charts/apex">{props.t("Apex Charts")}</Link>
                </li>
                <li>
                  <Link href="/admin/charts/chartjs">{props.t("Chart.js")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="#" className="has-arrow">
                <i className="bx bx-aperture"></i>
                <span>{props.t("Icons")}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link href="/admin/icons/boxicons">{props.t("Boxicons")}</Link>
                </li>
                <li>
                  <Link href="/admin/icons/feather">{props.t("Feather Icons")}</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(SidebarContent);