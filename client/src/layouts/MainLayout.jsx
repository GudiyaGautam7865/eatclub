import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import PageContainer from "../components/layout/layout-utils/PageContainer";

function MainLayout() {
  return (
    <div className="app-root">
      <Header />
      <main>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
