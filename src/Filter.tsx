import React from "react";
import { useTranslation } from "react-i18next";

const Filter: React.FC<{
  onChange: (str: string) => void;
}> = ({ onChange }) => {
  const { t } = useTranslation();

  return (
    <input
      type="text"
      id="filterBox"
      placeholder={t("filter")}
      autoComplete="off"
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
};

export default Filter;
