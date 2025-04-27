"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const quotes = [
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "The difference between try and triumph is just a little umph!",
    author: "Marvin Phillips",
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill",
  },
  {
    text: "The body achieves what the mind believes.",
    author: "Unknown",
  },
  {
    text: "Rome wasn't built in a day, but they were laying bricks every hour.",
    author: "John Heywood",
  },
  {
    text: "Strive for progress, not perfection.",
    author: "Unknown",
  },
  {
    text: "The hardest step is the first one out the door.",
    author: "Unknown",
  },
  {
    text: "Your body can stand almost anything. It's your mind that you have to convince.",
    author: "Unknown",
  },
  {
    text: "Small steps are better than no steps at all.",
    author: "Unknown",
  },
  {
    text: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "The only way to define your limits is by going beyond them.",
    author: "Arthur C. Clarke",
  },
]

export function MotivationalQuote() {
  const [quote, setQuote] = useState({ text: "", author: "" })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])

    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5 fade-in duration-500">
      <div className="bg-gradient-to-r from-pastel-blue/90 to-pastel-purple/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/20">
        <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="pr-4">
          <p className="text-gray-800 font-medium italic text-lg">"{quote.text}"</p>
          <p className="text-gray-600 text-sm mt-2">— {quote.author}</p>
        </div>
      </div>
    </div>
  )
}
