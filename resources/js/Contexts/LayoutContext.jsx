"use client"

import { createContext, useContext, useReducer, useEffect } from "react"

// Layout constants
export const layoutTypes = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
}

export const layoutWidthTypes = {
  FLUID: "fluid",
  BOXED: "boxed",
  SCROLLABLE: "scrollable",
}

export const layoutModeTypes = {
  DARK: "dark",
  LIGHT: "light",
}

export const topBarThemeTypes = {
  LIGHT: "light",
  DARK: "dark",
  COLORED: "colored",
}

export const leftBarThemeImageTypes = {
  NONE: "none",
  IMG1: "img1",
  IMG2: "img2",
  IMG3: "img3",
  IMG4: "img4",
}

export const leftSidebarTypes = {
  DEFAULT: "default",
  COMPACT: "compact",
  ICON: "icon",
  CONDENSED: "condensed",
}

export const leftSideBarThemeTypes = {
  LIGHT: "light",
  COLORED: "colored",
  DARK: "dark",
  WINTER: "winter",
  LADYLIP: "ladylip",
  PLUMPLATE: "plumplate",
  STRONGBLISS: "strongbliss",
  GREATWHALE: "greatwhale",
}

// Initial state
const initialState = {
  layoutType: "vertical",
  layoutModeType: "light",
  layoutWidth: "fluid",
  leftSideBarTheme: "dark",
  leftSideBarThemeImage: "none",
  leftSideBarType: "default",
  topbarTheme: "light",
  isPreloader: false,
  showRightSidebar: false,
  isMobile: false,
}

// Action types
const LAYOUT_ACTIONS = {
  CHANGE_LAYOUT: "CHANGE_LAYOUT",
  CHANGE_LAYOUT_MODE: "CHANGE_LAYOUT_MODE",
  CHANGE_LAYOUT_WIDTH: "CHANGE_LAYOUT_WIDTH",
  CHANGE_SIDEBAR_THEME: "CHANGE_SIDEBAR_THEME",
  CHANGE_SIDEBAR_THEME_IMAGE: "CHANGE_SIDEBAR_THEME_IMAGE",
  CHANGE_SIDEBAR_TYPE: "CHANGE_SIDEBAR_TYPE",
  CHANGE_TOPBAR_THEME: "CHANGE_TOPBAR_THEME",
  CHANGE_PRELOADER: "CHANGE_PRELOADER",
  SHOW_RIGHT_SIDEBAR: "SHOW_RIGHT_SIDEBAR",
  SET_MOBILE: "SET_MOBILE",
  LOAD_SETTINGS: "LOAD_SETTINGS",
}

// Reducer
const layoutReducer = (state, action) => {
  switch (action.type) {
    case LAYOUT_ACTIONS.CHANGE_LAYOUT:
      return { ...state, layoutType: action.payload }
    case LAYOUT_ACTIONS.CHANGE_LAYOUT_MODE:
      return { ...state, layoutModeType: action.payload }
    case LAYOUT_ACTIONS.CHANGE_LAYOUT_WIDTH:
      return { ...state, layoutWidth: action.payload }
    case LAYOUT_ACTIONS.CHANGE_SIDEBAR_THEME:
      return { ...state, leftSideBarTheme: action.payload }
    case LAYOUT_ACTIONS.CHANGE_SIDEBAR_THEME_IMAGE:
      return { ...state, leftSideBarThemeImage: action.payload }
    case LAYOUT_ACTIONS.CHANGE_SIDEBAR_TYPE:
      return { ...state, leftSideBarType: action.payload }
    case LAYOUT_ACTIONS.CHANGE_TOPBAR_THEME:
      return { ...state, topbarTheme: action.payload }
    case LAYOUT_ACTIONS.CHANGE_PRELOADER:
      return { ...state, isPreloader: action.payload }
    case LAYOUT_ACTIONS.SHOW_RIGHT_SIDEBAR:
      return { ...state, showRightSidebar: action.payload }
    case LAYOUT_ACTIONS.SET_MOBILE:
      return { ...state, isMobile: action.payload }
    case LAYOUT_ACTIONS.LOAD_SETTINGS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// Context
const LayoutContext = createContext()

// Provider component
export const LayoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(layoutReducer, initialState)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("layoutSettings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        dispatch({ type: LAYOUT_ACTIONS.LOAD_SETTINGS, payload: settings })
      } catch (error) {
        console.error("Error loading layout settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("layoutSettings", JSON.stringify(state))
  }, [state])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
      dispatch({ type: LAYOUT_ACTIONS.SET_MOBILE, payload: isMobile })
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Apply layout classes to body
  useEffect(() => {
    const body = document.body

    // Remove all layout classes
    body.classList.remove(
      "vertical-layout",
      "horizontal-layout",
      "light-mode",
      "dark-mode",
      "fluid-layout",
      "boxed-layout",
      "scrollable-layout",
      "sidebar-light",
      "sidebar-dark",
      "sidebar-colored",
      "sidebar-default",
      "sidebar-compact",
      "sidebar-icon",
      "sidebar-condensed",
      "topbar-light",
      "topbar-dark",
      "topbar-colored",
    )

    // Apply current layout classes
    body.classList.add(`${state.layoutType}-layout`)
    body.classList.add(`${state.layoutModeType}-mode`)
    body.classList.add(`${state.layoutWidth}-layout`)
    body.classList.add(`sidebar-${state.leftSideBarTheme}`)
    body.classList.add(`sidebar-${state.leftSideBarType}`)
    body.classList.add(`topbar-${state.topbarTheme}`)

    // Apply sidebar theme image
    if (state.leftSideBarThemeImage !== "none") {
      body.classList.add(`sidebar-bg-${state.leftSideBarThemeImage}`)
    }
  }, [state])

  // Action creators
  const actions = {
    changeLayout: (layout) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_LAYOUT, payload: layout }),
    changeLayoutMode: (mode) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_LAYOUT_MODE, payload: mode }),
    changeLayoutWidth: (width) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_LAYOUT_WIDTH, payload: width }),
    changeSidebarTheme: (theme) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_SIDEBAR_THEME, payload: theme }),
    changeSidebarThemeImage: (image) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_SIDEBAR_THEME_IMAGE, payload: image }),
    changeSidebarType: (type) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_SIDEBAR_TYPE, payload: type }),
    changeTopbarTheme: (theme) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_TOPBAR_THEME, payload: theme }),
    changePreloader: (show) => dispatch({ type: LAYOUT_ACTIONS.CHANGE_PRELOADER, payload: show }),
    showRightSidebarAction: (show) => dispatch({ type: LAYOUT_ACTIONS.SHOW_RIGHT_SIDEBAR, payload: show }),
  }

  return <LayoutContext.Provider value={{ ...state, ...actions }}>{children}</LayoutContext.Provider>
}

// Hook to use layout context
export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
