import React from "react";
import Layout from "../../Components/Layout";  // ✅ Using Layout instead of manual sidebar
import StepProgress from "../../Components/StepProgress";

const InstitutionProfile = () => {
  return (
    <Layout showNavbar={false}>

    
       <StepProgress currentStep={1} />

      

      {/* MAIN FORM CARD */}
      <form className="bg-white shadow-xl rounded-2xl p-10 space-y-10 border border-gray-200">

        {/* ---------------- BASIC INFO SECTION ---------------- */}
        <h2 className="text-2xl font-semibold text-[#5A189A] pb-3 border-b-2 border-gray-200">
          Basic Information
        </h2>

        {/* Institution Name */}
        <div>
          <label className="block font-semibold text-gray-700">Institution Name *</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A] focus:outline-none"
            placeholder="Enter institution name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-gray-700">Email *</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A] focus:outline-none"
            placeholder="Enter official email"
          />
        </div>

        {/* Grid: Code – Establishment – Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">Institution Code *</label>
            <input
              type="text"
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]"
              placeholder="INSTXXXX"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Establishment Year *</label>
            <input
              type="number"
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]"
              placeholder="YYYY"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Institution Type *</label>
            <select className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]">
              <option>Select type</option>
              <option>Private</option>
              <option>Public</option>
              <option>Deemed</option>
              <option>Government</option>
            </select>
          </div>
        </div>

        {/* ---------------- LOCATION SECTION ---------------- */}
        <h2 className="text-2xl font-semibold text-[#5A189A] pb-3 border-b-2 border-gray-200">
          Location Details
        </h2>

        {/* Address */}
        <div>
          <label className="block font-semibold text-gray-700">Full Address *</label>
          <textarea
            className="w-full border p-3 rounded-lg mt-1 h-28 focus:ring-2 focus:ring-[#5A189A]"
            placeholder="Enter complete address"
          ></textarea>
        </div>

        {/* Grid: City – District – State – Pincode */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">City *</label>
            <input className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]" placeholder="City" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">District *</label>
            <input className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]" placeholder="District" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">State *</label>
            <input className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]" placeholder="State" />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Pincode *</label>
            <input className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]" placeholder="Pincode" />
          </div>
        </div>

        {/* ---------------- ACCREDITATION SECTION ---------------- */}
        <h2 className="text-2xl font-semibold text-[#5A189A] pb-3 border-b-2 border-gray-200">
          Accreditation Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold text-gray-700">NAAC Grade</label>
            <select className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]">
              <option>Select grade</option>
              <option>A++</option>
              <option>A+</option>
              <option>A</option>
              <option>B++</option>
              <option>B+</option>
              <option>B</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">NIRF Rank</label>
            <input
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]"
              placeholder="Enter NIRF Rank"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">AISHE Code</label>
            <input
              className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]"
              placeholder="Enter AISHE Code"
            />
          </div>
        </div>

        {/* UDISE Code */}
        <div>
          <label className="block font-semibold text-gray-700">UDISE Code</label>
          <input
            className="w-full border p-3 rounded-lg mt-1 focus:ring-2 focus:ring-[#5A189A]"
            placeholder="Enter UDISE Code"
          />
        </div>

        {/* ---------------- COURSES SECTION ---------------- */}
        <h2 className="text-2xl font-semibold text-[#5A189A] pb-3 border-b-2 border-gray-200">
          Courses Offered
        </h2>

       <div className="relative mt-1">
  <select
    multiple
    size={1}   // makes it look like dropdown until opened
    className="w-full border p-3 rounded-lg bg-white pr-10 focus:ring-2 focus:ring-[#5A189A]"
  >
    <option>B.Tech</option>
    <option>M.Tech</option>
    <option>BCA</option>
    <option>MBA</option>
    <option>BBA</option>
    <option>Pharmacy</option>
    <option>Polytechnic</option>
  </select>

  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
    ▼
  </span>
</div>

        {/* ---------------- SAVE BUTTON ---------------- */}
        <div className="pt-5">
          <button
            className="bg-[#0A3D62] hover:bg-[#062A45] text-white px-10 py-3 rounded-lg font-semibold shadow-md transition"
            type="submit"
          >
            Save Changes
          </button>
        </div>

      </form>

    </Layout>
  );
};

export default InstitutionProfile;
