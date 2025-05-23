"use client"

import { useEffect, useState } from "react"

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 12,
    minutes: 30,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              } else {
                // Reset timer when it reaches zero
                days = 1
                hours = 12
                minutes = 30
                seconds = 0
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex space-x-3">
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 text-primary-foreground rounded-md px-3 py-2 text-xl font-bold">
          {timeLeft.days.toString().padStart(2, "0")}
        </div>
        <span className="text-xs text-muted-foreground mt-1">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 text-primary-foreground rounded-md px-3 py-2 text-xl font-bold">
          {timeLeft.hours.toString().padStart(2, "0")}
        </div>
        <span className="text-xs text-muted-foreground mt-1">Hours</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 text-primary-foreground rounded-md px-3 py-2 text-xl font-bold">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </div>
        <span className="text-xs text-muted-foreground mt-1">Minutes</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-primary/10 text-primary-foreground rounded-md px-3 py-2 text-xl font-bold">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <span className="text-xs text-muted-foreground mt-1">Seconds</span>
      </div>
    </div>
  )
}
