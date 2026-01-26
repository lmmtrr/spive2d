import React from "react";
import Dialog from "./Dialog";
import Sidebar from "./Sidebar";
import Progress from "./Progress";
import Spinner from "./Spinner";

const App: React.FC = () => {
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
