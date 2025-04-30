const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto text-center px-4">
        <p className="mb-4">&copy; 2023 MediHelp+. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-blue-400">
            About
          </a>
          <a href="#" className="hover:text-blue-400">
            Contact
          </a>
          <a href="#" className="hover:text-blue-400">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-400">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
