import { StepTracker } from "@/components/step-tracker"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue/20 via-white to-pastel-purple/20">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pastel-blue to-pastel-purple">
              HealthTech Dashboard
            </span>
          </h1>
          <p className="mt-2 text-gray-600 text-lg">Track and visualize your daily step count</p>
        </header>
        <StepTracker />
      </div>
    </div>
  )
}
