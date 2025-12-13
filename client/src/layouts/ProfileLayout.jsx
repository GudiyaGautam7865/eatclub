import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import ProfileSidebar from "../components/layout/ProfileSidebar/ProfileSidebar";
import PageContainer from "../components/layout/layout-utils/PageContainer";
import "./ProfileLayout.css"; // optional if you want separate styling

function ProfileLayout() {
  return (
    <div className="app-root">
      <Header />
      <main>
        <PageContainer>
          <div className="profile-layout">
            <ProfileSidebar />
            <div className="profile-content">
              <Outlet />
            </div>
          </div>
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}

export default ProfileLayout;
