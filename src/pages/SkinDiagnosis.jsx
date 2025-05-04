import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { uploadSkinDiagnosis } from "../services/api";
import { FiUpload } from "react-icons/fi"; // Import the upload icon

const SkinDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(() => {
    const savedCredits = localStorage.getItem("skinDiagnosisCredits");
    return savedCredits ? parseInt(savedCredits, 10) : 20;
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  useEffect(() => {
    localStorage.setItem("skinDiagnosisCredits", credits);
  }, [credits]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setDiagnosis(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      setError(null);
      const response = await uploadSkinDiagnosis(formData);
      setDiagnosis(response.data);
      setCredits((prevCredits) => prevCredits - 10);
    } catch (err) {
      setError(err.message || "Failed to upload image or get diagnosis");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      setCredits(20);
      localStorage.setItem("skinDiagnosisCredits", 20);
      setError(null);
      alert("Payment successful! Credits have been reset to 20.");
    }, 2000);
  };

  if (!localStorage.getItem("token"))
    return (
      <div className="text-center text-red-600">
        Please log in to use Skin Diagnosis.
      </div>
    );

  return (
    <>
      <NavBar />
      <header className="text-center py-6 mt-15 flex flex-col justify-center items-center ">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
         Ai Skin Diagnosis Tool
        </h2>
        <p className="mt-2 text-lg text-center max-w-2/3">
          Welcome to our advanced skin diagnosis tool. Upload an image of your
          skin to receive a detailed analysis, including potential conditions,
          urgency levels, and personalized recommendations. Ensure your image is
          clear and well-lit for the best results.
        </p>
      </header>
      <div className="container mx-auto p-4">
        

        {/* Credit Display */}
        <div className="max-w-md mx-auto mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Free Credits Remaining
            </span>
            <span className="text-xl font-semibold text-blue-600">
              {credits}
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(credits / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Upgrade Prompt */}
        {credits < 10 && (
          <div className="max-w-md mx-auto mb-4 p-4 bg-yellow-100 rounded-lg shadow-md border border-yellow-200">
            <p className="text-yellow-800 text-center">
              Insufficient credits. Please upgrade your package to continue.
              <button
                onClick={() => setShowPaymentModal(true)}
                className="text-blue-600 underline ml-1"
              >
                Upgrade Now
              </button>
            </p>
          </div>
        )}

        {/* Upload Form */}
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Upload Skin Image
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`flex items-center justify-center w-full px-4 py-2 border rounded-md cursor-pointer ${
                  credits < 10 || loading
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-600"
                } transition-colors`}
              >
                <FiUpload className="mr-2 text-blue-600" size={20} />
                <span className="text-gray-700">
                  {selectedFile ? selectedFile.name : "Choose an image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={credits < 10 || loading}
                />
              </label>
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading || credits < 10}
              className={`w-full px-6 py-2 rounded-full font-semibold text-white ${
                loading || credits < 10
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Upgrade Package
              </h3>
              <p className="text-gray-600 mb-4">
                Select a payment method to purchase more credits (Fake payment
                simulation).
              </p>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="file"
                    name="paymentMethod"
                    value="credit-card"
                    checked={selectedPaymentMethod === "credit-card"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="form-radio text-blue-600"
                    disabled={paymentProcessing}
                  />
                  <span className="text-gray-700">Credit Card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="form-radio text-green-600"
                    disabled={paymentProcessing}
                  />
                  <span className="text-gray-700">PayPal</span>
                </label>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  disabled={paymentProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className={`px-4 py-2 rounded-lg text-white flex items-center space-x-2 ${
                    paymentProcessing
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors`}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h-8z"
                        ></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay Now</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diagnosis Result */}
        {diagnosis && (
          <div className="mt-8 p-6 bg-white shadow-lg rounded-lg border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">
              Diagnosis Result
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Image</h4>
                <img
                  src={diagnosis.image}
                  alt="Skin Diagnosis"
                  className="mt-2 w-full max-w-md rounded-lg shadow-md"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Conditions
                </h4>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
                  {diagnosis.diagnosis.conditions.map((condition, index) => (
                    <li key={index} className="font-medium text-gray-800">
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Confidence: </span>
                  {Math.round(diagnosis.diagnosis.confidence * 100)}%
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Urgency: </span>
                  <span
                    className={`capitalize ${
                      diagnosis.diagnosis.urgency === "low"
                        ? "text-green-600"
                        : diagnosis.diagnosis.urgency === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {diagnosis.diagnosis.urgency}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mt-4">
                  Recommendations:
                </h4>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  {diagnosis.diagnosis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Created: {new Date(diagnosis.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(diagnosis.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SkinDiagnosis;
