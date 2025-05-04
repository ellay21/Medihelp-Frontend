import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "../../components/Pagination";
import { fetchDoctorProfiles } from "../../lib/api";
import { Loader2 } from "lucide-react";

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const data = await fetchDoctorProfiles(page);
        setDoctors(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (err) {
        setError("Failed to load doctor profiles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading && doctors.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-teal-600" />
        <p className="mt-4 text-gray-600">Loading doctor profiles...</p>
      </div>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <h2 className="text-red-800 font-medium text-lg mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Profiles</h1>
          <p className="text-gray-500 mt-1">
            Manage and view all doctor information
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link to="/doctors/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              Add New Doctor
            </Button>
          </Link>
        </div>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">
            No doctor profiles found
          </h3>
          <p className="text-gray-500 mt-2">
            Create a new doctor profile to get started
          </p>
          <Link to="/doctors/new">
            <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
              Add New Doctor
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                      {doctor.user.first_name.charAt(0)}
                      {doctor.user.last_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Dr. {doctor.user.first_name} {doctor.user.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">License:</span>
                      <span>{doctor.license_number}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Fee:</span>
                      <span>
                        ${parseFloat(doctor.consultation_fee).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`font-medium ${
                          doctor.available ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Contact:</span>
                      <span>{doctor.user.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link to={`/doctors/${doctor.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/doctors/${doctor.id}/edit`} className="flex-1">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
