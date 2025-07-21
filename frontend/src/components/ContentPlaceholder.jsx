import React from "react";

const CardPlaceholder = ({ title, description, bgColor = "bg-white", children }) => (
  // Base untuk kartu konten: card-base (shadow-elevated, rounded-default, p-6)
  // Background kartu: bisa putih murni atau card-secondary-bg (EEF6FF)
  <div className={`relative w-full card-base overflow-hidden mb-6 ${bgColor}`}>
    {/* Garis aksen kiri kartu: primary-accent (FCA311) */}
    <div className="absolute w-[13px] h-full top-0 left-0 bg-primary-accent"></div>
    {/* Teks di dalam kartu: text-on-light-bg (14213D) */}
    <div className="p-4 pl-8 text-text-on-light-bg">
      <h3 className="text-lg font-heading font-bold text-text-on-light-bg mb-1">{title}</h3>
      <p className="text-subtle-dark text-text-on-light-bg mb-4">{description}</p>
      {children}
    </div>
  </div>
);

export const ContentPlaceholder = () => {
  return (
    // Teks default untuk area konten ini: text-on-light-bg (14213D)
    <div className="w-full max-w-4xl mx-auto py-8 text-text-on-light-bg">
      {/* Header Welcome */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading text-text-on-light-bg">WELCOME....</h2>
      </div>

      {/* BANNER CONTENT Section */}
      <h2 className="text-xl font-heading font-bold text-text-on-light-bg mb-4">BANNER CONTENT</h2>
      {/* Card Banner: bg-white */}
      <CardPlaceholder title="Banner" description="lorem ipsum wkwkwkkwkw" bgColor="bg-white">
        <div className="flex justify-between items-center text-sm font-body font-semibold text-text-on-light-bg mb-2">
            <span>File Name: file.jpg</span>
            <div className="flex space-x-2">
                {/* Tombol "Pilih File": btn-primary (menggunakan dark-button-color) */}
                <button className="btn-primary">Pilih File</button>
                {/* Tombol "Hapus": btn-danger (menggunakan button-delete) */}
                <button className="btn-danger">Hapus</button>
            </div>
        </div>
        <div className="flex space-x-2">
            <button className="btn-primary">simpan</button>
            <button className="btn-danger">hapus</button>
        </div>
      </CardPlaceholder>

      {/* Card Title: bg-card-secondary-bg (EEF6FF) */}
      <CardPlaceholder title="Title" description="lorem ipsum wkwkwkkwkw" bgColor="bg-card-secondary-bg">
        {/* Input field: input-field-light-bg (background putih, teks text-on-light-bg) */}
        <textarea className="w-full p-2 input-field-light-bg mb-2" rows="2" placeholder="Title content..."></textarea>
        <div className="flex space-x-2">
            <button className="btn-primary">simpan</button>
            <button className="btn-danger">hapus</button>
        </div>
      </CardPlaceholder>

      {/* Card Text: bg-card-secondary-bg (EEF6FF) */}
      <CardPlaceholder title="Text" description="lorem ipsum wkwkwkkwkw" bgColor="bg-card-secondary-bg">
        <textarea className="w-full p-2 input-field-light-bg mb-2" rows="2" placeholder="Text content..."></textarea>
        <div className="flex space-x-2">
            <button className="btn-primary">simpan</button>
            <button className="btn-danger">hapus</button>
        </div>
      </CardPlaceholder>

      {/* Card Button Link: bg-white */}
      <CardPlaceholder title="Button Link" description="lorem ipsum wkwkwkkwkw" bgColor="bg-white">
        <input type="text" placeholder="https://yourlink.com" className="w-full p-2 input-field-light-bg mb-2" />
        <div className="flex space-x-2">
            <button className="btn-primary">simpan</button>
            <button className="btn-danger">hapus</button>
        </div>
      </CardPlaceholder>

      {/* SERVICE Section */}
      <h2 className="text-xl font-heading font-bold text-text-on-light-bg mb-4 mt-8">SERVICE</h2>
      {/* Card Service: bg-card-secondary-bg (EEF6FF) */}
      <CardPlaceholder title="Service Item" description="lorem ipsum wkwkwkkwkw" bgColor="bg-card-secondary-bg">
        <textarea className="w-full p-2 input-field-light-bg mb-2" rows="2" placeholder="Service content..."></textarea>
        <div className="flex space-x-2">
            <button className="btn-primary">simpan</button>
            <button className="btn-danger">hapus</button>
        </div>
      </CardPlaceholder>

    </div>
  );
};