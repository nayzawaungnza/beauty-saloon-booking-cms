import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { get, map } from "lodash";
import { useTranslation } from "react-i18next";
import { Inertia } from "@inertiajs/inertia";

// i18n
import i18n from "@/i18n";
import languages from "@/common/languages";

const LanguageDropdown = () => {
  const [selectedLang, setSelectedLang] = useState("");
  const [menu, setMenu] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const currentLanguage = localStorage.getItem("I18N_LANGUAGE") || i18n.language;
    setSelectedLang(currentLanguage);
  }, []);

  const changeLanguageAction = (lang) => {
    // Change language in i18n
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
    setSelectedLang(lang);
    
    // Notify Laravel backend about language change
    Inertia.post(route('language.change'), { locale: lang }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const toggle = () => {
    setMenu(!menu);
  };

  return (
    <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
      <DropdownToggle className="btn header-item" tag="button">
        <img
          src={get(languages, `${selectedLang}.flag`)}
          alt={t("Language")}
          height="16"
          className="me-1"
        />
        <span className="d-none d-sm-inline-block">{get(languages, `${selectedLang}.label`)}</span>
      </DropdownToggle>
      <DropdownMenu className="language-switch dropdown-menu-end">
        {map(Object.keys(languages), (key) => (
          <DropdownItem
            key={key}
            onClick={() => changeLanguageAction(key)}
            className={`notify-item ${selectedLang === key ? "active" : "none"}`}
          >
            <img
              src={get(languages, `${key}.flag`)}
              alt={get(languages, `${key}.label`)}
              className="me-1"
              height="12"
            />
            <span className="align-middle">
              {get(languages, `${key}.label`)}
            </span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageDropdown;