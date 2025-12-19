import React from "react";
import "./ReferPage.css";

export default function ReferPage() {
  return (
    <main className="refer-page">
      <section className="refer-hero">
        <div className="refer-left">
          <video className="refer-video" controls preload="metadata">
            <source src="/data/menus/videoframe_1281.mp4" type="video/mp4" />
            {/* Fallback content for browsers that don't support <video> */}
            Your browser does not support the video tag. You can <a href="/data/menus/videoframe_1281.mp4">download the video</a> instead.
          </video>
        </div>
        <div className="refer-right">
          <div className="refer-teal-panel">
            <div className="refer-code-card">
              <h2>Generate Unique Referral Code</h2>
              <p>To start referring, place your 1st order & get your referral code. Share it & earn 500 per referral.</p>
              <button className="refer-cta" onClick={() => {}}>
                ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="refer-features">
        <div className="features-container">
          <button className="scroll-arrow left-arrow" onClick={() => {}}>
            &#8249;
          </button>
          <div className="features-grid">
            <div className="feature-item">
              <img src="https://assets.box8.co.in/horizontal-rectangle/web/banner/1227" alt="Feature 1" className="feature-icon" />
            </div>
            <div className="feature-item">
              <img src="https://assets.box8.co.in/horizontal-rectangle/web/banner/1217" alt="Feature 2" className="feature-icon" />
            </div>
            <div className="feature-item">
              <img src="https://assets.box8.co.in/horizontal-rectangle/web/banner/1228" alt="Feature 3" className="feature-icon" />
            </div>
          </div>
          <button className="scroll-arrow right-arrow" onClick={() => {}}>
            &#8250;
          </button>
        </div>
      </section>

      <section className="refer-steps">
        <h2>HOW TO EARN ₹500 PER FRIEND</h2>
        <div className="steps-grid">
          <div className="step-card">
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/comic_img_1.svg" alt="Step 1" className="step-icon" />
            <div className="step-label">STEP 1</div>
            <h3 className="step-title">Place Your First Order</h3>
            <p className="step-desc">Order your favorite meal to get your unique referral code</p>
          </div>
          <div className="step-card">
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/comic_img_2.svg" alt="Step 2" className="step-icon" />
            <div className="step-label">STEP 2</div>
            <h3 className="step-title">Share Your Code</h3>
            <p className="step-desc">Share your referral code with friends and family</p>
          </div>
          <div className="step-card">
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/comic_img_3.svg" alt="Step 3" className="step-icon" />
            <div className="step-label">STEP 3</div>
            <h3 className="step-title">Friend Orders</h3>
            <p className="step-desc">Your friend places their first order using your code</p>
          </div>
          <div className="step-card">
            <img src="https://d203x0tuwp1vfo.cloudfront.net/20251121092634/assets/images/comic_img_4.svg" alt="Step 4" className="step-icon" />
            <div className="step-label">STEP 4</div>
            <h3 className="step-title">Earn Rewards</h3>
            <p className="step-desc">Get ₹500 credited to your account for each referral</p>
          </div>
        </div>
      </section>
    </main>
  );
}
