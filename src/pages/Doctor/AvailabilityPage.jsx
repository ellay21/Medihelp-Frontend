import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/pagination";
import { fetchAvailability } from "@/lib/api";
import { Loader2, Clock, Calendar, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";

export const AvailabilityPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const doctorId = searchParams.get("doctor");

  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailability(page, doctorId);
        setAvailabilities(data.results);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (err) {
        setError("Failed to load availability data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [page, doctorId]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, "h:mm a");
    } catch {
      return timeString;
    }
  };

  if (loading && availabilities.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto text-teal-600" />
        <p className="mt-4 text-gray-600">Loading availability schedules...</p>
      </div>
    );
  }

  if (error && availabilities.length === 0) {
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
          <h1 className="text-3xl font-bold tracking-tight">
            Doctor Availability
          </h1>
          <p className="text-gray-500 mt-1">
            Manage doctor schedules and availability
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link to="/availability/new">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </Link>
        </div>
      </div>

      {availabilities.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">
            No availability schedules found
          </h3>
          <p className="text-gray-500 mt-2">
            Create a new availability schedule to get started
          </p>
          <Link to="/availability/new">
            <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Availability
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availabilities.map((availability) => (
              <Card
                key={availability.id}
                className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-teal-600" />
                    <h3 className="font-medium">
                      {format(parseISO(availability.day), "EEEE, MMMM d, yyyy")}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Time Slot</p>
                        <p className="font-medium">
                          {formatTime(availability.start_time)} -{" "}
                          {formatTime(availability.end_time)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-medium">
                        D{availability.doctor}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Doctor ID</p>
                        <p className="font-medium">{availability.doctor}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/availability/${availability.id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link
                      to={`/availability/${availability.id}/edit`}
                      className="flex-1"
                    >
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
