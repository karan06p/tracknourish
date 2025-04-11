import * as React from 'react';
import { Html, Button, Body, Container, Head, Heading, Preview, Text } from "@react-email/components";

interface EmailTemplateProps{
  fullName: string;
  verificationLink: string;
}


export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  verificationLink
}) => (
  <Html>
    <Head>
      <title>Verification Link</title>
    </Head>
    <Body>
      <Container>
        <Text>Hey {fullName} <br/> Your verification link for meal tracker is:</Text>
        <Text>{verificationLink}</Text>
        <Text>Click on the link to verify your email.</Text>
        <p>Don't click if you are not trying to create an account in Meal Tracker.</p>
      </Container>
    </Body>
  </Html>
);
export default EmailTemplate;