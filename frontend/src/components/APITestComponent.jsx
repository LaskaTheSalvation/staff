import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const APITestComponent = () => {
  const [bannerData, setBannerData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Test banner API
        const banners = await apiClient.getBannerContent();
        setBannerData(banners);

        // Test service API
        const services = await apiClient.getServiceContent();
        setServiceData(services);

      } catch (err) {
        setError(err.message);
        console.error('API test failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading API data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">API Connection Error</h3>
        <p className="text-red-600 mt-1">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Make sure the Django backend is running on http://127.0.0.1:8000
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-semibold mb-2">✅ API Connection Successful!</h3>
        <p className="text-green-700">Backend API is responding correctly.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Banner Data */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Banner Content</h3>
          <div className="space-y-2">
            {bannerData.map((item) => (
              <div key={item.id} className="border rounded p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500">Order: {item.order}</span>
                </div>
                {item.title && (
                  <h4 className="font-medium mt-2 text-gray-800">{item.title}</h4>
                )}
                {item.text && (
                  <p className="text-sm text-gray-600 mt-1">{item.text}</p>
                )}
                {item.button_text && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">Button: </span>
                    <span className="text-sm font-medium">{item.button_text}</span>
                    {item.button_url && (
                      <span className="text-xs text-blue-600 ml-1">→ {item.button_url}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Data */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Service Content</h3>
          <div className="space-y-2">
            {serviceData.map((item) => (
              <div key={item.id} className="border rounded p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                    {item.type}
                  </span>
                  <span className="text-xs text-gray-500">Order: {item.order}</span>
                </div>
                {item.title && (
                  <h4 className="font-medium mt-2 text-gray-800">{item.title}</h4>
                )}
                {item.content && (
                  <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                )}
                {item.table_rows && item.table_rows.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 block mb-1">Table Rows:</span>
                    {item.table_rows.map((row) => (
                      <div key={row.id} className="text-xs bg-white rounded p-2 mb-1">
                        <strong>{row.title}</strong> - {row.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        <p>This component demonstrates successful API integration between React frontend and Django backend.</p>
      </div>
    </div>
  );
};

export default APITestComponent;