"use client"

import { useState } from "react"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Footprints } from "lucide-react"

interface StepData {
  date: string
  steps: number
  fullDate?: Date
}

interface BarChartProps {
  data: StepData[]
  height?: string | number
}

// Enhanced custom tooltip component with more visible styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-md shadow-lg animate-in fade-in zoom-in-95 duration-200">
        <p className="font-medium text-base mb-1">{`${label}`}</p>
        <p className="text-base text-gray-700 font-semibold">
          <span className="text-pastel-purple">Steps:</span> {payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function BarChart({ data, height = "100%" }: BarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Process data for better visualization
  let chartData = [...data]

  // If we have too many data points, we need to aggregate them
  if (data.length > 14) {
    // For large datasets, we'll show weekly averages
    const weeklyData: Record<string, { total: number; count: number; dates: string[] }> = {}

    data.forEach((item) => {
      if (!item.fullDate) return

      // Get week number and year for unique identification
      const year = item.fullDate.getFullYear()
      const weekNumber = getWeekNumber(item.fullDate)
      const weekKey = `Week ${weekNumber}, ${year}`

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { total: 0, count: 0, dates: [] }
      }

      weeklyData[weekKey].total += item.steps
      weeklyData[weekKey].count += 1
      weeklyData[weekKey].dates.push(item.date)
    })

    chartData = Object.entries(weeklyData).map(([date, data]) => ({
      date,
      steps: Math.round(data.total / data.count),
      tooltip: `Avg of ${data.dates.length} days: ${data.dates.join(", ")}`,
      fullDate: undefined,
    }))
  }

  // Limit to a reasonable number of bars for better visualization
  if (chartData.length > 20) {
    chartData = chartData.slice(chartData.length - 20)
  }

  return (
    <div style={{ height, width: "100%" }}>
      <ChartContainer
        config={{
          steps: {
            label: "Steps",
            color: "hsl(var(--pastel-purple))",
            icon: Footprints,
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{
              top: 10,
              right: 20, // Increased right margin to ensure last bar is visible
              left: 10,
              bottom: 10,
            }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              interval={chartData.length > 10 ? Math.floor(chartData.length / 10) : 0}
              angle={-45}
              textAnchor="end"
              height={60}
              padding={{ left: 0, right: 0 }} // Ensure first and last bars are visible
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              wrapperStyle={{ zIndex: 100 }}
              isAnimationActive={true}
            />
            <Bar
              dataKey="steps"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              onMouseEnter={(data, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              fill="hsl(var(--pastel-purple))"
              stroke={activeIndex !== null ? "hsl(var(--pastel-blue))" : "none"}
              strokeWidth={activeIndex !== null ? 2 : 0}
              className="cursor-pointer"
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

// Helper function to get week number
function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}
