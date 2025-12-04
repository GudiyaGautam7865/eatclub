import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="ec-footer" id="footer">
      {/* Download strip */}
      <div className="ec-footer-download">
        <div className="ec-footer-download-content">
          <div className="ec-download-text">
            <div className="ec-download-line">Download the app & get</div>
            <div className="ec-download-off">200 <span className="ec-off-unit">OFF</span></div>
            <div className="ec-download-sub">on first 3 app order</div>
          </div>

          <div className="ec-footer-download-code">
            <div className="ec-code-card">Use Code: <strong>FIRST3</strong></div>
          </div>

          <div className="ec-footer-download-qr">
            <div className="ec-qr-placeholder">QR</div>
          </div>
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
