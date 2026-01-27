import React from "react";
import Dialog from "./Dialog";
import Sidebar from "./Sidebar";
import Progress from "./Progress";
import Spinner from "./Spinner";
import { ToastContainer, Zoom } from "react-toastify";

const App: React.FC = () => {
  return (
    <>
      <Spinner />
      <Progress />
      <Sidebar />
      <Dialog />
      <ToastContainer
        autoClose={false}
        transition={Zoom}
        limit={3}
        position="bottom-right"
        draggable
      />
    </>
  );
};

export default App;
