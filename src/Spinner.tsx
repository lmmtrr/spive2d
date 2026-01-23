import { useAtom } from "jotai";
import React from "react";
import { spinnerStateAtom } from "./store";

const Spinner: React.FC = () => {
  const [visible] = useAtom(spinnerStateAtom);

  return (
    <div id="spinner" style={{ display: visible ? "block" : "none" }}></div>
  );
};

export default Spinner;
