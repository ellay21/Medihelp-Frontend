import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  Calendar,
  DollarSign,
  Award,
  Mail,
  Phone,
  User,
  Trash2,
} from "lucide-react";
import { fetchDoctorProfile, deleteDoctorProfile } from "@/lib/api";

export const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      setLoading(true);
      try {
        const data = await fetchDoctorProfile(id);
        setDoctor(data);
      } catch (err) {
        setError("Failed to load doctor profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoctorProfile(id);
      setDeleteDialogOpen(false);
      navigate("/doctors");
    } catch (err) {
      console.error(err);
      setError("Failed to delete doctor profile");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-teal-600" />
        <p className="mt-4 text-gray-600">Loading doctor profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <h2 className="text-red-800 font-medium text-lg mb-2">Error</h2>
          <p className="text-red-700">{error || "Doctor profile not found"}</p>
          <Link to="/doctors">
            <Button
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              Back to Doctors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Profile</h1>
          <p className="text-gray-500 mt-1">
            Detailed information about the doctor
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/doctors">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link to={`/doctors/${id}/edit`}>
            <Button className="bg-teal-600 hover:bg-teal-700">
              Edit Profile
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-medium">
                  {doctor.user.first_name.charAt(0)}
                  {doctor.user.last_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-medium">
                    Dr. {doctor.user.first_name} {doctor.user.last_name}
                  </h2>
                  <p className="text-teal-600">{doctor.specialization}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p>{doctor.user.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{doctor.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{doctor.user.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Professional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <Award className="h-8 w-8 text-teal-600 mb-2" />
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-medium">{doctor.license_number}</p>
                </div>

                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-teal-600 mb-2" />
                  <p className="text-sm text-gray-500">Consultation Fee</p>
                  <p className="font-medium">
                    ${Number.parseFloat(doctor.consultation_fee).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Availability Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doctor.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {doctor.available
                    ? "The doctor is currently accepting new appointments"
                    : "The doctor is not accepting new appointments at this time"}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Schedule Management</p>
                    <p className="text-sm text-gray-500">
                      View and manage availability
                    </p>
                  </div>
                </div>
                <Link to={`/availability?doctor=${doctor.id}`}>
                  <Button variant="outline">View Schedule</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete Dr. {doctor.user.first_name}{" "}
              {doctor.user.last_name}'s profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
