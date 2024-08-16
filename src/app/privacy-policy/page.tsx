import { Navbar } from "@/components/landing/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Privacy Policy for NeatNGO
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            1. Introduction
          </h2>
          <p className="text-gray-600">
            Welcome to NeatNGO. We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you use our NGO
            management system and tell you about your privacy rights.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            2. Data We Collect
          </h2>
          <p className="text-gray-600">
            Through Google Auth, we may collect and process the following
            information:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600">
            <li>Name</li>
            <li>Email address</li>
            <li>Profile picture</li>
            <li>Google ID</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            3. How We Use Your Data
          </h2>
          <p className="text-gray-600">
            We use your personal data for the following purposes:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-600">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>
              To allow you to participate in interactive features of our service
              when you choose to do so
            </li>
            <li>To provide customer support</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our service
            </li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            4. Data Storage and Security
          </h2>
          <p className="text-gray-600">
            We are committed to ensuring that your information is secure. We
            have implemented suitable physical, electronic, and managerial
            procedures to safeguard and secure the information we collect to
            prevent unauthorized access or disclosure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            5. Your Rights
          </h2>
          <p className="text-gray-600">You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 text-gray-600">
            <li>Access your personal data</li>
            <li>Correct any mistakes in your personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            6. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-600">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "effective date" at the top of this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">
            7. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="mt-2 text-gray-600">
            Email: privacy@neatngo.com
            <br />
            Address: [Your Malaysian Address]
          </p>
        </section>
      </div>
    </>
  );
}
