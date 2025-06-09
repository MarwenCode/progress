import React from "react";
import "./features.scss";

const Features = () => {
  const features = [
    {
      title: "Create Goals",
      description: "Create daily, weekly, and monthly goals to keep track of your progress."
    },
    {
      title: "Sticky Notes",
      description: "Use sticky notes to pin your thoughts and reminders."
    },
    {
      title: "Visual Progress",
      description: "Track your progress visually with dynamic charts and graphs."
    },
    {
      title: "Floating Button",
      description: "Quick access to features with a floating action button."
    },
    {
      title: "User Profile",
      description: "Manage your profile and settings easily."
    }
  ];

  return (
    <div className="features">
      <h2>Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
