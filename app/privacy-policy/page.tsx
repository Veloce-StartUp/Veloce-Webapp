import type { Metadata } from "next"
import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Veloce Technology (PVT) Limited collects, uses, and protects your personal information across our website, products, and mobile applications.",
  alternates: {
    canonical: "/privacy-policy",
  },
}

const LAST_UPDATED = "August 26, 2026"

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
      <LegalSection title="1. Introduction">
        <p>
          Veloce Technology (PVT) Limited (&ldquo;Veloce&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website, use our
          products, or use any mobile application we develop and operate (collectively, the
          &ldquo;Services&rdquo;).
        </p>
        <p>
          By accessing or using our Services, you agree to the collection and use of information in
          accordance with this policy. If you do not agree with the terms of this policy, please do not
          access or use our Services.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <strong className="text-white">Personal Information</strong> — name, email address, phone
            number, company name, and any other information you voluntarily provide when you create an
            account, contact us, or fill out a form.
          </li>
          <li>
            <strong className="text-white">Account &amp; Usage Data</strong> — login credentials, in-app
            activity, feature usage, session duration, and interaction logs.
          </li>
          <li>
            <strong className="text-white">Device Information</strong> — device model, operating system
            and version, unique device identifiers, mobile network information, and app version.
          </li>
          <li>
            <strong className="text-white">Location Information</strong> — approximate or precise location
            data, only where a specific feature requires it and you have granted permission.
          </li>
          <li>
            <strong className="text-white">Push Notification Tokens</strong> — device tokens used to
            deliver notifications, where you have opted in.
          </li>
          <li>
            <strong className="text-white">Cookies &amp; Similar Technologies</strong> — on our website, we
            use cookies and similar tracking technologies to analyze traffic and improve user experience.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and maintain our Services</li>
          <li>Create and manage your account</li>
          <li>Process transactions and send related information</li>
          <li>Send administrative information, updates, and support messages</li>
          <li>Send push notifications, where permitted by you</li>
          <li>Monitor and analyze usage and trends to improve the Services</li>
          <li>Detect, prevent, and address technical issues, fraud, or security incidents</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. How We Share Your Information">
        <p>
          We do not sell your personal information. We may share information with:
        </p>
        <ul>
          <li>
            <strong className="text-white">Service Providers</strong> — third-party vendors who perform
            services on our behalf, such as hosting, analytics, crash reporting, and customer support (for
            example, Vercel and analogous infrastructure or analytics providers).
          </li>
          <li>
            <strong className="text-white">Legal Requirements</strong> — where required to comply with
            applicable law, regulation, legal process, or governmental request.
          </li>
          <li>
            <strong className="text-white">Business Transfers</strong> — in connection with a merger,
            acquisition, or sale of assets, subject to standard confidentiality arrangements.
          </li>
          <li>
            <strong className="text-white">With Your Consent</strong> — for any other purpose disclosed to
            you and with your consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Mobile App Permissions">
        <p>
          Our mobile applications may request device permissions (such as camera, photo library, location,
          or notifications) to enable specific features. We only access this data when the relevant feature
          is used, and you may revoke permissions at any time through your device settings. Revoking a
          permission may limit related functionality.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Retention">
        <p>
          We retain your information for as long as your account is active or as needed to provide the
          Services, comply with our legal obligations, resolve disputes, and enforce our agreements. When no
          longer required, we securely delete or anonymize your data.
        </p>
      </LegalSection>

      <LegalSection title="7. Data Security">
        <p>
          We implement industry-standard technical and organizational measures designed to protect your
          information from unauthorized access, alteration, disclosure, or destruction. However, no method
          of transmission or storage is 100% secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Rights">
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, update, delete, or
          restrict the use of your personal information, and to withdraw consent at any time. To exercise
          any of these rights, please contact us using the details below.
        </p>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>
          Our Services are not directed to children under the age of 13 (or the applicable age of digital
          consent in your jurisdiction), and we do not knowingly collect personal information from children.
          If we become aware that we have inadvertently collected such information, we will take steps to
          delete it promptly.
        </p>
      </LegalSection>

      <LegalSection title="10. International Data Transfers">
        <p>
          Your information may be transferred to, stored, and processed in countries other than your own,
          including Sri Lanka, where our servers and service providers are located. We take appropriate
          safeguards to ensure your data remains protected in accordance with this Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection title="11. Third-Party Links & Services">
        <p>
          Our Services may contain links to third-party websites or integrate third-party services. We are
          not responsible for the privacy practices of those third parties, and we encourage you to review
          their respective privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="12. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by
          posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date above. Your
          continued use of the Services after changes become effective constitutes acceptance of the revised
          policy.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Us">
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <ul>
          <li>Veloce Technology (PVT) Limited</li>
          <li>
            Email:{" "}
            <a href="mailto:build.veloce@gmail.com">build.veloce@gmail.com</a>
          </li>
          <li>Phone: +94 (76) 879-4004 / +94 (75) 865-7450</li>
        </ul>
      </LegalSection>
    </LegalPageLayout>
  )
}
