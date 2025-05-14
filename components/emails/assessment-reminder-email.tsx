import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components"

interface AssessmentReminderEmailProps {
  userName: string
  assessmentUrl: string
  daysAgo: number
  lastUpdated: string
}

export const AssessmentReminderEmail = ({
  userName,
  assessmentUrl,
  daysAgo,
  lastUpdated,
}: AssessmentReminderEmailProps) => {
  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Html>
      <Head />
      <Preview>Continue your financial assessment journey</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Continue Your Financial Assessment</Heading>
          <Text style={text}>Hello {userName},</Text>
          <Text style={text}>
            We noticed that you started a financial assessment {daysAgo} {daysAgo === 1 ? "day" : "days"} ago on{" "}
            {formattedDate} but haven't completed it yet.
          </Text>
          <Text style={text}>
            Your progress has been saved, and you can pick up right where you left off. Completing the assessment will
            provide you with valuable insights into your financial health and personalized recommendations.
          </Text>
          <Section style={buttonContainer}>
            <Button pX={20} pY={12} style={button} href={assessmentUrl}>
              Resume My Assessment
            </Button>
          </Section>
          <Text style={text}>
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} NairaWise Financial Assessment. All rights reserved.
            <br />
            <Link href="#" style={link}>
              Unsubscribe
            </Link>{" "}
            ·{" "}
            <Link href="#" style={link}>
              Privacy Policy
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
  borderRadius: "4px",
  border: "1px solid #e0e0e0",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const buttonContainer = {
  margin: "30px 0",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#0070f3",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
}

const hr = {
  borderColor: "#e0e0e0",
  margin: "30px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "22px",
  textAlign: "center" as const,
}

const link = {
  color: "#0070f3",
  textDecoration: "underline",
}

export default AssessmentReminderEmail
