import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Mail, Phone, Lock, Stethoscope, CreditCard, FileText, Heart, Upload, X } from "lucide-react";
import { register } from "../services/api";
import { PasswordStrength } from "../components/ui/password-strength";

const SPECIALIZATIONS = [
  "Cardiologist",
  "Dermatologist",
  "Endocrinologist",
  "Gastroenterologist",
  "General Practitioner",
  "Neurologist",
  "Obstetrician/Gynecologist",
  "Oncologist",
  "Ophthalmologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Radiologist",
  "Urologist",
];

const SignupDoctor = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    license_number: "",
    specialization: "",
    consultation_fee: "",
  });
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [licensePhotoPreview, setLicensePhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecializationChange = (value) => {
    setFormData({
      ...formData,
      specialization: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file (JPG, PNG, etc.)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setLicensePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(""); // Clear any previous errors
    }
  };

  const removePhoto = () => {
    setLicensePhoto(null);
    setLicensePhotoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const requestData = {
        ...formData,
        consultation_fee: Number.parseFloat(formData.consultation_fee),
      };

      const response = await fetch("https://medihelp-backend.onrender.com/api/doctors/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.status === 201) {
        navigate("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-2xl shadow-2xl border-0 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Stethoscope className="h-14 w-14 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Join as Doctor</CardTitle>
          <CardDescription className="text-base">Create your professional medical account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-sm font-semibold">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-sm font-semibold">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="dr.example@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+251 917 181 920"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_number" className="text-sm font-semibold">Medical License Number</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <Input
                  id="license_number"
                  name="license_number"
                  placeholder="MED12345678"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license_photo" className="text-sm font-semibold">
                Medical License Photo <span className="text-gray-400 font-normal">(Optional)</span>
              </Label>
              {!licensePhotoPreview ? (
                <div className="relative">
                  <input
                    type="file"
                    id="license_photo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="license_photo"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center space-y-2 text-gray-500">
                      <Upload className="h-8 w-8 text-blue-500" />
                      <span className="text-sm font-medium">Click to upload license photo</span>
                      <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={licensePhotoPreview}
                      alt="Medical License Preview"
                      className="w-full h-full object-contain bg-gray-50 dark:bg-gray-800"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {licensePhoto?.name} ({(licensePhoto?.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-semibold">Specialization</Label>
              <Select onValueChange={handleSpecializationChange} required>
                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation_fee" className="text-sm font-semibold">Consultation Fee ($)</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <Input
                  id="consultation_fee"
                  name="consultation_fee"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-11 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <PasswordStrength password={formData.password} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Doctor Account"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or</span>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                Are you a patient?{" "}
                <Link
                  to="/signup/patient"
                  className="text-green-600 hover:text-green-700 hover:underline font-semibold inline-flex items-center"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Sign up as Patient
                </Link>
              </div>
              <div>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignupDoctor;