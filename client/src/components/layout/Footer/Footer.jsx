import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="ec-footer" id="footer">
      {/* Download Banner */}
      <div className="ec-footer-download">
        <div className="download-banner-container">
          <a href="https://eatclub.in/assets/images/eatclub-download-banner.webp" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://eatclub.in/assets/images/eatclub-download-banner.webp" 
              alt="EatClub Download Banner" 
              className="download-banner-image"
            />
          </a>
        </div>
      </div>

      {/* Main dark footer */}
      <div className="ec-footer-main">
        <div className="ec-container">
          <div className="ec-footer-columns">
            <div className="ec-footer-column">
              <h4 className="ec-footer-heading">EatClub</h4>
              <p>
                EatClub is a smarter way to order food — fast delivery, curated
                meals, and great value. We work with local kitchens to bring
                flavorful meals right to your door.
              </p>
              <p>
                Save with offers, get membership benefits, and enjoy a simpler
                ordering experience across cities.
              </p>
            </div>

            <div className="ec-footer-column">
              <h5 className="ec-footer-heading">COMPANY</h5>
              <ul>
                <li><a className="ec-footer-link" href="#">About Us</a></li>
              </ul>
            </div>

            <div className="ec-footer-column">
              <h5 className="ec-footer-heading">GET HELP</h5>
              <ul>
                <li><a className="ec-footer-link" href="#">Contact us</a></li>
                <li><a className="ec-footer-link" href="#">Help & Support</a></li>
                <li><a className="ec-footer-link" href="#">Delivery Policies</a></li>
                <li><a className="ec-footer-link" href="#">Privacy Policies</a></li>
                <li><a className="ec-footer-link" href="#">Disclaimers</a></li>
              </ul>
            </div>

            <div className="ec-footer-column">
              <h5 className="ec-footer-heading">EXPLORE</h5>
              <ul>
                <li><Link className="ec-footer-link" to="/offers">Offers</Link></li>
                <li><Link className="ec-footer-link" to="/party_order">Bulk Order</Link></li>
              </ul>
            </div>
          </div>

          <div className="ec-footer-bottom">© {new Date().getFullYear()} EatClub. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
