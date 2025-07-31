import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

import ServiceTitleCard from "./components/ServiceTitleCard";
// Ganti nama import agar lebih jelas dan sesuai dengan fungsinya (menampilkan tabel)
import ServiceTableCard from "./components/ServiceContentCard"; 
import { serviceAPI } from "../../services/api"; 

const componentMap = {
  "Title": ServiceTitleCard,
  "Table": ServiceTableCard, // Gunakan nama yang lebih deskriptif
};

const dropdownOptions = ["Title", "Table"];

const ServiceSection = () => {
  const [contents, setContents] = useState(() => {
    const saved = localStorage.getItem("service_contents");
    return saved ? JSON.parse(saved) : [];
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await serviceAPI.getAll();
        if (data.results) {
          setServicesData(data.results);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    localStorage.setItem("service_contents", JSON.stringify(contents));
  }, [contents]);

  const handleAddContent = (type) => {
    const id = Date.now() + Math.random();
    let newContent = { id, type };

    if (type === "Table") {
      const tableCount = contents.filter(c => c.type === "Table").length;
      newContent.title = `Content ${tableCount + 1}`;
      newContent.description = "Masukkan data layanan pada tabel di bawah.";
      newContent.rows = []; // Mulai dengan baris kosong
    }
    
    setContents(prev => [...prev, newContent]);
    setShowDropdown(false);
  };

  const handleRemoveContent = (id) => {
    setContents((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 pl-3 mb-4">
        <h2 className="text-lg font-bold text-[var(--color-button-blue)] dark:text-white tracking-wide">SERVICE</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowDropdown(!showDropdown)} title="Tambah Konten" className="text-[var(--color-button-blue)] dark:text-white"><PlusIcon className="w-5 h-5" /></button>
          <button onClick={() => setIsExpanded(!isExpanded)} title="Sembunyikan / Tampilkan" className="text-[var(--color-button-blue)] dark:text-white">
            {isExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {showDropdown && (
        <div className="mb-4 bg-white dark:bg-[var(--color-sidebar)] border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-fit shadow-md">
          {dropdownOptions.map((option) => (
            <button key={option} onClick={() => handleAddContent(option)} className="block w-full text-left text-sm text-[var(--color-sidebar)] dark:text-white py-1 px-3">
              + {option}
            </button>
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4">
          {/* Display API data if available */}
          {servicesData.length > 0 && (
            <div className="mb-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-3">
                Services from Backend API:
              </h3>
              <div className="space-y-2">
                {servicesData.map((service) => (
                  <div key={service.id} className="border-l-4 border-green-400 pl-3">
                    <h4 className="font-medium text-green-700 dark:text-green-300">{service.title}</h4>
                    {service.description && (
                      <p className="text-green-600 dark:text-green-400 text-sm">{service.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {loading && (
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 text-center">
              <p className="text-yellow-800 dark:text-yellow-200">Loading services from backend...</p>
            </div>
          )}

          {contents.length > 0 ? (
            contents.map((content) => {
              const Component = componentMap[content.type];
              if (!Component) return null;

              return (
                <Component
                  key={content.id}
                  id={content.id}
                  onRemove={handleRemoveContent}
                  // ✨ BAGIAN PENTING: Pastikan semua props ini diteruskan!
                  title={content.title}
                  description={content.description}
                  rows={content.rows}
                  onChangeRows={(updatedRows) => {
                    setContents(prevContents =>
                      prevContents.map(card =>
                        card.id === content.id ? { ...card, rows: updatedRows } : card
                      )
                    );
                  }}
                />
              );
            })
          ) : servicesData.length === 0 && !loading ? (
            <div className="bg-white dark:bg-[var(--color-card-secondary)] border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-sm text-center text-gray-500">
              Belum ada layanan ditambahkan. Klik ikon '+' untuk memulai.
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
};

export default ServiceSection;