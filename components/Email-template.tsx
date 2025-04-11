import * as React from 'react';
import { Html, Button, Body, Container, Head, Heading, Preview, Text } from "@react-email/components";

interface EmailTemplateProps{
  fullName: string;
  verificationCode: string;
}


export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  verificationCode
}) => (
  <Html>
    <Head>
      <title>Verification Code</title>
    </Head>
    <Body>
      <Container>
        <Text>Hey {fullName} <br/> Your verification code for meal tracker is:</Text>
        <Heading>{verificationCode}</Heading>
      </Container>
    </Body>
  </Html>
);
export default EmailTemplate;