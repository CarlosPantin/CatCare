import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./landingpage.css";

const LandingPage = () => {
  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll(".animate-on-scroll");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.5 }
    );

    elementsToAnimate.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-buttons">
          <Link to="/login" className="header-btn">
            Login
          </Link>
          <Link to="/register" className="header-btn">
            Register
          </Link>
        </div>
      </header>

      <div className="landing-content animate-on-scroll">
        <div className="text-section">
          <h1>Welcome to CatCare</h1>
          <h2>Take Care of Your Cat in the Best Way</h2>
          <p>
            Join the CatCare community and manage your cat’s health and care
            routines easily!
          </p>

          <ul className="benefits-list">
            <li>🐾 Track your cat’s health & habits</li>
            <li>📅 Set reminders for feeding & vet visits</li>
            <li>🛠️ Access expert cat care tips</li>
            <li>📊 Monitor weight, diet, and activity</li>
          </ul>

          <Link to="/register" className="cta-btn">
            Get Started Now 🐱
          </Link>
        </div>

        <div className="image-section">
          <img src="/images/cat.jpg" alt="Cute Cat" className="cat-image" />
        </div>
      </div>

      <section className="features-section animate-on-scroll">
        <div className="feature-card">
          <h3>Track Health</h3>
          <p>Monitor your cat’s health metrics like weight, diet, and more!</p>
        </div>
        <div className="feature-card">
          <h3>Schedule Appointments</h3>
          <p>
            Keep track of vet visits and appointments for your feline friend.
          </p>
        </div>
        <div className="feature-card">
          <h3>Reminders & Alerts</h3>
          <p>Get timely reminders for feeding, medication, and more.</p>
        </div>
      </section>

      <section className="cta-section animate-on-scroll">
        <h2>Ready to Give Your Cat the Best Care?</h2>
        <p>
          Join CatCare today and make sure your cat is always well taken care
          of!
        </p>
        <Link to="/register" className="cta-btn">
          Sign Up Now
        </Link>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 CatCare. a Carlos Pantin Project </p>
      </footer>
    </div>
  );
};

export default LandingPage;
