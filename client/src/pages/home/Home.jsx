import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.scss";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-text">
          <h1>Welcome to STEPS</h1>
          <p>Your ultimate productivity companion to track daily, weekly, and monthly goals with visual progress and sticky notes.</p>
          <button onClick={() => navigate("/register")}>Get Started</button>
        </div>
      </header>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Daily, Weekly & Monthly Goals</h3>
            <p>Organize your life with clear task divisions and visual feedback.</p>
          </div>
          <div className="feature">
            <h3>Sticky Notes</h3>
            <p>Quickly jot down thoughts, reminders, or action items with sticky notes.</p>
          </div>
          <div className="feature">
            <h3>Floating Button</h3>
            <p>Access features quickly from anywhere in the app.</p>
          </div>
          <div className="feature">
            <h3>Progress Visualization</h3>
            <p>Stay motivated with dynamic progress bars and stats.</p>
          </div>
        </div>
      </section>

      <section className="video-section">
        <h2>See STEPS in Action</h2>
        <div className="video-wrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="STEPS Demo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <section className="app-showcase-section">
        <h2>Experience STEPS</h2>
        <div className="app-showcase">
          <div className="showcase-item">
            <h3>Daily Goals</h3>
            <img src="/assets/Daily%20Goal.png" alt="Daily Goals" className="showcase-image" />
            <p>Track your daily tasks and see your progress in real-time</p>
          </div>
          <div className="showcase-item">
            <h3>Weekly Goals</h3>
            <img src="/assets/Weekly%20Goal.png" alt="Weekly Goals" className="showcase-image" />
            <p>Plan your week ahead and monitor your achievements</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq">
          <h4>Is STEPS free to use?</h4>
          <p>Yes, STEPS offers a free plan with access to all core features. A Pro plan is available for advanced tools.</p>

          <h4>Can I use it on mobile?</h4>
          <p>Yes, STEPS is responsive and works on desktop, tablet, and mobile devices.</p>

          <h4>How are my tasks saved?</h4>
          <p>All tasks and progress are automatically saved and backed up.</p>

          <h4>Can I export my progress?</h4>
          <p>Exporting is available in the Pro plan.</p>
        </div>
      </section>

      {/* <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} STEPS. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default Home;