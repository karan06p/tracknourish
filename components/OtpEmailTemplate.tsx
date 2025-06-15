import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OtpEmailTemplateProps {
  firstName: string;
  otp: string;
}

const OtpEmailTemplate = ({ firstName, otp }: OtpEmailTemplateProps) => {
  const previewText = `Your OTP for Tracknourish password reset`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.logoContainer}>
            <Text style={styles.logo}>Tracknourish</Text>
          </Section>

          <Section style={styles.content}>
            <Heading style={styles.heading}>Your OTP Code</Heading>

            <Text style={styles.paragraph}>Hi {firstName},</Text>

            <Text style={styles.paragraph}>
              Use the following one-time password (OTP) to reset your Tracknourish
              password.
            </Text>

            <Section style={styles.otpContainer}>
              <Text style={styles.otp}>{otp}</Text>
            </Section>

            <Text style={styles.paragraph}>
              This OTP will expire in 10 minutes. If you did not request a
              password reset, please ignore this email.
            </Text>

            <Hr style={styles.divider} />
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Tracknourish. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              <Link style={styles.footerLink} href="#">
                Privacy Policy
              </Link>{" "}
              •{" "}
              <Link style={styles.footerLink} href="#">
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: "#f1f0fb",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "40px 0",
  },
  container: {
    margin: "0 auto",
    padding: "20px 0",
    maxWidth: "600px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    padding: "20px 30px",
    borderBottom: "1px solid #eee",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    color: "#9b87f5",
  },
  content: {
    padding: "30px 40px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "10px 0 30px",
    color: "#1A1F2C",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#8E9196",
    margin: "16px 0",
  },
  otpContainer: {
    textAlign: "center" as const,
    margin: "20px 0",
  },
  otp: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1A1F2C",
    letterSpacing: "8px",
  },
  divider: {
    borderTop: "1px solid #eee",
    margin: "30px 0",
  },
  footer: {
    padding: "20px 30px",
    textAlign: "center" as const,
    borderTop: "1px solid #eee",
    backgroundColor: "#f9f9fd",
    borderBottomLeftRadius: "8px",
    borderBottomRightRadius: "8px",
  },
  footerText: {
    fontSize: "14px",
    color: "#aaadb0",
    margin: "8px 0",
  },
  footerLink: {
    color: "#aaadb0",
    textDecoration: "underline",
  },
};

export default OtpEmailTemplate;