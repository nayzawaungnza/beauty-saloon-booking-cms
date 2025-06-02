import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

// Language configuration
const languages = {
  en: {
    label: "English",
    flag: "../src/assets/images/flags/us.jpg",
  },
  es: {
    label: "Spanish",
    flag: "../src/assets/images/flags/spain.jpg",
  },
  de: {
    label: "German",
    flag: "../src/assets/images/flags/germany.jpg",
  },
  it: {
    label: "Italian",
    flag: "../src/assets/images/flags/italy.jpg",
  },
  ru: {
    label: "Russian",
    flag: "../src/assets/images/flags/russia.jpg",
  },
};

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState("en");
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || "en";
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguageAction = (lang) => {
    // Set language in localStorage
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
    
    // You can implement actual language switching logic here
    // For example, using react-i18next or sending to server
    console.log("Language changed to:", lang);
  };

  const toggle = () => {
    setMenu(!menu);
  };

  return (
    <>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle className="btn header-item" tag="button">
          <img
            src={languages[selectedLang]?.flag || "/placeholder.svg"}
            alt="Language"
            height="16"
            className="me-1"
          />
        </DropdownToggle>
        <DropdownMenu className="language-switch dropdown-menu-end">
          {Object.keys(languages).map((key) => (
            <DropdownItem
              key={key}
              onClick={() => changeLanguageAction(key)}
              className={`notify-item ${selectedLang === key ? "active" : ""}`}
            >
              <img
                src={languages[key].flag || "/placeholder.svg"}
                alt={languages[key].label}
                className="me-1"
                height="12"
              />
              <span className="align-middle">{languages[key].label}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default LanguageDropdown;