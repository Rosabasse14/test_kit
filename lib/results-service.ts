"use server"

interface AssessmentResult {
  timestamp: string
  questions: string[]
  answers: string[]
  score: number
  score_percentage: number
  severity_level: string
  explanation: string
}

const questions = [
  "Is the issue affecting multiple tenants or units simultaneously?",
  "Has the problem persisted for more than 14 days?",
  "Is the issue causing financial loss (e.g., property damage, lost rent)?",
  "Does the problem pose health or safety risks to occupants?",
  "Have previous attempts to resolve the issue failed?",
]

const resultsExplanation = {
  low:
    "LOW SEVERITY (0-49%): The property issue appears to be minor and localized. " +
    "It likely doesn't pose immediate risks to tenants or significant financial impact. " +
    "Standard maintenance procedures should be sufficient to address the problem.",

  medium:
    "MODERATE SEVERITY (50-79%): The property issue requires attention within a reasonable timeframe. " +
    "While not an emergency, this level of severity could escalate if left unaddressed. " +
    "Consider allocating resources to resolve these issues within the next 1-2 weeks.",

  high:
    "HIGH SEVERITY (80-100%): The property issue demands immediate attention. " +
    "These problems likely affect multiple tenants, pose safety risks, or cause financial damage. " +
    "Prioritize these issues and consider engaging specialized contractors or services to resolve them promptly.",
}

export async function saveResultsToJson(
  answers: number[],
  score: number,
  scorePercentage: number,
  severityLevel: "low" | "medium" | "high",
): Promise<string> {
  try {
    // Instead of writing to the filesystem (which can cause issues in browser environments),
    // we'll store the data in localStorage on the client side

    // Generate a unique filename based on timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `prt_assessment_${timestamp}.json`

    // Return the filename - the actual saving will happen on the client side
    return filename
  } catch (error) {
    console.error("Error processing results:", error)
    return "Error processing results"
  }
}
