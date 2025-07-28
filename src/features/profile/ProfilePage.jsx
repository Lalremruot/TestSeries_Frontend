import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useContext";
import axiosInstance from "../../../api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    houseNo: "",
    streetName: "",
    city: "",
    state: "",
    zipCode: "",
    profilePic: null,
    phone: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = response.data;
        setFormData((prev) => ({
          ...prev,
          profilePic: data.profilePic || "",
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          houseNo: data.houseNo || "",
          streetName: data.streetName || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
        }));
        if (data.profilePic) {
          const backendBase = "http://localhost:5001";
          setPreviewUrl(`${backendBase}${data.profilePic}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  // Prefill form on user update
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        houseNo: user.houseNo || "",
        streetName: user.streetName || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.houseNo.trim()) newErrors.houseNo = "House No. is required";
    if (!formData.streetName.trim())
      newErrors.streetName = "Street Name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!/^\d{6}$/.test(formData.zipCode))
      newErrors.zipCode = "Invalid Zip Code";
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    try {
      const formPayload = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          formPayload.append(key, formData[key]);
        }
      }

      await axiosInstance.put("/api/user/profile", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSuccess(true);
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h2>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-md text-center font-medium">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 border border-dashed border-gray-300">
                    <span className="text-sm text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                readOnly
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "House No.", name: "houseNo" },
                { label: "Street Name", name: "streetName" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Zip Code", name: "zipCode" },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-3 py-2.5 bg-[#080546] hover:bg-[#080546e3] text-white text-xs rounded-sm transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
