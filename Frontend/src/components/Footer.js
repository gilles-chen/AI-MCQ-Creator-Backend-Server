import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left">
            {/* <h3 className="text-lg font-semibold">AI MCQ Builder</h3>
            <p className="mt-2">By Gilles Chen</p> */}
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <ul className="flex justify-center md:justify-end">
              {/* <li className="mx-4"><a href="#" className="hover:text-blue-400">Home</a></li>
              <li className="mx-4"><a href="#" className="hover:text-blue-400">About</a></li>
              <li className="mx-4"><a href="#" className="hover:text-blue-400">Contact</a></li> */}
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; AI MCQ Builder by Gilles Chen.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;