"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Footprints } from "lucide-react"

interface StepData {
  date: string
  steps: number
  fullDate?: Date
}

interface StepChartProps {
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
          <span className="text-pastel-green">Steps:</span> {payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export function StepChart({ data, height = "100%" }: StepChartProps) {
  const [activePoint, setActivePoint] = useState<number | null>(null)

  // If we have too many data points, we need to aggregate them
  let chartData = data

  if (data.length > 30) {
    // For large datasets, we'll show weekly averages
    const weeklyData: Record<string, { total: number; count: number }> = {}

    data.forEach((item) => {
      if (!item.fullDate) return

      // Get week number
      const weekNumber = getWeekNumber(item.fullDate)
      const weekKey = `Week ${weekNumber}`

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { total: 0, count: 0 }
      }

      weeklyData[weekKey].total += item.steps
      weeklyData[weekKey].count += 1
    })

    chartData = Object.entries(weeklyData).map(([date, data]) => ({
      date,
      steps: Math.round(data.total / data.count),
    }))
  }

  // Calculate average for reference line
  const average =
    chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.steps, 0) / chartData.length) : 0

  return (
    <div style={{ height, width: "100%" }}>
      <ChartContainer
        config={{
          steps: {
            label: "Steps",
            color: "hsl(var(--pastel-green))",
            icon: Footprints,
          },
        }}
        className="h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 20, // Increased right margin to ensure last point is visible
              left: 10,
              bottom: 10,
            }}
            onMouseLeave={() => setActivePoint(null)}
          >
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--pastel-green))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--pastel-green))" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              interval={chartData.length > 20 ? Math.floor(chartData.length / 10) : 0}
              padding={{ left: 0, right: 0 }} // Ensure first and last points are visible
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "rgba(0,0,0,0.2)", strokeWidth: 1, strokeDasharray: "5 5" }}
              wrapperStyle={{ zIndex: 100 }}
              isAnimationActive={true}
            />
            <ReferenceLine
              y={average}
              stroke="rgba(0,0,0,0.3)"
              strokeDasharray="3 3"
              label={{
                value: `Avg: ${average.toLocaleString()}`,
                position: "insideBottomRight",
                fill: "rgba(0,0,0,0.5)",
                fontSize: 12,
              }}
            />
            <Area
              type="linear"
              dataKey="steps"
              stroke="hsl(var(--pastel-green))"
              fill="url(#colorSteps)"
              strokeWidth={2}
              activeDot={{
                r: 8,
                strokeWidth: 2,
                stroke: "#fff",
                fill: "hsl(var(--pastel-green))",
                className: "cursor-pointer",
                onClick: (data, index) => {
                  // You could add additional functionality here when a point is clicked
                  console.log("Point clicked:", data)
                },
              }}
              onMouseEnter={(data, index) => setActivePoint(index)}
              onMouseLeave={() => setActivePoint(null)}
              animationDuration={1000}
              isAnimationActive={true}
            />
          </AreaChart>
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
