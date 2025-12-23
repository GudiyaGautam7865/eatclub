import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import PageContainer from "../components/layout/layout-utils/PageContainer";
import Toast from "../components/common/Toast";

function MainLayout() {
  const [authToast, setAuthToast] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminAuthError');
      if (raw) {
        const parsed = JSON.parse(raw);
        setAuthToast(parsed?.message || 'Authorization error');
        localStorage.removeItem('adminAuthError');
      }
    } catch {}
  }, []);

  return (
    <div className="app-root">
      <Header />
      <main>
        {authToast && (
          <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }}>
            <Toast
              message={authToast}
              type="warning"
              duration={4000}
              onClose={() => setAuthToast(null)}
            />
          </div>
        )}
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
