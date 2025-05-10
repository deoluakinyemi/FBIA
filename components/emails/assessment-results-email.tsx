import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Row,
  Column,
} from "@react-email/components"
import type { AssessmentEmailData } from "@/lib/email-service"

export function AssessmentResultsEmail(data: AssessmentEmailData) {
  const { userName, overallScore, pillarScores, assessmentId, completedAt } = data

  const formattedDate = new Date(completedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const pillarTitles: Record<string, string> = {
    awareness: "Financial Awareness",
    goals: "Goal Setting",
    habits: "Financial Habits",
    mindsets: "Money Mindsets",
    assets: "Asset Building",
    liabilities: "Liability Management",
    income: "Income Streams",
    expenses: "Expense Control",
  }

  const getScoreText = (score: number): string => {
    if (score >= 0.8) return "Excellent"
    if (score >= 0.6) return "Good"
    if (score >= 0.4) return "Fair"
    if (score >= 0.2) return "Needs Work"
    return "Critical"
  }

  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return "#16a34a" // green-600
    if (score >= 0.6) return "#059669" // emerald-600
    if (score >= 0.4) return "#d97706" // amber-600
    if (score >= 0.2) return "#ea580c" // orange-600
    return "#dc2626" // red-600
  }

  return (
    <Html>
      <Head />
      <Preview>Your Financial Assessment Results - Overall Score: {Math.round(overallScore * 10)}/10</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Financial Assessment Results</Heading>

          <Text style={paragraph}>Hello {userName},</Text>

          <Text style={paragraph}>
            Thank you for completing your financial health assessment on {formattedDate}. Below is a summary of your
            results.
          </Text>

          <Section style={scoreSection}>
            <Heading as="h2" style={h2}>
              Overall Score: {Math.round(overallScore * 10)}/10
            </Heading>
            <Text
              style={{
                ...paragraph,
                color: getScoreColor(overallScore),
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              {getScoreText(overallScore)}
            </Text>
            <Text style={{ ...paragraph, textAlign: "center" }}>
              {overallScore >= 0.8
                ? "Excellent! You have a strong financial foundation."
                : overallScore >= 0.6
                  ? "Good. You're on the right track, but there's room for improvement."
                  : overallScore >= 0.4
                    ? "Fair. You have several areas that need attention."
                    : "Needs improvement. Focus on building your financial foundation."}
            </Text>
          </Section>

          <Heading as="h2" style={h2}>
            Pillar Scores
          </Heading>

          {Object.entries(pillarScores).map(([pillar, score]) => (
            <Row key={pillar} style={pillarRow}>
              <Column style={pillarNameColumn}>
                <Text style={pillarName}>{pillarTitles[pillar] || pillar}</Text>
              </Column>
              <Column style={pillarScoreColumn}>
                <Text
                  style={{
                    ...pillarScore,
                    color: getScoreColor(score),
                  }}
                >
                  {Math.round(score * 10)}/10 - {getScoreText(score)}
                </Text>
              </Column>
            </Row>
          ))}

          <Hr style={hr} />

          <Text style={paragraph}>
            We've prepared a detailed analysis of your financial health with personalized recommendations. To view your
            complete assessment results, click the button below:
          </Text>

          <Section style={buttonContainer}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/assessment/results/${assessmentId}`} style={button}>
              View Full Results
            </Link>
          </Section>

          <Text style={paragraph}>
            We'd also like to invite you to schedule a complimentary clarity session to discuss your results and develop
            a personalized action plan. Our financial coach will help you identify key areas for improvement and provide
            guidance on next steps.
          </Text>

          <Section style={buttonContainer}>
            <Link
              href={`${process.env.NEXT_PUBLIC_APP_URL}/schedule-session?assessment=${assessmentId}`}
              style={{ ...button, backgroundColor: "#4f46e5" }}
            >
              Schedule Clarity Session
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent to you because you completed a financial assessment. If you have any questions, please
            contact us at support@yourdomain.com.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
}

const h2 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0 10px",
  padding: "0",
}

const paragraph = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
}

const scoreSection = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
  textAlign: "center" as const,
}

const pillarRow = {
  margin: "8px 0",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "8px",
}

const pillarNameColumn = {
  width: "60%",
}

const pillarScoreColumn = {
  width: "40%",
  textAlign: "right" as const,
}

const pillarName = {
  margin: "0",
  color: "#4b5563",
  fontSize: "16px",
  fontWeight: "normal",
}

const pillarScore = {
  margin: "0",
  fontSize: "16px",
  fontWeight: "bold",
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
}

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
}

const footer = {
  color: "#9ca3af",
  fontSize: "14px",
  margin: "24px 0",
  textAlign: "center" as const,
}
