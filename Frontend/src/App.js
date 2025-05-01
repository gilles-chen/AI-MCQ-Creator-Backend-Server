import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Feature from './components/Feature';
import Footer from './components/Footer';
import FormPage from './components/FormPage';
import MCQResultsPage from './components/MCQResultsPage';

function HomePage() {
  const features = [
    { icon: "fa-magic", title: "AI-Powered", description: "Generate multiple choice questions quickly and effortlessly." },
    { icon: "fa-star", title: "High Quality", description: "Consistently create high quality MCQs, verified with SAQUET" },
    { icon: "fa-cogs", title: "Customizable", description: "Tailor questions to any field of study and different Bloom Taxonomy Levels" }
  ];

  return (
    <>
      <Header />
      {}
      <section className="py-16 bg-gray-100 flex-grow">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Feature key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/form" element={<FormPage />} />
          <Route path="/mcq-results" element={<MCQResultsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;