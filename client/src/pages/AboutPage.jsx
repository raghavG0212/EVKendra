import React from "react";

const AboutPage = () => {
  return (
    <div className="p-8 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">About Us</h1>

      <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
      <p className="mb-4">
        At [Your Company Name], our mission is to revolutionize the way people
        engage in the democratic process. We believe that every voice matters,
        and we are dedicated to making voting more accessible, secure, and
        transparent for everyone.
      </p>

      <h2 className="text-xl font-semibold mb-2">What We Do</h2>
      <p className="mb-4">
        We provide a state-of-the-art EVkendra designed to streamline and
        enhance the voting experience. Our platform offers a user-friendly
        interface, robust security features, and real-time results to ensure
        that every vote counts and that the process is fair and efficient.
      </p>

      <h2 className="text-xl font-semibold mb-2">Our Values</h2>
      <p className="mb-4">
        <strong>Transparency:</strong> We are committed to maintaining the
        highest levels of transparency in our processes and technology.
        <br />
        <strong>Security:</strong> Our top priority is the security of your data
        and votes, ensuring that every transaction is protected against
        tampering and fraud.
        <br />
        <strong>Accessibility:</strong> We strive to make voting easy and
        accessible for all, regardless of location or ability.
      </p>

      <h2 className="text-xl font-semibold mb-2">Our Team</h2>
      <p className="mb-4">
        Our team consists of experienced professionals from diverse backgrounds,
        including technology, law, and public policy. We work collaboratively to
        develop innovative solutions that address the challenges of modern
        voting.
      </p>

      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <p>
        For more information, please reach out to us at [Contact Information].
        We are here to answer your questions and provide support.
        <br />
        Thank you for choosing [Your Company Name] as your trusted partner in
        the democratic process.
      </p>
    </div>
  );
};

export default AboutPage;
