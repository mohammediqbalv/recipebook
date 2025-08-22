import React from 'react';

const HelpCenter = () => (
  <div className="container mt-5 p-4 bg-light rounded shadow">
    <h2 className="mb-3">Help Center</h2>
    <p>
      Need assistance? The <strong>Recipe Book Help Center</strong> is here to support you!
    </p>
    <ul>
      <li><strong>Account Issues:</strong> Trouble logging in or registering? Make sure your credentials are correct or reset your password.</li>
      <li><strong>Posting Recipes:</strong> Click the "Add Post" button to share your favorite recipes with the community.</li>
      <li><strong>Editing/Deleting:</strong> You can edit or delete your own recipes from your profile page.</li>
      <li><strong>Community Guidelines:</strong> Please keep your posts respectful and relevant to cooking.</li>
      <li><strong>Contact Us:</strong> For further help, reach out via the contact form in the footer.</li>
    </ul>
    <p>
      We’re here to help you make the most of your Recipe Book experience!
    </p>
    <p className="text-muted" style={{fontSize: '12px'}}>Version 1.0.0 &copy; 2023 Recipe Book</p>
  </div>
);

export default HelpCenter;
