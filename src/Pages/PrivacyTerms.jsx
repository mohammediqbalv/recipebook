import React from 'react';

const PrivacyTerms = () => (
  <div className="container mt-5 p-4 bg-light rounded shadow">
    <h2 className="mb-3">Privacy & Terms</h2>
    <p>
      <strong>Recipe Book</strong> values your privacy and is committed to protecting your personal information.
    </p>
    <ul>
      <li><strong>Data Collection:</strong> We only collect information necessary for account creation and recipe sharing.</li>
      <li><strong>Usage:</strong> Your data is used solely to enhance your experience and is never sold to third parties.</li>
      <li><strong>Cookies:</strong> We use cookies to keep you logged in and to personalize your experience.</li>
      <li><strong>Content:</strong> All recipes and comments must comply with our community guidelines.</li>
      <li><strong>Security:</strong> We implement industry-standard measures to protect your data.</li>
    </ul>
    <p>
      By using Recipe Book, you agree to our terms of service and privacy policy. For questions, contact us via the form in the footer.
    </p>
    <p className="text-muted" style={{fontSize: '12px'}}>Version 1.0.0 &copy; 2023 Recipe Book</p>
  </div>
);

export default PrivacyTerms;
