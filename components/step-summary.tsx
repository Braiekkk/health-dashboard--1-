"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowUpRight, ArrowDownRight, Footprints, Award, Flame, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StepData {
  date: string
  steps: number
  fullDate?: Date
}

interface StepSummaryProps {
  data: StepData[]
  dailyGoal: number
}

export function StepSummary({ data, dailyGoal }: StepSummaryProps) {
  const [stats, setStats] = useState({
    today: 0,
    yesterday: 0,
    average: 0,
    best: 0,
    streak: 0,
    totalSteps: 0,
    daysLogged: 0,
    percentChange: 0,
    goalCompletion: 0,
  })

  useEffect(() => {
    if (!data.length) return

    // Calculate statistics
    const today = new Date()
    const todayFormatted = today.toDateString()

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayFormatted = yesterday.toDateString()

    const todaySteps = data.find((item) => item.fullDate && item.fullDate.toDateString() === todayFormatted)?.steps || 0
    const yesterdaySteps =
      data.find((item) => item.fullDate && item.fullDate.toDateString() === yesterdayFormatted)?.steps || 0

    const totalSteps = data.reduce((sum, item) => sum + item.steps, 0)
    const average = Math.round(totalSteps / data.length)
    const best = Math.max(...data.map((item) => item.steps))

    // Calculate percent change
    const percentChange = yesterdaySteps ? ((todaySteps - yesterdaySteps) / yesterdaySteps) * 100 : 0

    // Calculate goal completion
    const goalCompletion = Math.min(100, Math.round((todaySteps / dailyGoal) * 100))

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
      yesterday: yesterdaySteps,
      average,
      best,
      streak,
      totalSteps,
      daysLogged: data.length,
      percentChange,
      goalCompletion,
    })
  }, [data, dailyGoal])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard
        title="Today's Steps"
        value={stats.today.toLocaleString()}
        icon={<Footprints className="h-5 w-5" />}
        change={stats.percentChange}
        color="pastel-green"
      />

      <SummaryCard
        title="Daily Goal"
        value={`${stats.goalCompletion}%`}
        icon={<Award className="h-5 w-5" />}
        subtitle={`${stats.today.toString()} / ${dailyGoal.toString()}`}
        color="pastel-blue"
      />

      <SummaryCard
        title="Current Streak"
        value={`${stats.streak} days`}
        icon={<Flame className="h-5 w-5" />}
        subtitle={stats.streak > 0 ? "Keep it up!" : "Start today!"}
        color="pastel-purple"
      />

      <SummaryCard
        title="Best Day"
        value={stats.best.toLocaleString()}
        icon={<Calendar className="h-5 w-5" />}
        subtitle={`Avg: ${stats.average.toLocaleString()}`}
        color="pastel-yellow"
      />
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  change?: number
  color: string
}

function SummaryCard({ title, value, subtitle, icon, change, color }: SummaryCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 border-${color} group`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1 group-hover:scale-105 transition-transform">{value}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-full bg-${color}/20 text-${color}`}>{icon}</div>
        </div>

        {typeof change !== "undefined" && (
          <div className="mt-4 flex items-center text-xs">
            {change > 0 ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500">{change.toFixed(1)}% from yesterday</span>
              </>
            ) : change < 0 ? (
              <>
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500">{Math.abs(change).toFixed(1)}% from yesterday</span>
              </>
            ) : (
              <span className="text-gray-500">No change from yesterday</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
