import React from "react";
import "./pricing.scss";
import Footer from "../../components/footer/Footer";

const Pricing = () => {
  return (
    <div className="pricing-page">
      <h2>Pricing</h2>
      <div className="plans">
        <div className="plan">
          <h3>Free</h3>
          <p>Basic goal tracking</p>
          <p>0€ / month</p>
        </div>
        <div className="plan premium">
          <h3>Pro</h3>
          <p>All features unlocked</p>
          <p>5€ / month</p>
        </div>
      </div>
    
    </div>
  );
};

export default Pricing;
