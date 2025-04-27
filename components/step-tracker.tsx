"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, subMonths, subYears } from "date-fns"
import { CalendarIcon, ChevronDown, BarChartIcon, LineChartIcon, Activity, Maximize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Calendar from "@/components/calendar"
import { cn } from "@/lib/utils"
import { StepChart } from "@/components/step-chart"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart } from "@/components/bar-chart"
import { ProgressChart } from "@/components/progress-chart"
import { MotivationalQuote } from "@/components/motivational-quote"
import { StepSummary } from "@/components/step-summary"
import { FullScreenChart } from "@/components/full-screen-chart"

// Initial sample data with full dates for better filtering
const initialStepData = [
  { fullDate: new Date(2023, 4, 1), date: "May 1", steps: 5432 },
  { fullDate: new Date(2023, 4, 2), date: "May 2", steps: 6789 },
  { fullDate: new Date(2023, 4, 3), date: "May 3", steps: 4321 },
  { fullDate: new Date(2023, 4, 4), date: "May 4", steps: 7890 },
  { fullDate: new Date(2023, 4, 5), date: "May 5", steps: 6543 },
  { fullDate: new Date(2023, 4, 6), date: "May 6", steps: 8765 },
  { fullDate: new Date(2023, 4, 7), date: "May 7", steps: 9876 },
  { fullDate: new Date(2023, 4, 15), date: "May 15", steps: 7654 },
  { fullDate: new Date(2023, 4, 22), date: "May 22", steps: 8432 },
  { fullDate: new Date(2023, 4, 29), date: "May 29", steps: 9123 },
  { fullDate: new Date(2023, 5, 5), date: "Jun 5", steps: 7890 },
  { fullDate: new Date(2023, 5, 12), date: "Jun 12", steps: 8765 },
  { fullDate: new Date(2023, 5, 19), date: "Jun 19", steps: 9432 },
  { fullDate: new Date(2023, 5, 26), date: "Jun 26", steps: 8765 },
  { fullDate: new Date(2023, 6, 3), date: "Jul 3", steps: 7654 },
  { fullDate: new Date(2023, 6, 10), date: "Jul 10", steps: 8432 },
  { fullDate: new Date(2023, 6, 17), date: "Jul 17", steps: 9123 },
  { fullDate: new Date(2023, 6, 24), date: "Jul 24", steps: 8765 },
  { fullDate: new Date(2023, 6, 31), date: "Jul 31", steps: 9432 },
  { fullDate: new Date(2023, 7, 7), date: "Aug 7", steps: 8765 },
  { fullDate: new Date(2023, 7, 14), date: "Aug 14", steps: 7654 },
  { fullDate: new Date(2023, 7, 21), date: "Aug 21", steps: 8432 },
  { fullDate: new Date(2023, 7, 28), date: "Aug 28", steps: 9123 },
  { fullDate: new Date(2023, 8, 4), date: "Sep 4", steps: 8765 },
  { fullDate: new Date(2023, 8, 11), date: "Sep 11", steps: 9432 },
  { fullDate: new Date(2023, 8, 18), date: "Sep 18", steps: 8765 },
  { fullDate: new Date(2023, 8, 25), date: "Sep 25", steps: 7654 },
  { fullDate: new Date(2023, 9, 2), date: "Oct 2", steps: 8432 },
  { fullDate: new Date(2023, 9, 9), date: "Oct 9", steps: 9123 },
  { fullDate: new Date(2023, 9, 16), date: "Oct 16", steps: 8765 },
  { fullDate: new Date(2023, 9, 23), date: "Oct 23", steps: 9432 },
  { fullDate: new Date(2023, 9, 30), date: "Oct 30", steps: 8765 },
  { fullDate: new Date(2023, 10, 6), date: "Nov 6", steps: 7654 },
  { fullDate: new Date(2023, 10, 13), date: "Nov 13", steps: 8432 },
  { fullDate: new Date(2023, 10, 20), date: "Nov 20", steps: 9123 },
  { fullDate: new Date(2023, 10, 27), date: "Nov 27", steps: 8765 },
  { fullDate: new Date(2023, 11, 4), date: "Dec 4", steps: 9432 },
  { fullDate: new Date(2023, 11, 11), date: "Dec 11", steps: 8765 },
  { fullDate: new Date(2023, 11, 18), date: "Dec 18", steps: 7654 },
  { fullDate: new Date(2023, 11, 25), date: "Dec 25", steps: 8432 },
  { fullDate: new Date(2024, 0, 1), date: "Jan 1", steps: 9123 },
  { fullDate: new Date(2024, 0, 8), date: "Jan 8", steps: 8765 },
  { fullDate: new Date(2024, 0, 15), date: "Jan 15", steps: 9432 },
  { fullDate: new Date(2024, 0, 22), date: "Jan 22", steps: 8765 },
  { fullDate: new Date(2024, 0, 29), date: "Jan 29", steps: 7654 },
  { fullDate: new Date(2024, 1, 5), date: "Feb 5", steps: 8432 },
  { fullDate: new Date(2024, 1, 12), date: "Feb 12", steps: 9123 },
  { fullDate: new Date(2024, 1, 19), date: "Feb 19", steps: 8765 },
  { fullDate: new Date(2024, 1, 26), date: "Feb 26", steps: 9432 },
  { fullDate: new Date(2024, 2, 4), date: "Mar 4", steps: 8765 },
  { fullDate: new Date(2024, 2, 11), date: "Mar 11", steps: 7654 },
  { fullDate: new Date(2024, 2, 18), date: "Mar 18", steps: 8432 },
  { fullDate: new Date(2024, 2, 25), date: "Mar 25", steps: 9123 },
  { fullDate: new Date(2024, 3, 1), date: "Apr 1", steps: 8765 },
  { fullDate: new Date(2024, 3, 8), date: "Apr 8", steps: 9432 },
  { fullDate: new Date(2024, 3, 15), date: "Apr 15", steps: 8765 },
  { fullDate: new Date(2024, 3, 22), date: "Apr 22", steps: 7654 },
  { fullDate: new Date(2024, 3, 29), date: "Apr 29", steps: 8432 },
  { fullDate: new Date(2024, 4, 6), date: "May 6", steps: 9123 },
  { fullDate: new Date(2024, 4, 13), date: "May 13", steps: 8765 },
  { fullDate: new Date(2024, 4, 20), date: "May 20", steps: 9432 },
  { fullDate: new Date(2024, 4, 27), date: "May 27", steps: 8765 },
]

// Time period options
const timePeriods = [
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 6 Months", value: "6months" },
  { label: "Last Year", value: "1year" },
  { label: "All Time", value: "all" },
]

export function StepTracker() {
  const [stepData, setStepData] = useState(initialStepData)
  const [filteredData, setFilteredData] = useState(initialStepData)
  const [date, setDate] = useState<Date>()
  const [steps, setSteps] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [timePeriod, setTimePeriod] = useState("30days")
  const [dailyGoal, setDailyGoal] = useState(10000)

  // Full screen chart states
  const [showFullScreenLineChart, setShowFullScreenLineChart] = useState(false)
  const [showFullScreenBarChart, setShowFullScreenBarChart] = useState(false)
  const [showFullScreenProgressChart, setShowFullScreenProgressChart] = useState(false)

  // Filter data based on selected time period
  useEffect(() => {
    const now = new Date()
    let startDate: Date
    const endDate = now

    switch (timePeriod) {
      case "thisWeek":
        // Start from the beginning of the current week (Sunday)
        startDate = new Date(now)
        startDate.setDate(now.getDate() - now.getDay())
        startDate.setHours(0, 0, 0, 0)
        break
      case "thisMonth":
        // Start from the beginning of the current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "7days":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "30days":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 30)
        break
      case "6months":
        startDate = subMonths(now, 6)
        break
      case "1year":
        startDate = subYears(now, 1)
        break
      default: // all time
        startDate = new Date(0) // beginning of time
        break
    }

    const filtered = stepData.filter((item) => item.fullDate >= startDate && item.fullDate <= endDate)

    // Sort by date
    filtered.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())

    setFilteredData(filtered)
  }, [timePeriod, stepData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !steps || isNaN(Number(steps)) || Number(steps) <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid date and step count",
        variant: "destructive",
      })
      return
    }

    // Check if the selected date is in the future
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Normalize to start of day

    if (date > now) {
      toast({
        title: "Future date detected",
        description: "Do not cheat the system. This date is in the future",
        variant: "destructive",
      })
      return
    }

    // Create a new date object to avoid mutation issues
    const fullDate = new Date(date.getTime())
    const formattedDate = format(fullDate, "MMM d")
    const newStepData = [...stepData]

    // Normalize the selected date to midnight for comparison
    const normalizedSelectedDate = new Date(
      fullDate.getFullYear(),
      fullDate.getMonth(),
      fullDate.getDate(),
    ).toDateString()

    // Check if date already exists using normalized date strings for reliable comparison
    const existingIndex = newStepData.findIndex(
      (item) =>
        item.fullDate &&
        new Date(item.fullDate.getFullYear(), item.fullDate.getMonth(), item.fullDate.getDate()).toDateString() ===
          normalizedSelectedDate,
    )

    if (existingIndex >= 0) {
      // Update existing entry
      newStepData[existingIndex] = {
        fullDate,
        date: formattedDate,
        steps: Number(steps),
      }
    } else {
      // Add new entry
      newStepData.push({
        fullDate,
        date: formattedDate,
        steps: Number(steps),
      })
    }

    // Sort by date
    newStepData.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())

    setStepData(newStepData)
    setSteps("")
    setIsOpen(false)

    // Show motivational quote
    setShowQuote(true)

    // Hide quote after 5 seconds
    setTimeout(() => {
      setShowQuote(false)
    }, 5000)

    toast({
      title: "Steps recorded!",
      description: `You walked ${steps} steps on ${formattedDate}`,
    })
  }

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value)
  }

  const handleGoalChange = (newGoal: number) => {
    setDailyGoal(newGoal)
  }

  return (
    <>
      {showQuote && <MotivationalQuote />}

      {/* Full Screen Chart Modals */}
      {showFullScreenLineChart && (
        <FullScreenChart
          title="Step Trend"
          onClose={() => setShowFullScreenLineChart(false)}
          chartType="line"
          data={filteredData}
        />
      )}

      {showFullScreenBarChart && (
        <FullScreenChart
          title="Step Comparison"
          onClose={() => setShowFullScreenBarChart(false)}
          chartType="bar"
          data={filteredData}
        />
      )}

      {showFullScreenProgressChart && (
        <FullScreenChart
          title="Progress & Goals"
          onClose={() => setShowFullScreenProgressChart(false)}
          chartType="progress"
          data={filteredData}
          dailyGoal={dailyGoal}
          onGoalChange={handleGoalChange}
        />
      )}

      <div className="grid gap-8">
        {/* Summary Stats Row */}
        <StepSummary data={filteredData} dailyGoal={dailyGoal} />

        {/* Time Period Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Step Tracking Dashboard</h2>

          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 bg-white">
                  {timePeriods.find((p) => p.value === timePeriod)?.label || "Time Period"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timePeriods.map((period) => (
                  <DropdownMenuItem
                    key={period.value}
                    onClick={() => handleTimePeriodChange(period.value)}
                    className={timePeriod === period.value ? "bg-muted" : ""}
                  >
                    {period.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Card */}
          <Card className="transition-all duration-300 hover:shadow-lg lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Daily Step Input</CardTitle>
              <CardDescription>Record your daily step count</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        value={date}
                        onChange={(date) => {
                          setDate(date)
                          setIsOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="steps">Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="Enter step count"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    min="1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pastel-green hover:bg-pastel-green/80 transition-all duration-300"
                >
                  Record Steps
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Line Chart Card */}
          <Card className="transition-all duration-300 hover:shadow-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LineChartIcon className="h-5 w-5 mr-2 text-pastel-green" />
                  <div>
                    <CardTitle>Step Trend</CardTitle>
                    <CardDescription>Daily step count over time</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFullScreenLineChart(true)}
                  className="h-8 w-8"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">View full screen</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px]">
              <StepChart data={filteredData} />
            </CardContent>
          </Card>

          {/* Bar Chart Card */}
          <Card className="transition-all duration-300 hover:shadow-lg lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2 text-pastel-purple" />
                  <div>
                    <CardTitle>Step Comparison</CardTitle>
                    <CardDescription>Compare step counts across different days</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowFullScreenBarChart(true)} className="h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">View full screen</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px]">
              <BarChart data={filteredData} />
            </CardContent>
          </Card>

          {/* Progress Chart Card */}
          <Card className="transition-all duration-300 hover:shadow-lg lg:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-pastel-blue" />
                  <div>
                    <CardTitle>Progress & Goals</CardTitle>
                    <CardDescription>Track your step goals and achievements</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFullScreenProgressChart(true)}
                  className="h-8 w-8"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">View full screen</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ProgressChart data={filteredData} initialGoal={dailyGoal} onGoalChange={handleGoalChange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
