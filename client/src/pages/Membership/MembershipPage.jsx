import React from "react";
import WhyEatClubSection from "../../components/membership/WhyEatClubSection";
import MembershipPlans from "../../components/membership/MembershipPlans";
import BrandsOnBoard from "../../components/membership/BrandsOnBoard";
import "./MembershipPage.css";

export default function MembershipPage() {
  return (
    <div className="membership-page">
      <WhyEatClubSection />
      <MembershipPlans />
      <BrandsOnBoard />
    </div>
  );
}