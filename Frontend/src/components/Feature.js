import React from 'react';

function Feature({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <i className={`fas ${icon} text-4xl text-blue-500 mb-4`}></i>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Feature;