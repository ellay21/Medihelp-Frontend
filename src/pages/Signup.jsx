import React, { useState } from 'react';

const SignUp = () => {
    const [userType, setUserType] = useState(null); // null, 'doctor', or 'patient'
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        date_of_birth: '',
        password: '',
        confirm_password: '',
        license_number: '' // For doctors only
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
        setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        if (!formData.phone.match(/^\+\d{10,15}$/)) {
            newErrors.phone = 'Please enter a valid phone number (e.g., +251912345678)';
        }
        if (!formData.date_of_birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
            newErrors.date_of_birth = 'Please enter a valid date of birth.nr. (YYYY-MM-DD)';
        }
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }
        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }
        if (userType === 'doctor' && !formData.license_number.trim()) {
            newErrors.license_number = 'Medical license number is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            date_of_birth: formData.date_of_birth,
            password: formData.password,
            confirm_password: formData.confirm_password,
            user_type: userType
        };
        if (userType === 'doctor') {
            payload.license_number = formData.license_number;
        }

        try {
            const response = await fetch('{{authUrl}}/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSuccess(`Registration successful as ${userType}! Please check your email to verify your account.`);
                setFormData({
                    email: '',
                    first_name: '',
                    last_name: '',
                    phone: '',
                    date_of_birth: '',
                    password: '',
                    confirm_password: '',
                    license_number: ''
                });
                setErrors({});
                setUserType(null); // Reset to initial screen
            } else {
                const errorData = await response.json();
                setApiError(errorData.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setApiError('An error occurred. Please try again later.');
        }
    };

    const renderForm = () => (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Email address"
                    />
                    {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="First Name"
                    />
                    {errors.first_name && <p className="mt-1 text-red-500 text-xs">{errors.first_name}</p>}
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Last Name"
                    />
                    {errors.last_name && <p className="mt-1 text-red-500 text-xs">{errors.last_name}</p>}
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="+251912345678"
                    />
                    {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone}</p>}
                </div>
                <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
                        Date of Birth
                    </label>
                    <input
                        id="date_of_birth"
                        name="date_of_birth"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {errors.date_of_birth && <p className="mt-1 text-red-500 text-xs">{errors.date_of_birth}</p>}
                </div>
                {userType === 'doctor' && (
                    <div>
                        <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">
                            Medical License Number
                        </label>
                        <input
                            id="license_number"
                            name="license_number"
                            type="text"
                            value={formData.license_number}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.license_number ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Medical License Number"
                        />
                        {errors.license_number && <p className="mt-1 text-red-500 text-xs">{errors.license_number}</p>}
                    </div>
                )}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Password"
                    />
                    {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password}</p>}
                </div>
                <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                    </label>
 “

                    <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Confirm Password"
                    />
                    {errors.confirm_password && <p className="mt-1 text-red-500 text-xs">{errors.confirm_password}</p>}
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign Up
                </button>
            </div>
        </form>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Welcome to MediHelp
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign up as
                    </p>
                </div>
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        {success}
                    </div>
                )}
                {apiError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        {apiError}
                    </div>
                )}
                {!userType ? (
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={() => setUserType('doctor')}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign Up as Doctor
                        </button>
                        <button
                            onClick={() => setUserType('patient')}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign Up as Patient
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-center text-xl font-semibold text-gray-900">
                            Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                        </h3>
                        {renderForm()}
                        <button
                            onClick={() => setUserType(null)}
                            className="mt-4 text-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Back to user type selection
                        </button>
                    </>
                )}
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;