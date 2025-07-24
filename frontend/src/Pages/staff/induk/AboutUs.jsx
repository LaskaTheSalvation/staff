// src/Pages/staff/induk/AboutUs.jsx
import AboutUsSection from "../../../components/AboutUs/BannerSection";
import BannerSection from "../../../components/AboutUs/AboutUsSection";
import VisiMisiSection from "../../../components/AboutUs/VisiMisiSection";
import DirectorCommissionerSection from "../../../components/AboutUs/DirectorCommissionerSection";

export default function AboutUs() {
  return (
    <main>
      <AboutUsSection />
      <BannerSection />
      <VisiMisiSection />
      <DirectorCommissionerSection />
      {/* Tambahkan komponen lain yang diperlukan di sini */}
    </main>
  );
}
