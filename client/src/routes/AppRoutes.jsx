import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProfileLayout from "../layouts/ProfileLayout";

// Pages
import React from "react"; // or: import * as React from "react";
import HomePage from "../pages/Home/HomePage";
import MembershipPage from "../pages/Membership/MembershipPage";
import ReferPage from "../pages/Refer/ReferPage";
import CartPage from "../pages/Cart/CartPage";
import OffersPage from "../pages/Offers/OffersPage";
import PartyOrderPage from "../pages/PartyOrder/PartyOrderPage";
import MenuPage from "../pages/Menu/MenuPage";
import ManageOrdersPage from "../pages/ManageOrders/ManageOrdersPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import CreditsPage from "../pages/Profile/CreditsPage";
import PaymentsPage from "../pages/Profile/PaymentsPage";
import AddressesPage from "../pages/Profile/AddressesPage";
import PromotionSubscriptionsPage from "../pages/Profile/PromotionSubscriptionsPage";
import FaqPage from "../pages/Profile/FaqPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/refer" element={<ReferPage />} />
        <Route path="/manage_orders" element={<ManageOrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/party_order" element={<PartyOrderPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Route>

      {/* Profile layout with nested routes */}
      <Route path="/profile" element={<ProfileLayout />}>
        <Route index element={<ProfilePage />} />
        <Route path="credits" element={<CreditsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route
          path="promotion_subscriptions"
          element={<PromotionSubscriptionsPage />}
        />
        <Route path="faq" element={<FaqPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

