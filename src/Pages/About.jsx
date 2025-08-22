import React from 'react';

const About = () => (
  <div className="about-container">
    <h2 className="mb-3">About Recipe Book</h2>
    <section className="mb-4">
      <h4>Our Mission</h4>
      <p>
        Recipe Book is dedicated to bringing food lovers together by sharing and discovering amazing recipes from around the world. We aim to inspire creativity in the kitchen and foster a vibrant community of culinary enthusiasts.
      </p>
    </section>
    <section className="mb-4">
      <h4>Features</h4>
      <ul>
        <li>Share and discover recipes from around the world</li>
        <li>Organize your favorite dishes in one place</li>
        <li>Rate, comment, and connect with other food enthusiasts</li>
        <li>Easy-to-use interface for all skill levels</li>
        <li>Upload photos with your recipes</li>
        <li>Edit your profile and posts</li>
        <li>Search recipes by keyword or category</li>
      </ul>
    </section>
    <section className="mb-4">
      <h4>Meet the Developer</h4>
      <p>
        <strong>Iqbal</strong> – Full Stack Developer passionate about food and technology. Always eager to learn and build tools that make life tastier!
      </p>
    </section>
    <section className="mb-4">
      <h4>Tech Stack</h4>
      <p>React, Node.js, Express, MongoDB</p>
    </section>
    <section className="mb-4">
      <h4>Contact & Feedback</h4>
      <p>
        Have suggestions or found a bug? Email us at <a href="mailto:iqbalvazzhayil2468@gmail.com">iqbalvazzhayil2468@gmail.com</a>
      </p>
    </section>
    <section className="mb-4">
      <h4>Fun Fact</h4>
      <blockquote className="blockquote">
        "Cooking is at once child's play and adult joy. And cooking done with care is an act of love." – Craig Claiborne
      </blockquote>
    </section>
    <section className="mb-4">
      <h4>Acknowledgments</h4>
      <p>
        Special thanks to all contributors, open-source libraries, and our amazing user community for making Recipe Book possible!
      </p>
    </section>
    <p className="text-muted" style={{fontSize: '12px'}}>Version 1.0.0 &copy; 2023 Recipe Book</p>
  </div>
);

export default About;
