import React from "react";
import Header from "./_components/header";

const DashboardLayout = ({ children }: any) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default DashboardLayout;
