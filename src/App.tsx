import React from "react";
import Dialog from "./Dialog";
import { setupEventListeners } from "./js/events";
import Sidebar from "./Sidebar";
import Progress from "./Progress";
import Spinner from "./Spinner";

const App: React.FC = () => {
  React.useEffect(() => {
    setupEventListeners();
  }, []);

  return (
    <>
      <Spinner />
      <Progress />
      <Sidebar />
      <Dialog />
    </>
  );
};

export default App;
