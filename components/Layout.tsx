import React, { ReactNode } from "react";
import NavBar from "./NavBar";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div>
    <NavBar />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
