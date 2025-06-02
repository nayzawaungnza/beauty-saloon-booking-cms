"use client"

import React from "react"
import { Row, Col, FormGroup } from "reactstrap"
import SimpleBar from "simplebar-react"

// Layout Context
import {
  useLayout,
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftBarThemeImageTypes,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from "@/Contexts/LayoutContext"

// Import images - place these in public/images/
import bgimg1 from "@/assets/images/sidebar/img1.jpg"
import bgimg2 from "@/assets/images/sidebar/img2.jpg"
import bgimg3 from "@/assets/images/sidebar/img3.jpg"
import bgimg4 from "@/assets/images/sidebar/img4.jpg"
import layout1 from "@/assets/images/layouts/layout-1.jpg"
import layout2 from "@/assets/images/layouts/layout-2.jpg"
import layout3 from "@/assets/images/layouts/layout-3.jpg"

const RightSidebar = () => {
  const {
    layoutType,
    layoutModeType,
    layoutWidth,
    leftSideBarTheme,
    leftSideBarThemeImage,
    leftSideBarType,
    topbarTheme,
    isPreloader,
    changeLayout,
    changeLayoutMode,
    changeLayoutWidth,
    changeSidebarTheme,
    changeSidebarThemeImage,
    changeSidebarType,
    changeTopbarTheme,
    changePreloader,
    showRightSidebarAction,
  } = useLayout()

  const handleCloseRightSidebar = (e) => {
    e.preventDefault()
    showRightSidebarAction(false)
  }

  return (
    <React.Fragment>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <button
                onClick={handleCloseRightSidebar}
                className="right-bar-toggle float-end btn btn-sm"
                style={{ border: "none", background: "none" }}
              >
                <i className="mdi mdi-close noti-icon" />
              </button>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts</span>
                <input
                  type="radio"
                  id="radioVertical"
                  name="radioFruit"
                  value={layoutTypes.VERTICAL}
                  checked={layoutType === layoutTypes.VERTICAL}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayout(e.target.value)
                    }
                  }}
                />
                <label className="me-1" htmlFor="radioVertical">
                  Vertical
                </label>
                <input
                  type="radio"
                  id="radioHorizontal"
                  name="radioFruit"
                  value={layoutTypes.HORIZONTAL}
                  checked={layoutType === layoutTypes.HORIZONTAL}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayout(e.target.value)
                    }
                  }}
                />
                <label htmlFor="radioHorizontal">Horizontal</label>
              </div>

              <hr className="mt-1" />
              <div className="radio-toolbar">
                <span className="mb-2 d-block">Layouts Mode</span>
                <input
                  type="radio"
                  id="radioLight"
                  name="radioLight"
                  value={layoutModeTypes.LIGHT}
                  checked={layoutModeType === layoutModeTypes.LIGHT}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutMode(e.target.value)
                    }
                  }}
                />
                <label className="me-1" htmlFor="radioLight">
                  Light
                </label>
                <input
                  type="radio"
                  id="radioDark"
                  name="radioDark"
                  value={layoutModeTypes.DARK}
                  checked={layoutModeType === layoutModeTypes.DARK}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutMode(e.target.value)
                    }
                  }}
                />
                <label htmlFor="radioDark">Dark</label>
              </div>

              <hr className="mt-1" />
              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Layout Width
                </span>
                <input
                  type="radio"
                  id="radioFluid"
                  name="radioWidth"
                  value={layoutWidthTypes.FLUID}
                  checked={layoutWidth === layoutWidthTypes.FLUID}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutWidth(e.target.value)
                    }
                  }}
                />
                <label className="me-1" htmlFor="radioFluid">
                  Fluid
                </label>
                <input
                  type="radio"
                  id="radioBoxed"
                  name="radioWidth"
                  value={layoutWidthTypes.BOXED}
                  checked={layoutWidth === layoutWidthTypes.BOXED}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutWidth(e.target.value)
                    }
                  }}
                />
                <label htmlFor="radioBoxed" className="me-1">
                  Boxed
                </label>
                <input
                  type="radio"
                  id="radioscrollable"
                  name="radioscrollable"
                  value={layoutWidthTypes.SCROLLABLE}
                  checked={layoutWidth === layoutWidthTypes.SCROLLABLE}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeLayoutWidth(e.target.value)
                    }
                  }}
                />
                <label htmlFor="radioscrollable">Scrollable</label>
              </div>
              <hr className="mt-1" />

              <div className="radio-toolbar">
                <span className="mb-2 d-block" id="radio-title">
                  Topbar Theme
                </span>
                <input
                  type="radio"
                  id="radioThemeLight"
                  name="radioTheme"
                  value={topBarThemeTypes.LIGHT}
                  checked={topbarTheme === topBarThemeTypes.LIGHT}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeTopbarTheme(e.target.value)
                    }
                  }}
                />
                <label className="me-1" htmlFor="radioThemeLight">
                  Light
                </label>
                <input
                  type="radio"
                  id="radioThemeDark"
                  name="radioTheme"
                  value={topBarThemeTypes.DARK}
                  checked={topbarTheme === topBarThemeTypes.DARK}
                  onChange={(e) => {
                    if (e.target.checked) {
                      changeTopbarTheme(e.target.value)
                    }
                  }}
                />
                <label className="me-1" htmlFor="radioThemeDark">
                  Dark
                </label>
                {layoutType === "vertical" ? null : (
                  <>
                    <input
                      type="radio"
                      id="radioThemeColored"
                      name="radioTheme"
                      value={topBarThemeTypes.COLORED}
                      checked={topbarTheme === topBarThemeTypes.COLORED}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeTopbarTheme(e.target.value)
                        }
                      }}
                    />
                    <label className="me-1" htmlFor="radioThemeColored">
                      Colored
                    </label>
                  </>
                )}
              </div>

              {layoutType === "vertical" ? (
                <React.Fragment>
                  <hr className="mt-1" />
                  <div className="radio-toolbar">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Type
                    </span>
                    <input
                      type="radio"
                      id="sidebarDefault"
                      name="sidebarType"
                      value={leftSidebarTypes.DEFAULT}
                      checked={leftSideBarType === leftSidebarTypes.DEFAULT}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarType(e.target.value)
                        }
                      }}
                    />
                    <label className="me-1" htmlFor="sidebarDefault">
                      Default
                    </label>
                    <input
                      type="radio"
                      id="sidebarCompact"
                      name="sidebarType"
                      value={leftSidebarTypes.COMPACT}
                      checked={leftSideBarType === leftSidebarTypes.COMPACT}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarType(e.target.value)
                        }
                      }}
                    />
                    <label className="me-1" htmlFor="sidebarCompact">
                      Compact
                    </label>
                    <input
                      type="radio"
                      id="sidebarIcon"
                      name="sidebarType"
                      value={leftSidebarTypes.ICON}
                      checked={leftSideBarType === leftSidebarTypes.ICON}
                      onChange={(e) => {
                        if (e.target.checked) {
                          changeSidebarType(e.target.value)
                        }
                      }}
                    />
                    <label className="me-1" htmlFor="sidebarIcon">
                      Icon
                    </label>
                  </div>

                  <hr className="mt-1" />

                  <div className="radio-toolbar coloropt-radio">
                    <span className="mb-2 d-block" id="radio-title">
                      Left Sidebar Color Options
                    </span>
                    <Row>
                      <Col>
                        <input
                          type="radio"
                          id="leftsidebarThemelight"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.LIGHT}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.LIGHT}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemelight"
                          className={
                            layoutModeType === "dark"
                              ? "bg-dark rounded-circle wh-30 me-1"
                              : "bg-light rounded-circle wh-30 me-1"
                          }
                        ></label>

                        <input
                          type="radio"
                          id="leftsidebarThemedark"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.DARK}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.DARK}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemedark"
                          className={
                            layoutModeType === "light"
                              ? "bg-dark rounded-circle wh-30 me-1"
                              : "bg-light rounded-circle wh-30 me-1"
                          }
                        ></label>

                        <input
                          type="radio"
                          id="leftsidebarThemecolored"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.COLORED}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.COLORED}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemecolored"
                          className="bg-colored rounded-circle wh-30 me-1"
                        ></label>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <input
                          type="radio"
                          id="leftsidebarThemewinter"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.WINTER}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.WINTER}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemewinter"
                          className="gradient-winter rounded-circle wh-30 me-1"
                        ></label>

                        <input
                          type="radio"
                          id="leftsidebarThemeladylip"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.LADYLIP}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.LADYLIP}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemeladylip"
                          className="gradient-lady-lip rounded-circle wh-30 me-1"
                        ></label>

                        <input
                          type="radio"
                          id="leftsidebarThemeplumplate"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.PLUMPLATE}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.PLUMPLATE}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemeplumplate"
                          className="gradient-plum-plate rounded-circle wh-30 me-1"
                        ></label>

                        <input
                          type="radio"
                          id="leftsidebarThemestrongbliss"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.STRONGBLISS}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.STRONGBLISS}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemestrongbliss"
                          className="gradient-strong-bliss rounded-circle wh-30 me-1"
                        ></label>

                        <input
                          type="radio"
                          id="leftsidebarThemesgreatwhale"
                          name="leftsidebarTheme"
                          value={leftSideBarThemeTypes.GREATWHALE}
                          checked={leftSideBarTheme === leftSideBarThemeTypes.GREATWHALE}
                          onChange={(e) => {
                            if (e.target.checked) {
                              changeSidebarTheme(e.target.value)
                            }
                          }}
                        />
                        <label
                          htmlFor="leftsidebarThemesgreatwhale"
                          className="gradient-strong-great-whale rounded-circle wh-30 me-1"
                        ></label>
                      </Col>
                    </Row>
                  </div>

                  <div className="radio-toolbar imgopt-radio">
                    <span className="mb-2 d-block" id="radio-bgimg">
                      Left Sidebar Bg Image
                    </span>
                    <div className="d-flex gap-2 flex-wrap">
                      <input
                        type="radio"
                        id="leftsidebarThemebgimg1"
                        name="leftsidebarThemeImage"
                        value={leftBarThemeImageTypes.IMG1}
                        checked={leftSideBarThemeImage === leftBarThemeImageTypes.IMG1}
                        onChange={(e) => {
                          if (e.target.checked) {
                            changeSidebarThemeImage(e.target.value)
                          }
                        }}
                      />
                      <label htmlFor="leftsidebarThemebgimg1">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg1 || "/placeholder.svg?height=90&width=90"}
                        />
                      </label>

                      <input
                        type="radio"
                        id="leftsidebarThemebgimg2"
                        name="leftsidebarThemeImage"
                        value={leftBarThemeImageTypes.IMG2}
                        checked={leftSideBarThemeImage === leftBarThemeImageTypes.IMG2}
                        onChange={(e) => {
                          if (e.target.checked) {
                            changeSidebarThemeImage(e.target.value)
                          }
                        }}
                      />
                      <label htmlFor="leftsidebarThemebgimg2">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg2 || "/placeholder.svg?height=90&width=90"}
                        />
                      </label>

                      <input
                        type="radio"
                        id="leftsidebarThemebgimg3"
                        name="leftsidebarThemeImage"
                        value={leftBarThemeImageTypes.IMG3}
                        checked={leftSideBarThemeImage === leftBarThemeImageTypes.IMG3}
                        onChange={(e) => {
                          if (e.target.checked) {
                            changeSidebarThemeImage(e.target.value)
                          }
                        }}
                      />
                      <label htmlFor="leftsidebarThemebgimg3">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg3 || "/placeholder.svg?height=90&width=90"}
                        />
                      </label>

                      <input
                        type="radio"
                        id="leftsidebarThemebgimg4"
                        name="leftsidebarThemeImage"
                        value={leftBarThemeImageTypes.IMG4}
                        checked={leftSideBarThemeImage === leftBarThemeImageTypes.IMG4}
                        onChange={(e) => {
                          if (e.target.checked) {
                            changeSidebarThemeImage(e.target.value)
                          }
                        }}
                      />
                      <label htmlFor="leftsidebarThemebgimg4">
                        <img
                          alt="sidebar bg image"
                          width="90"
                          className="themesideimage rounded"
                          src={bgimg4 || "/placeholder.svg?height=90&width=90"}
                        />
                      </label>

                      <input
                        type="radio"
                        id="leftsidebarThemenone"
                        name="leftsidebarThemeImage"
                        value={leftBarThemeImageTypes.NONE}
                        checked={leftSideBarThemeImage === leftBarThemeImageTypes.NONE}
                        onChange={(e) => {
                          if (e.target.checked) {
                            changeSidebarThemeImage(e.target.value)
                          }
                        }}
                      />
                      <label htmlFor="leftsidebarThemenone">
                        <div style={{ width: "40px", height: "80px" }}>
                          <div className="bg-light border px-2 h-100 shadow-none">
                            <div className="verticalcontent">None</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <hr className="mt-1" />
                </React.Fragment>
              ) : null}

              <FormGroup>
                <span className="mb-2 d-block" id="radio-title">
                  Preloader
                </span>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input checkbox"
                    id="checkbox_1"
                    checked={isPreloader}
                    onChange={() => {
                      changePreloader(!isPreloader)
                    }}
                  />
                  <label className="form-check-label" htmlFor="checkbox_1">
                    Preloader
                  </label>
                </div>
              </FormGroup>

              <h6 className="text-center">Choose Layouts</h6>

              <div className="mb-2">
                <a href="//skote-v-light.react.themesbrand.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src={layout1 || "/placeholder.svg?height=200&width=300"}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                </a>
              </div>

              <div className="mb-2">
                <a href="//skote-v-dark.react.themesbrand.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src={layout2 || "/placeholder.svg?height=200&width=300"}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                </a>
              </div>

              <div className="mb-2">
                <a href="//skote-v-rtl.react.themesbrand.com" target="_blank" rel="noopener noreferrer">
                  <img
                    src={layout3 || "/placeholder.svg?height=200&width=300"}
                    className="img-fluid img-thumbnail"
                    alt=""
                  />
                </a>
              </div>

              <a
                href="//1.envato.market/skotereact"
                className="btn btn-primary btn-block mt-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="mdi mdi-cart ms-1" /> Purchase Now
              </a>
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </React.Fragment>
  )
}

export default RightSidebar
