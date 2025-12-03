import React, { useState, useContext } from "react";
import StepProgress from "../../Components/StepProgress";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import AppContext from "../../Context/UseContext.jsx";

const InstitutionProfile = () => {
  const navigate = useNavigate();
  const { setCurrentInstitutionId, setCurrentInstitutionData } =
    useContext(AppContext);

  // ================= STATE ACCORDING TO YOUR SCHEMA =================
  const [institutionData, setInstitutionData] = useState({
    user_id: "",

    // basic details
    name: "",
    email: "",
    phone: "",
    type: "",
    established_year: "",
    institution_code: "",

    // location
    state: "",
    district: "",
    pincode: "",
    full_address: "",

    // accreditation
    NAAC_grade: "",
    NIRF_rank: "",
    AISHE_code: "",
    UDISE_code: "",

    // faculty and student details
    total_faculty: "",
    total_students: "",

    website: "",

    courses: [],

    parameters: [],
    documents: [],
    applications: [],
  });

  // ====================== HANDLE CHANGE =======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstitutionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseAdd = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setInstitutionData((prev) => ({
        ...prev,
        courses: [...prev.courses, value],
      }));
    } else {
      setInstitutionData((prev) => ({
        ...prev,
        courses: prev.courses.filter((course) => course !== value),
      }));
    }
  };

  // ====================== HANDLE SUBMIT =======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/institution/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(institutionData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Institution profile created successfully:", data);
        setCurrentInstitutionId(data.institution._id);
        localStorage.setItem("currentInstitutionId", data.institution._id);
        setCurrentInstitutionData(data.institution);
        localStorage.setItem(
          "currentInstitutionData",
          JSON.stringify(data.institution)
        );
        toast.success("Institution profile created successfully", {
          position: "top-center",
          autoClose: 1000,
          onClose: () =>
            navigate(`/institution/parameters/${data.institution._id}`),
        });
      } else {
        console.error("Failed to create institution profile");
      }
    } catch (err) {
      console.error("Error submitting institution profile:", err);
      toast.error(`Failed to create institution profile ${err.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setInstitutionData({
        // basic details
        name: "",
        email: "",
        type: "",
        established_year: "",
        institution_code: "",

        // location
        state: "",
        district: "",
        pincode: "",
        full_address: "",

        // accreditation
        NAAC_grade: "",
        NIRF_rank: "",
        AISHE_code: "",
        UDISE_code: "",

        website: "",

        courses: [],

        parameters: [],
        documents: [],
        applications: [],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-start gap-8">
      <StepProgress currentStep={1} />

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-8 border border-gray-200 flex-1"
      >
        {/* HEADER */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Institution Profile Registration
          </h1>
          <p className="text-gray-600 mt-2">
            Complete all required fields marked with asterisk (*)
          </p>
        </div>

        {/* ---------------- BASIC INFO ---------------- */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b">
            Basic Information
          </h2>

          <div>
            <label className="block font-medium mb-2">Institution Name *</label>
            <input
              type="text"
              name="name"
              value={institutionData.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Enter institution name"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Official Email *</label>
              <input
                type="email"
                name="email"
                value={institutionData.email}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Enter official email"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Phone *</label>
              <input
                type="text"
                name="phone"
                value={institutionData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Total Faculty</label>
              <input
                type="number"
                name="total_faculty"
                value={institutionData.total_faculty}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Number of faculty members"
                min="0"
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Total Students</label>
              <input
                type="number"
                name="total_students"
                value={institutionData.total_students}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Number of students"
                min="0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-2">
                Institution Code *
              </label>
              <input
                name="institution_code"
                value={institutionData.institution_code}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="INSTXXXX"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Establishment Year *
              </label>
              <input
                type="number"
                name="established_year"
                value={institutionData.established_year}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                min="1900"
                max="2024"
                placeholder="YYYY"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Institution Type *
              </label>
              <select
                name="type"
                value={institutionData.type}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">Select type</option>
                <option value="aicte">AICTE</option>
                <option value="ugc">UGC</option>
              </select>
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block font-medium mb-2">Official Website</label>
            <input
              type="text"
              name="website"
              value={institutionData.website}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="www.example.com"
            />
          </div>
        </section>

        {/* ---------------- LOCATION ---------------- */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">
            Location Details
          </h2>

          <div>
            <label className="block font-medium mb-2">Full Address *</label>
            <textarea
              name="full_address"
              value={institutionData.full_address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg h-28"
              placeholder="Complete address"
              required
            ></textarea>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-2">State *</label>
              <input
                name="state"
                value={institutionData.state}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="State"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">District *</label>
              <input
                name="district"
                value={institutionData.district}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="District"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Pincode *</label>
              <input
                name="pincode"
                value={institutionData.pincode}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Pincode"
                required
              />
            </div>
          </div>
        </section>

        {/* ---------------- ACCREDITATION ---------------- */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">
            Accreditation Information
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-2">NAAC Grade</label>
              <select
                name="NAAC_grade"
                value={institutionData.NAAC_grade}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
              >
                <option value="">Select</option>
                <option>A++</option>
                <option>A+</option>
                <option>A</option>
                <option>B++</option>
                <option>B+</option>
                <option>B</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">NIRF Rank</label>
              <input
                name="NIRF_rank"
                value={institutionData.NIRF_rank}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Rank"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">AISHE Code</label>
              <input
                name="AISHE_code"
                value={institutionData.AISHE_code}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg"
                placeholder="Code"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">UDISE Code</label>
            <input
              name="UDISE_code"
              value={institutionData.UDISE_code}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              placeholder="Code"
            />
          </div>
        </section>

        {/* ---------------- COURSES OFFERED ---------------- */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold border-b pb-2">
            Courses Offered
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "B.Tech",
              "M.Tech",
              "Diploma",
              "BCA",
              "MCA",
              "Pharmacy",
              "B.Arch",
              "B.A",
              "B.Sc",
              "B.Com",
              "M.A",
              "M.Sc",
              "Ph.D Programs",
            ].map((course) => (
              <label
                key={course}
                className="flex items-center gap-2 border p-3 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={course}
                  onChange={handleCourseAdd}
                  className="accent-blue-600"
                />
                <span className="font-medium">{course}</span>
              </label>
            ))}
          </div>
        </section>

        {/* SAVE BUTTON */}
        <div className="pt-6 border-t border-gray-200 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Save & Continue
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default InstitutionProfile;
