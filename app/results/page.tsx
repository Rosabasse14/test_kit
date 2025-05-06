"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Thermometer } from "@/components/thermometer"
import { saveResultsToJson } from "@/lib/results-service"

const resultsExplanation = {
  low:
    "🔵 LOW SEVERITY (0–49%): The operational challenges appear to be minor and localized. " +
    "They likely don't pose immediate risks to tenants or cause significant financial impact. " +
    "Standard property management practices should be sufficient to address these issues and maintain performance stability.",

  medium:
    "🟡 MODERATE SEVERITY (50–79%): The operational challenges require attention within a reasonable timeframe. " +
    "While not urgent, inefficiencies in tracking, documentation, or coordination could escalate if left unaddressed. " +
    "Consider allocating time and resources to streamline your processes within the next 1–2 weeks to avoid long-term impact.",

  high:
    "🔴 HIGH SEVERITY (80–100%): The operational challenges demand immediate attention. " +
    "These problems likely affect multiple units or teams, pose communication and financial risks, and may contribute to tenant dissatisfaction or increased turnover. " +
    "Prioritize identifying gaps in your workflows, documentation, and oversight — and take prompt action to bring operations under control."
};

export default function Results() {
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [scorePercentage, setScorePercentage] = useState(0)
  const [severityLevel, setSeverityLevel] = useState<"low" | "medium" | "high">("low")
  const [filename, setFilename] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get answers from localStorage
    const storedAnswers = localStorage.getItem("prtAnswers")

    if (storedAnswers) {
      const answers = JSON.parse(storedAnswers)

      // Calculate score
      const calculatedScore = answers.reduce((sum: number, val: number) => sum + val, 0)
      const calculatedPercentage = (calculatedScore / answers.length) * 100

      // Determine severity level
      let calculatedSeverity: "low" | "medium" | "high" = "low"
      if (calculatedPercentage < 50) {
        calculatedSeverity = "low"
      } else if (calculatedPercentage < 80) {
        calculatedSeverity = "medium"
      } else {
        calculatedSeverity = "high"
      }

      setScore(calculatedScore)
      setScorePercentage(calculatedPercentage)
      setSeverityLevel(calculatedSeverity)

      // Save results to localStorage instead of JSON file
      const saveResult = async () => {
        try {
          const savedFilename = await saveResultsToJson(
            answers,
            calculatedScore,
            calculatedPercentage,
            calculatedSeverity,
          )

          // Store the result in localStorage
          const result = {
            timestamp: new Date().toISOString(),
            questions: [
              "Is the issue affecting multiple tenants or units simultaneously?",
              "Has the problem persisted for more than 14 days?",
              "Is the issue causing financial loss (e.g., property damage, lost rent)?",
              "Does the problem pose health or safety risks to occupants?",
              "Have previous attempts to resolve the issue failed?",
            ],
            answers: answers.map((a: number) => (a === 1 ? "Yes" : "No")),
            score: calculatedScore,
            score_percentage: calculatedPercentage,
            severity_level: calculatedSeverity,
            explanation: resultsExplanation[calculatedSeverity],
          }

          localStorage.setItem(`prt_result_${savedFilename}`, JSON.stringify(result))
          setFilename(savedFilename)
          setLoading(false)
        } catch (error) {
          console.error("Error saving results:", error)
          setFilename("Error saving results")
          setLoading(false)
        }
      }

      saveResult()
    } else {
      // If no answers in localStorage, redirect to start
      router.push("/")
    }
  }, [router])

  const startNewAssessment = () => {
    localStorage.removeItem("prtAnswers")
    router.push("/")
  }

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-600"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-lg">Calculating your results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-6">
          <CardTitle className="text-3xl font-bold">PRT ASSESSMENT RESULTS</CardTitle>
          <CardDescription className="text-white text-lg">Property Problem Severity Analysis</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center items-center">
              <Thermometer percentage={scorePercentage} severity={severityLevel} />
            </div>

            <div>
              <div className={`p-6 rounded-lg mb-6 text-white ${getSeverityColor(severityLevel)}`}>
                <h3 className="text-xl font-bold mb-2 text-center">Assessment Summary</h3>
                <p className="text-2xl font-bold text-center mb-2">Score: {scorePercentage.toFixed(1)}%</p>
                <h4 className="text-xl text-center mb-4">Severity: {severityLevel.toUpperCase()}</h4>
                <hr className="border-white/30 my-4" />
                <p>{resultsExplanation[severityLevel]}</p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={startNewAssessment}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-5 text-lg rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  Start New Assessment
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <h4 className="text-xl font-semibold text-center mb-4">Understanding All Severity Levels</h4>
            <Accordion type="single" collapsible defaultValue={severityLevel}>
              <AccordionItem value="high">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Badge className="bg-green-600 mr-2">80-100%</Badge>
                    <span>HIGH SEVERITY</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">{resultsExplanation.high}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="medium">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Badge className="bg-orange-500 mr-2">50-79%</Badge>
                    <span>MODERATE SEVERITY</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">{resultsExplanation.medium}</AccordionContent>
              </AccordionItem>

              <AccordionItem value="low">
                <AccordionTrigger className="py-4">
                  <div className="flex items-center">
                    <Badge className="bg-red-600 mr-2">0-49%</Badge>
                    <span>LOW SEVERITY</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">{resultsExplanation.low}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter className="text-center text-gray-500 border-t py-4">{/* Footer content removed */}</CardFooter>
      </Card>
    </div>
  )
}
