import React, { useEffect } from "react";

const MainLayout: React.FC = (props: any) => {
  const { children } = props;
  return (
    <div>
      {children}
    </div>
  )
}

export default MainLayout;
