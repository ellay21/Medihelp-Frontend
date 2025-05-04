import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Doctor = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Doctor Management System
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          A comprehensive platform for managing doctor profiles and availability
          schedules
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Doctor Profiles</CardTitle>
            <CardDescription>
              View and manage doctor information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Access complete doctor profiles including specializations,
              consultation fees, and availability status.
            </p>
            <Link to="/doctors/all">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Profiles
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Availability Management</CardTitle>
            <CardDescription>
              Schedule and update doctor availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Manage doctor schedules, set working hours, and update
              availability for appointments.
            </p>
            <Link to="/availability">
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Manage Schedules
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
