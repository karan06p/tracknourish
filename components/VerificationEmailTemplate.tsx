import React from "react";
import {
  Body,
  Button,
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

interface VerificationEmailProps {
  firstName: string;
  verificationLink: string;
}

export const VerificationEmail = ({
  firstName,
  verificationLink,
}: VerificationEmailProps) => {
  const previewText = `Verify your Tracknourish account`;

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
            <Heading style={styles.heading}>Verify your email address</Heading>
            
            <Text style={styles.paragraph}>Hi {firstName},</Text>
            
            <Text style={styles.paragraph}>
              Thanks for signing up for Tracknourish! Please verify your email address 
              to get started tracking your nutrition journey.
            </Text>
            
            <Section style={styles.buttonContainer}>
              <Button style={styles.button} href={verificationLink}>
                Verify Email
              </Button>
            </Section>
            
            <Text style={styles.paragraph}>
              If you didn&#39;t create an account with Tracknourish, you can safely ignore this email.
            </Text>
            
            <Text style={styles.paragraph}>
              The verification link will expire in 10 minutes.
            </Text>
            
            <Hr style={styles.divider} />
          </Section>
          
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Tracknourish. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              <Link style={styles.footerLink} href="#">Privacy Policy</Link> • 
              <Link style={styles.footerLink} href="#"> Terms of Service</Link>
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
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
  buttonContainer: {
    textAlign: "center" as const,
    margin: "30px 0",
  },
  button: {
    backgroundColor: "#9b87f5",
    color: "#ffffff",
    borderRadius: "6px",
    fontWeight: "500",
    padding: "12px 30px",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    textDecoration: "none",
  },
  divider: {
    borderTop: "1px solid #eee",
    margin: "30px 0",
  },
  link: {
    color: "#7E69AB",
    textDecoration: "underline",
    fontSize: "14px",
    display: "block",
    marginBottom: "16px",
    wordBreak: "break-all" as const,
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

export default VerificationEmail;