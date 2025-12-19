import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import AdminLayout from "../layouts/AdminLayout";
import DeliveryLayout from "../components/delivery/DeliveryLayout";

// Pages
import React from "react"; // or: import * as React from "react";
import HomePage from "../pages/Home/HomePage";
import MembershipPage from "../pages/Membership/MembershipPage";
import ReferPage from "../pages/Refer/ReferPage";
import CartPage from "../pages/Cart/CartPage";
import OffersPage from "../pages/Offers/OffersPage";
import PartyOrderPage from "../pages/PartyOrder/PartyOrderPage";
import MenuPage from "../pages/Menu/MenuPage";
import FoodDetailPage from "../pages/Food/FoodDetailPage";
import ManageOrdersPage from "../pages/ManageOrders/ManageOrdersPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import CreditsPage from "../pages/Profile/CreditsPage";
import PaymentsPage from "../pages/Profile/PaymentsPage";
import AddressesPage from "../pages/Profile/AddressesPage";
import PromotionSubscriptionsPage from "../pages/Profile/PromotionSubscriptionsPage";
import FaqPage from "../pages/Profile/FaqPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";


// Admin Pages
import AdminProfilePage from "../pages/Admin/Profile/AdminProfilePage";
import AdminDashboardPage from "../pages/Admin/Dashboard/AdminDashboardPage";
import AddMenuItemPage from "../pages/Admin/Menu/AddMenuItemPage";
import MenuItemsListPage from "../pages/Admin/Menu/MenuItemsListPage";
import SingleOrdersPage from "../pages/Admin/Orders/SingleOrdersPage";
import BulkOrdersPage from "../pages/Admin/Orders/BulkOrdersPage";
import OrdersPage from "../pages/Admin/OrdersPage";
import OrderDetailsPage from "../pages/Admin/OrderDetailsPage";
import MenuDetailPage from "../pages/Admin/MenuDetailPage";
import ReviewsPage from "../pages/Admin/Reviews/ReviewsPage";
import DeliveryBoyListPage from "../pages/Admin/DeliveryBoys/DeliveryBoyListPage";
import DeliveryBoyDetailsPage from "../pages/Admin/DeliveryBoys/DeliveryBoyDetailsPage";
import MessagesPage from "../pages/Admin/Messages/MessagesPage";
import CustomerDetailPage from "../pages/Admin/CustomerDetail/CustomerDetailPage";

// Admin Protected Route
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";

// Delivery Pages
import DeliveryDashboard from "../pages/Delivery/DeliveryDashboard";
import DeliveryOrders from "../pages/Delivery/DeliveryOrders";
import OrderDetails from "../pages/Delivery/OrderDetails";
import DeliveryEarnings from "../pages/Delivery/DeliveryEarnings";
import DeliveryProfile from "../pages/Delivery/DeliveryProfile";


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
        <Route path="/food/:foodId" element={<FoodDetailPage />} />
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

      {/* Admin layout routes */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="profile" element={<AdminProfilePage />} />

        <Route path="menu">
          <Route path="add" element={<AddMenuItemPage />} />
          <Route path="list" element={<MenuItemsListPage />} />
          <Route path=":menuItemId" element={<MenuDetailPage />} />
        </Route>

        <Route path="orders">
          <Route index element={<OrdersPage />} />
          <Route path=":orderId" element={<OrderDetailsPage />} />
          <Route path="single" element={<SingleOrdersPage />} />
          <Route path="bulk" element={<BulkOrdersPage />} />
        </Route>

        <Route path="reviews" element={<ReviewsPage />} />

        <Route path="delivery-boys">
          <Route index element={<DeliveryBoyListPage />} />
          <Route path=":id" element={<DeliveryBoyDetailsPage />} />
        </Route>

        <Route path="messages" element={<MessagesPage />} />
        <Route path="customer-detail" element={<CustomerDetailPage />} />
      </Route>

      {/* Delivery layout routes */}
      <Route path="/delivery" element={<DeliveryLayout />}>
        <Route index element={<DeliveryDashboard />} />
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="orders/:orderId" element={<OrderDetails />} />
        <Route path="earnings" element={<DeliveryEarnings />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;

