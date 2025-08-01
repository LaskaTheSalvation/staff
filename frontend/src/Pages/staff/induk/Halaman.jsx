import React from "react";
import SectionHomeHalaman from "../../../components/Halaman/SectionHomeHalaman";
import SectionAboutUsHalaman from "../../../components/Halaman/SectionAboutUsHalaman";
import SectionMediaHalaman from "../../../components/Halaman/SectionMediaHalaman";
import SectionServiceHalaman from "../../../components/Halaman/SectionServiceHalaman";
import SectionContactHalaman from "../../../components/Halaman/SectionContactHalaman";

const Halaman = () => {
  return (
    <div className="space-y-6">
      <SectionHomeHalaman />
      <SectionAboutUsHalaman />
      <SectionMediaHalaman />
      <SectionServiceHalaman />
      <SectionContactHalaman />
      {/* Tambahkan AboutUsSection, OurJourneySection, dst di sini */}
    </div>
  );
};

export default Halaman;
