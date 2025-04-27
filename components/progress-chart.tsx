"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check } from "lucide-react"

interface StepData {
  date: string
  steps: number
  fullDate?: Date
}

interface ProgressChartProps {
  data: StepData[]
  initialGoal: number
  onGoalChange: (goal: number) => void
}

export function ProgressChart({ data, initialGoal, onGoalChange }: ProgressChartProps) {
  const [dailyGoal, setDailyGoal] = useState(initialGoal)
  const [editingGoal, setEditingGoal] = useState(false)
  const [tempGoal, setTempGoal] = useState(initialGoal.toString())
  const [stats, setStats] = useState({
    today: 0,
    average: 0,
    best: 0,
    streak: 0,
    totalSteps: 0,
    daysLogged: 0,
  })

  useEffect(() => {
    setDailyGoal(initialGoal)
    setTempGoal(initialGoal.toString())
  }, [initialGoal])

  useEffect(() => {
    if (!data.length) return

    // Calculate statistics
    const today = new Date()
    const todayFormatted = today.toDateString()

    const todaySteps = data.find((item) => item.fullDate && item.fullDate.toDateString() === todayFormatted)?.steps || 0

    const totalSteps = data.reduce((sum, item) => sum + item.steps, 0)
    const average = Math.round(totalSteps / data.length)
    const best = Math.max(...data.map((item) => item.steps))

    // Calculate streak (consecutive days with steps)
    let streak = 0
    if (data.length > 0 && data[data.length - 1].fullDate) {
      const sortedData = [...data].sort((a, b) => {
        if (!a.fullDate || !b.fullDate) return 0
        return b.fullDate.getTime() - a.fullDate.getTime()
      })

      let currentStreak = 0
      let currentDate = new Date()

      for (let i = 0; i < sortedData.length; i++) {
        const entry = sortedData[i]
        if (!entry.fullDate) continue

        const entryDate = new Date(entry.fullDate)
        const expectedDate = new Date(currentDate)
        expectedDate.setDate(currentDate.getDate() - 1)

        if (entryDate.toDateString() === expectedDate.toDateString()) {
          currentStreak++
          currentDate = entryDate
        } else {
          break
        }
      }

      streak = currentStreak
    }

    setStats({
      today: todaySteps,
      average,
      best,
      streak,
      totalSteps,
      daysLogged: data.length,
    })
  }, [data])

  const handleSaveGoal = () => {
    const newGoal = Number.parseInt(tempGoal)
    if (!isNaN(newGoal) && newGoal > 0) {
      setDailyGoal(newGoal)
      onGoalChange(newGoal)
    }
    setEditingGoal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Daily Goal</Label>
          {editingGoal ? (
            <div className="flex items-center space-x-2">
              <Input
                className="w-24 h-8"
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                type="number"
                min="1"
              />
              <Button size="icon" variant="ghost" onClick={handleSaveGoal} className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTempGoal(dailyGoal.toString())
                setEditingGoal(true)
              }}
              className="h-8 flex items-center gap-1"
            >
              {dailyGoal.toLocaleString()} steps
              <Edit2 className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
        <Progress
          value={(stats.today / dailyGoal) * 100}
          className="h-6"
          indicatorClassName="bg-gradient-to-r from-pastel-blue to-pastel-green transition-all duration-500"
        />
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>{stats.today.toString()} steps today</span>
          <span>{Math.round((stats.today / dailyGoal) * 100)}% of goal</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Monthly Comparison</h3>
        <div className="space-y-3">
          {generateMonthlyComparison(data).map((month) => (
            <div key={month.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{month.name}</span>
                <span>{month.average.toLocaleString()} avg</span>
              </div>
              <Progress
                value={(month.average / dailyGoal) * 100}
                className="h-3"
                indicatorClassName={getProgressColor(month.average, dailyGoal)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-base font-medium mb-3">Statistics</h3>
        <div className="grid grid-cols-2 gap-3">
          <StatItem label="Average" value={stats.average.toLocaleString()} />
          <StatItem label="Best Day" value={stats.best.toLocaleString()} />
          <StatItem label="Current Streak" value={`${stats.streak} days`} />
          <StatItem label="Total Steps" value={stats.totalSteps.toLocaleString()} />
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold mt-1">{value}</div>
    </div>
  )
}

// Helper function to generate monthly comparison data
function generateMonthlyComparison(data: StepData[]) {
  const months: Record<string, { total: number; count: number }> = {}

  data.forEach((item) => {
    if (!item.fullDate) return

    const monthName = item.fullDate.toLocaleString("default", { month: "short" })

    if (!months[monthName]) {
      months[monthName] = { total: 0, count: 0 }
    }

    months[monthName].total += item.steps
    months[monthName].count += 1
  })

  return Object.entries(months).map(([name, data]) => ({
    name,
    average: Math.round(data.total / data.count),
  }))
}

// Helper function to get progress color based on completion percentage
function getProgressColor(value: number, goal: number) {
  const percentage = (value / goal) * 100

  if (percentage >= 100) return "bg-gradient-to-r from-pastel-green to-pastel-blue"
  if (percentage >= 75) return "bg-pastel-blue"
  if (percentage >= 50) return "bg-pastel-yellow"
  if (percentage >= 25) return "bg-pastel-purple"
  return "bg-pastel-pink"
}
