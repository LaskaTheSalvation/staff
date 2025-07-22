import React from "react";

// Komponen untuk bagian footer kartu yang berisi tombol aksi.
// Dengan memisahkannya, kita tidak perlu mengulang-ulang kode tombol ini.
const CardActionFooter = () => (
  <div className="flex space-x-2 mt-4">
    <button className="btn-primary">Simpan</button>
    <button className="btn-danger">Hapus</button>
  </div>
);

// Komponen kartu utama yang lebih generik.
// Saya mengganti nama dari CardPlaceholder menjadi ContentCard.
const ContentCard = ({ title, description, bgColor = "bg-white", children }) => (
  <div className={`relative w-full card-base overflow-hidden mb-6 ${bgColor}`}>
    {/* Garis aksen kiri kartu: primary-accent (FCA311) */}
    <div className="absolute w-[13px] h-full top-0 left-0 bg-primary-accent"></div>
    {/* Teks di dalam kartu: text-on-light-bg (14213D) */}
    <div className="p-4 pl-8 text-text-on-light-bg">
      <h3 className="text-lg font-heading font-bold text-text-on-light-bg mb-1">{title}</h3>
      {description && <p className="text-subtle-dark text-text-on-light-bg mb-4">{description}</p>}
      {children}
    </div>
  </div>
);

// Komponen untuk me-render konten di dalam kartu berdasarkan tipenya.
const CardContent = ({ type, placeholder, initialValue }) => {
  switch (type) {
    case 'file':
      return (
        <>
          <div className="flex justify-between items-center text-sm font-body font-semibold text-text-on-light-bg mb-2">
            <span>File Name: {initialValue}</span>
            <div className="flex space-x-2">
              <button className="btn-primary">Pilih File</button>
              <button className="btn-danger">Hapus</button>
            </div>
          </div>
          <CardActionFooter />
        </>
      );
    case 'textarea':
      return (
        <>
          <textarea className="w-full p-2 input-field-light-bg mb-2" rows="2" placeholder={placeholder}></textarea>
          <CardActionFooter />
        </>
      );
    case 'text-input':
      return (
        <>
          <input type="text" placeholder={placeholder} className="w-full p-2 input-field-light-bg mb-2" />
          <CardActionFooter />
        </>
      );
    default:
      return null;
  }
};

// Konfigurasi data untuk semua kartu.
// Jika ingin menambah/mengubah kartu, cukup edit array ini.
const contentConfig = [
  {
    section: 'BANNER CONTENT',
    cards: [
      { id: 'banner', title: 'Banner', description: 'lorem ipsum wkwkwkkwkw', bgColor: 'bg-white', contentType: 'file', initialValue: 'file.jpg' },
      { id: 'title', title: 'Title', description: 'lorem ipsum wkwkwkkwkw', bgColor: 'bg-card-secondary-bg', contentType: 'textarea', placeholder: 'Title content...' },
      { id: 'text', title: 'Text', description: 'lorem ipsum wkwkwkkwkw', bgColor: 'bg-card-secondary-bg', contentType: 'textarea', placeholder: 'Text content...' },
      { id: 'button-link', title: 'Button Link', description: 'lorem ipsum wkwkwkkwkw', bgColor: 'bg-white', contentType: 'text-input', placeholder: 'https://yourlink.com' }
    ]
  },
  {
    section: 'SERVICE',
    cards: [
      { id: 'service-item', title: 'Service Item', description: 'lorem ipsum wkwkwkkwkw', bgColor: 'bg-card-secondary-bg', contentType: 'textarea', placeholder: 'Service content...' }
    ]
  }
];

// Komponen utama yang sekarang jauh lebih ringkas.
export const ContentPlaceholder = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 text-text-on-light-bg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading text-text-on-light-bg">WELCOME....</h2>
      </div>

      {contentConfig.map(({ section, cards }) => (
        <section key={section} className="mb-2">
          <h2 className="text-xl font-heading font-bold text-text-on-light-bg mb-4 mt-8">{section}</h2>
          {cards.map(card => (
            <ContentCard key={card.id} title={card.title} description={card.description} bgColor={card.bgColor}>
              <CardContent type={card.contentType} placeholder={card.placeholder} initialValue={card.initialValue} />
            </ContentCard>
          ))}
        </section>
      ))}
    </div>
  );
};