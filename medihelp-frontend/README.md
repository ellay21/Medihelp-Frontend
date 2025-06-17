# MediHelp Frontend

MediHelp is a web application designed to provide users with access to health information, doctor profiles, appointment scheduling, and educational resources. The application is built using React and follows a component-based architecture.

## Project Structure

The project is organized into the following main directories:

- **public/**: Contains the main HTML file (`index.html`) that serves as the entry point for the application.
- **src/**: Contains all the source code for the application, including components, pages, services, and styles.
  - **components/**: Reusable components such as navigation bars, footers, and language selectors.
  - **layouts/**: Layout components that define the structure of the application.
  - **pages/**: Individual pages of the application, including login and signup pages for both patients and doctors, as well as dashboards for each.
  - **routes/**: Defines the routing for the application.
  - **services/**: Contains API service functions for making requests to the backend.
  - **styles/**: Contains CSS files for styling the application.
  
## Features

- **User Authentication**: Separate login and signup pages for patients and doctors.
- **Dashboards**: Distinct dashboards for patients and doctors, providing relevant information and features.
- **Appointment Management**: Users can view and book appointments with doctors.
- **Educational Resources**: Access to articles, videos, and first aid guides.
- **Doctor Profiles**: View detailed profiles of doctors, including their qualifications and specialties.

## Getting Started

To get started with the MediHelp frontend application, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd medihelp-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:3000` in your web browser to view the application.

## Contributing

Contributions are welcome! If you would like to contribute to the project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.