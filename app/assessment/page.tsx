"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle } from "lucide-react"

const questions = [
  "Do you find it difficult to consistently assess and document the condition of a unit before move-in and after move-out?",
  "Are you currently not using a standardized tool or checklist to monitor the physical condition of properties over time?",
  "Do you rely on manual methods or fragmented tools to keep track of critical dates like rent due dates, lease renewals, or maintenance schedules?",
  "Do you lack a centralized dashboard that gives you a clear, real-time view of rent collection across all your properties?",
  "Do you experience frequent communication gaps between tenants, maintenance teams, and property owners?",
]

export default function Assessment() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress percentage
    setProgress((currentQuestion / questions.length) * 100)
  }, [currentQuestion])

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Convert boolean answers to 1s and 0s for the API
      const numericAnswers = newAnswers.map((a) => (a ? 1 : 0))

      // Store answers in localStorage for the results page
      localStorage.setItem("prtAnswers", JSON.stringify(numericAnswers))

      // Navigate to results page
      router.push("/results")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-2xl text-center">PRT ASSESSMENT</CardTitle>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <h3 className="text-xl font-semibold text-center mb-6">Question {currentQuestion + 1}</h3>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-inner">
            <p className="text-center text-lg">{questions[currentQuestion]}</p>
          </div>

          <div className="flex justify-center gap-6">
            <Button
              onClick={() => handleAnswer(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" /> Yes
            </Button>
            <Button
              onClick={() => handleAnswer(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2"
            >
              <XCircle className="h-5 w-5" /> No
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-gray-500 border-t py-4">
          <p>Answer honestly for the most accurate assessment</p>
        </CardFooter>
      </Card>
    </div>
  )
}
