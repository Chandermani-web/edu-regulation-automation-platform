import React from "react";
import Sidebar from "../../Components/Sidebar";

const InstitutionProfile = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">

            <Sidebar />

            <div className="w-full p-8">

                <h1 className="text-3xl font-bold mb-6">Institution Profile</h1>

                <form className="bg-white shadow rounded-xl p-6 space-y-6">

                    {/* Institution Name */}
                    <div>
                        <label className="font-semibold">Institution Name *</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="Enter institution name"
                        />
                    </div>

                    {/* Institution Code */}
                    <div>
                        <label className="font-semibold">Institution Code *</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="INSTXXXX"
                        />
                    </div>

                    {/* Establishment Year */}
                    <div>
                        <label className="font-semibold">Establishment Year *</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded mt-1"
                            placeholder="YYYY"
                        />
                    </div>

                    {/* Institution Type */}
                    <div>
                        <label className="font-semibold">Institution Type *</label>
                        <select className="w-full border p-2 rounded mt-1">
                            <option>Select type</option>
                            <option>Private</option>
                            <option>Public</option>
                            <option>Deemed</option>
                            <option>Government</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="font-semibold">Complete Address *</label>
                        <textarea
                            className="w-full border p-2 rounded mt-1 h-24"
                            placeholder="Enter full address"
                        ></textarea>
                    </div>

                    {/* City / State / Pincode */}
                    <div className="grid grid-cols-3 gap-4">

                        <div>
                            <label className="font-semibold">City *</label>
                            <input className="w-full border p-2 rounded mt-1" placeholder="City" />
                        </div>

                        <div>
                            <label className="font-semibold">State *</label>
                            <input className="w-full border p-2 rounded mt-1" placeholder="State" />
                        </div>

                        <div>
                            <label className="font-semibold">Pincode *</label>
                            <input className="w-full border p-2 rounded mt-1" placeholder="Pincode" />
                        </div>

                    </div>


                    {/* Save */}
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                        type="submit"
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </div>
    );
};

export default InstitutionProfile;
