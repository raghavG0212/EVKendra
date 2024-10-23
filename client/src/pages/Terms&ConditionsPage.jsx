import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <div className="p-8 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center uppercase">
        Terms and Conditions
      </h1>

      <h2 className="text-xl font-semibold mb-2">Introduction</h2>
      <p className="mb-4">
        Welcome to [Your Company Name]. These Terms and Conditions govern your
        use of our EVkendra. By using our services, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
      <p className="mb-4">
        You at least [Minimum Age] years old to use our platform. By using our
        services, you represent that you meet this age requirement.
      </p>

      <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Accuracy:</strong> You agree to provide accurate and complete
          information when using our platform.
        </li>
        <li>
          <strong>Compliance:</strong> You agree to comply with all applicable
          laws and regulations while using our services.
        </li>
        <li>
          <strong>Security:</strong> You are responsible for maintaining the
          confidentiality of your account credentials and for all activities
          that occur under your account.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Use of Services</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Prohibited Activities:</strong> You must not engage in
          activities that disrupt or interfere with our services, including but
          not limited to hacking, spamming, or abusive behavior.
        </li>
        <li>
          <strong>Content:</strong> You are responsible for all content you
          submit through our platform. We reserve the right to remove or modify
          content that violates our policies.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
      <p className="mb-4">
        All content and materials on our platform, including logos, graphics,
        and software, are the property of [Your Company Name] or its licensors.
        You may not use these materials without our express permission.
      </p>

      <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
      <p className="mb-4">
        To the maximum extent permitted by law, [Your Company Name] shall not be
        liable for any indirect, incidental, or consequential damages arising
        from your use of our services.
      </p>

      <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms and Conditions from time to time. We will
        notify you of any significant changes by posting the updated terms on
        our website.
      </p>

      <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
      <p className="mb-4">
        These Terms and Conditions shall be governed by and construed in
        accordance with the laws of [Your Jurisdiction].
      </p>

      <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
      <p>
        For any questions about these Terms and Conditions, please contact us at
        [Contact Information].
      </p>
    </div>
  );
}
