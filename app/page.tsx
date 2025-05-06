"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const startAssessment = () => {
    router.push("/assessment")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-8">
          <CardTitle className="text-3xl md:text-4xl font-bold">PRT ASSESSMENT</CardTitle>
          <CardDescription className="text-white text-xl mt-2">Property Problem Severity Analyzer</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center mb-8">
            <h3 className="text-2xl font-semibold text-center mb-2">
              Welcome to the Property Problem Severity Assessment Tool
            </h3>
            <p className="text-center text-gray-600 max-w-2xl">
              This assessment will help you determine the severity of property management issues through a series of 5
              targeted questions.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h4 className="text-lg font-semibold mb-3">How it works:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Answer 5 yes/no questions about your property issue</li>
              <li>Get an instant severity assessment with visual thermometer</li>
              <li>Receive detailed recommendations based on your score</li>
              <li>Results are saved for your records</li>
            </ol>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={startAssessment}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-6 text-lg rounded-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Start Assessment <ArrowRight className="ml-2" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-gray-500 border-t py-4">
          <p>Designed for property management professionals</p>
        </CardFooter>
      </Card>
    </div>
  )
}
