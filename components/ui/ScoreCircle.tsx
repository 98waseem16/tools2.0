'use client'

import { useEffect, useState } from 'react'

export interface ScoreCircleProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showPercentage?: boolean
  colorThresholds?: {
    success: number
    warning: number
  }
  className?: string
}

export default function ScoreCircle({
  score,
  maxScore = 100,
  size = 'md',
  label,
  showPercentage = true,
  colorThresholds = { success: 70, warning: 50 },
  className = '',
}: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Size configurations
  const sizeConfig = {
    sm: { diameter: 60, strokeWidth: 6, fontSize: 'text-lg' },
    md: { diameter: 100, strokeWidth: 8, fontSize: 'text-3xl' },
    lg: { diameter: 140, strokeWidth: 10, fontSize: 'text-4xl' },
  }

  const { diameter, strokeWidth, fontSize } = sizeConfig[size]
  const radius = (diameter - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = (score / maxScore) * 100

  // Determine color based on score
  const getColor = () => {
    if (percentage >= colorThresholds.success) return '#15B546' // success green
    if (percentage >= colorThresholds.warning) return '#D4A017' // warning amber
    return '#B71322' // error red
  }

  const color = getColor()

  // Calculate stroke dash offset for the circle progress
  const strokeDashoffset = circumference - (animatedScore / maxScore) * circumference

  // Animate score on mount
  useEffect(() => {
    const duration = 1000 // 1 second
    const steps = 60
    const increment = score / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setAnimatedScore(Math.min(increment * currentStep, score))
      } else {
        clearInterval(timer)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [score])

  return (
    <div className={`score-circle ${className}`}>
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-white/10"
        />

        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Score text in the center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`font-bold ${fontSize}`}>
          {Math.round(animatedScore)}
          {showPercentage && maxScore === 100 && '%'}
          {!showPercentage && maxScore !== 100 && (
            <span className="text-base font-normal">/{maxScore}</span>
          )}
        </div>
        {label && (
          <div className="text-xs text-white/70 mt-1">{label}</div>
        )}
      </div>
    </div>
  )
}
