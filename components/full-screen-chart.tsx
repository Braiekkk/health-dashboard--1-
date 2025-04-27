"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepChart } from "@/components/step-chart"
import { BarChart } from "@/components/bar-chart"
import { ProgressChart } from "@/components/progress-chart"

interface StepData {
  date: string
  steps: number
  fullDate?: Date
}

interface FullScreenChartProps {
  title: string
  onClose: () => void
  chartType: "line" | "bar" | "progress"
  data: StepData[]
  dailyGoal?: number
  onGoalChange?: (goal: number) => void
}

export function FullScreenChart({ title, onClose, chartType, data, dailyGoal, onGoalChange }: FullScreenChartProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {chartType === "line" && (
            <div className="h-[70vh]">
              <StepChart data={data} height="100%" />
            </div>
          )}

          {chartType === "bar" && (
            <div className="h-[70vh]">
              <BarChart data={data} height="100%" />
            </div>
          )}

          {chartType === "progress" && dailyGoal && onGoalChange && (
            <div className="max-w-2xl mx-auto">
              <ProgressChart data={data} initialGoal={dailyGoal} onGoalChange={onGoalChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
