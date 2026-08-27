import type { Metadata } from "next"
import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions governing your use of Veloce Technology (PVT) Limited's website, products, and mobile applications.",
  alternates: {
    canonical: "/terms-of-service",
  },
}

const LAST_UPDATED = "August 26, 2026"

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated={LAST_UPDATED}>
      <LegalSection title="1. Agreement to Terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you
          and Veloce Technology (PVT) Limited (&ldquo;Veloce&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) governing your access to and use of our website, products, and mobile
          applications (collectively, the &ldquo;Services&rdquo;). By accessing or using the Services, you
          agree to be bound by these Terms. If you do not agree, please do not use the Services.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 13 years old (or the age of digital consent in your jurisdiction) to use the
          Services. By using the Services, you represent that you meet this requirement and that you have
          the legal capacity to enter into these Terms.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <p>
          Certain features may require you to create an account. You agree to provide accurate and complete
          information and to keep it up to date. You are responsible for maintaining the confidentiality of
          your login credentials and for all activity that occurs under your account. Notify us immediately
          of any unauthorized use.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services for any unlawful purpose or in violation of any applicable law</li>
          <li>Reverse engineer, decompile, or disassemble any part of the Services</li>
          <li>Interfere with or disrupt the integrity or performance of the Services</li>
          <li>Attempt to gain unauthorized access to the Services or related systems</li>
          <li>Upload or transmit malicious code, viruses, or harmful content</li>
          <li>Impersonate any person or entity or misrepresent your affiliation</li>
          <li>Use automated means to access the Services without our prior written consent</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Intellectual Property">
        <p>
          The Services, including all content, features, functionality, source code, design, trademarks,
          and logos, are owned by Veloce or our licensors and are protected by intellectual property laws.
          Except as expressly permitted, you may not copy, modify, distribute, sell, or lease any part of
          the Services without our prior written consent.
        </p>
      </LegalSection>

      <LegalSection title="6. Mobile Application License">
        <p>
          Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
          non-transferable, revocable license to download, install, and use our mobile applications on a
          device you own or control, solely for your personal, non-commercial use, and solely in accordance
          with the applicable app store terms (Apple App Store or Google Play, as applicable).
        </p>
      </LegalSection>

      <LegalSection title="7. Third-Party Services">
        <p>
          The Services may integrate or link to third-party services, products, or content. We do not
          control and are not responsible for third-party services, and your use of them is subject to
          their own terms and privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="8. Termination">
        <p>
          We may suspend or terminate your access to the Services at any time, with or without notice, for
          conduct that we believe violates these Terms or is otherwise harmful to other users, us, or third
          parties. You may stop using the Services or delete your account at any time.
        </p>
      </LegalSection>

      <LegalSection title="9. Disclaimer of Warranties">
        <p>
          The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without
          warranties of any kind, whether express or implied, including but not limited to warranties of
          merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that
          the Services will be uninterrupted, error-free, or completely secure.
        </p>
      </LegalSection>

      <LegalSection title="10. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Veloce shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of profits or data, arising out of or in
          connection with your use of, or inability to use, the Services, even if we have been advised of
          the possibility of such damages.
        </p>
      </LegalSection>

      <LegalSection title="11. Indemnification">
        <p>
          You agree to indemnify and hold harmless Veloce and its officers, directors, employees, and agents
          from any claims, damages, liabilities, and expenses arising out of your use of the Services or
          your violation of these Terms.
        </p>
      </LegalSection>

      <LegalSection title="12. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without
          regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject
          to the exclusive jurisdiction of the courts of Sri Lanka.
        </p>
      </LegalSection>

      <LegalSection title="13. Changes to These Terms">
        <p>
          We may modify these Terms at any time. We will notify you of material changes by posting the
          updated Terms on this page and revising the &ldquo;Last updated&rdquo; date. Your continued use of
          the Services after changes become effective constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="14. Contact Us">
        <p>If you have any questions about these Terms, please contact us at:</p>
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
