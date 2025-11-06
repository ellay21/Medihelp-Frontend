import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import { uploadSkinDiagnosis } from "../services/api";
import { 
  Upload, 
  RefreshCw, 
  Info, 
  AlertCircle, 
  Camera, 
  CheckCircle, 
  Sparkles, 
  Stethoscope, 
  BookOpen, 
  Loader2,
  Shield,
  Users,
  Award,
  Sun,
  Focus,
  ZoomIn
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SkinDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("skinDiagnosisCredits", credits);
  }, [credits]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image smaller than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosis(null);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image smaller than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setDiagnosis(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    if (credits < 10) {
      setError("Insufficient credits. Please upgrade your package.");
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

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDiagnosis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-10 w-10 text-purple-600" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Skin Diagnosis
              </h1>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg mb-6">
              Get instant AI-powered analysis of your skin condition with personalized recommendations from our advanced diagnostic system.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">50K+ Users Trust Us</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">Dermatologist Reviewed</span>
              </div>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <Alert className="mb-8 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">Important Medical Disclaimer:</span> This AI tool provides preliminary analysis only and is not a substitute for professional medical diagnosis. Always consult with a qualified healthcare professional for proper evaluation, diagnosis, and treatment of any skin condition.
            </AlertDescription>
          </Alert>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Upload className="h-6 w-6 text-purple-600" />
                    Upload Your Image
                  </CardTitle>
                  <CardDescription className="text-base">
                    Upload a clear, well-lit image of your skin condition. For best results, ensure good lighting and sharp focus.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-300" 
                    onDragOver={handleDragOver} 
                    onDrop={handleDrop} 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!previewUrl ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                          <Camera className="h-12 w-12 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Drop your image here
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            or click to browse files
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            fileInputRef.current?.click(); 
                          }}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Image
                        </Button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Supported: JPEG, PNG, WebP • Max 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative w-full max-w-md rounded-lg overflow-hidden">
                          <img 
                            src={previewUrl} 
                            alt="Selected skin condition" 
                            className="w-full h-auto object-contain max-h-96"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); resetForm(); }} 
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Change Image
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleSubmit(e); }} 
                            disabled={loading || credits < 10}
                            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Analyze Image
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Credits Card */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Free Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Remaining Credits</span>
                      <span className="text-3xl font-bold text-purple-600">{credits}</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-300"
                        style={{ width: `${(credits / 20) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Each analysis uses 10 credits
                    </p>
                    {credits < 10 && (
                      <Button 
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        Upgrade Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Tips for Best Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <Sun className="h-5 w-5 text-yellow-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Good Lighting</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Use natural light or bright indoor lighting</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Focus className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Sharp Focus</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Ensure the affected area is in clear focus</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <ZoomIn className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Close Distance</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Take the photo close enough to see details</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Diagnosis Results */}
          {diagnosis && (
            <Card className="mt-8 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Diagnosis Results
                </CardTitle>
                <CardDescription>
                  Based on the image analysis, here are the potential findings and recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Potential Condition</h3>
                    <p className="text-2xl font-bold text-purple-600 mb-4">
                      {diagnosis.diagnosis.conditions[0] || "Unknown condition"}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="font-medium">Confidence Level</span>
                          <span>{Math.round(diagnosis.diagnosis.confidence * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" 
                            style={{ width: `${diagnosis.diagnosis.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Severity: </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          diagnosis.diagnosis.urgency === "low" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          diagnosis.diagnosis.urgency === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {diagnosis.diagnosis.urgency.charAt(0).toUpperCase() + diagnosis.diagnosis.urgency.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Based on AI analysis of your skin condition and pattern recognition.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
                  <ul className="space-y-2">
                    {diagnosis.diagnosis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                  <Info className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <span className="font-semibold">Important Note:</span> This is an AI-assisted analysis and should not replace professional medical advice.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
              <CardContent className="p-6">
                <Stethoscope className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Need Professional Help?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect with certified dermatologists for comprehensive evaluation, accurate diagnosis, and personalized treatment plans.
                </p>
                <Button 
                  onClick={() => navigate('/find-doctor')} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Find a Dermatologist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardContent className="p-6">
                <BookOpen className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Learn More</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Explore our comprehensive library of dermatology articles, treatment guides, and skin health resources.
                </p>
                <Button 
                  onClick={() => navigate('/education')} 
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  Skin Health Articles
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Upgrade Package</CardTitle>
                  <CardDescription>
                    Select a payment method to purchase more credits (Simulated payment for demo)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={selectedPaymentMethod === "credit-card"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        disabled={paymentProcessing}
                        className="text-purple-600"
                      />
                      <span>Credit Card</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={selectedPaymentMethod === "paypal"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        disabled={paymentProcessing}
                        className="text-purple-600"
                      />
                      <span>PayPal</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowPaymentModal(false)}
                      variant="outline"
                      disabled={paymentProcessing}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePayment}
                      disabled={paymentProcessing}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      {paymentProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinDiagnosis;
