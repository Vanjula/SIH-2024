import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../locales/i18n';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleCard1Click = () => {
    navigate('/video-page');
  };

  const handleCard2Click = () => {
    navigate('/another-page');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div
        className="relative bg-cover bg-center h-[500px]"
        style={{ backgroundImage: "url('src/assets/crop.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white">{t('welcome')}</h1>
          <p className="text-2xl text-white mt-4">{t('home_page_intro')}</p>
          <div className="mt-8">
            <button
              onClick={() => changeLanguage('en')}
              className="mx-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('ta')}
              className="mx-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              தமிழ்
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className="mx-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
          {/* What is Vishwas Section */}
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg">
          <img
            src="src/assets/crop1.jpg" // Replace with the path to your image
            alt="What is Vishwas"
            className="w-full md:w-1/2 rounded-t-lg md:rounded-l-lg object-cover"
            style={{ height: '300px' }}
          />
          <div className="p-6 w-full md:w-1/2">
            <h2 className="text-3xl font-semibold mb-4">What is Vishwas?</h2>
            <p className="text-lg text-gray-700 mb-4">
              Vishwas is a trusted platform that connects farmers and buyers, providing reliable services to ensure secure transactions, contract management, and collaboration opportunities. It empowers farmers to reach a wider market while giving buyers access to quality products directly from the source.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Building trust between farmers and buyers</li>
              <li>Ensuring fair and secure deals</li>
              <li>Providing a transparent platform for agricultural transactions</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Content Sections */}
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Farmers Section */}
          <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg">
            <img
              src="src/assets/crop1.jpg" // Replace with the path to your image
              alt="For Farmers"
              className="w-full md:w-1/2 rounded-t-lg md:rounded-l-lg object-cover"
              style={{ height: '300px' }}
            />
            <div className="p-6 w-full md:w-1/2">
              <h2 className="text-3xl font-semibold mb-4">{t('for_farmers')}</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>{t('connect_with_buyers')}</li>
                <li>{t('manage_contracts')}</li>
                <li>{t('secure_payments')}</li>
                <li>{t('collaborate')}</li>
              </ul>
            </div>
          </div>

          {/* For Buyers Section */}
          <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg">
            <img
              src="src/assets/crop2.jpg" // Replace with the path to your image
              alt="For Buyers"
              className="w-full md:w-1/2 rounded-t-lg md:rounded-l-lg object-cover"
              style={{ height: '300px' }}
            />
            <div className="p-6 w-full md:w-1/2">
              <h2 className="text-3xl font-semibold mb-4">{t('for_buyers')}</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>{t('find_reliable_farmers')}</li>
                <li>{t('purchase_products')}</li>
                <li>{t('secure_options')}</li>
                <li>{t('track_order')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

     

      {/* Central Section with Two Cards */}
      <div className="container mx-auto my-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className="p-8 bg-green-100 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-400 hover:scale-105 active:bg-green-300 hover:shadow-2xl cursor-pointer"
          style={{ height: '150px' }}
          onClick={handleCard1Click}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">{t('Demo Video')}</h2>
          <p className="text-center">{t('Click to navigate to a video page')}</p>
        </div>

        <div
          className="p-8 bg-green-100 rounded-lg shadow-lg transform transition-all duration-300 hover:bg-green-400 hover:scale-105 active:bg-green-300 hover:shadow-2xl cursor-pointer"
          style={{ height: '150px' }}
          onClick={handleCard2Click}
        >
          <h2 className="text-2xl font-semibold mb-4 text-center">{t('About')}</h2>
          <p className="text-center">{t('Click to navigate to another page')}</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">{t('footer_text')}</p>
          <Link
            to="/contact"
            className="block mt-4 text-green-500 hover:text-green-700"
          >
            {t('contact_us')}
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
