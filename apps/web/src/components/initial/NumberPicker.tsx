import { maxValue } from '@/constants'
import { minValue } from '@/constants'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function NumberPicker({
  goalDate = 15,
  setGoalDate = (value) => console.log('Selected:', value),
}: {
  goalDate?: number
  setGoalDate?: (value: number) => void
}) {
  const [isClicked, setIsClicked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentValue, setCurrentValue] = useState(goalDate)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollSpeed = useRef(0)
  useEffect(() => {
    setCurrentValue(goalDate)
  }, [goalDate])
  const increment = useCallback(() => {
    if (currentValue < maxValue) {
      const newValue = currentValue + 1
      setCurrentValue(newValue)
      setGoalDate(newValue)
    }
  }, [currentValue, maxValue, setGoalDate])

  const decrement = useCallback(() => {
    if (currentValue > minValue) {
      const newValue = currentValue - 1
      setCurrentValue(newValue)
      setGoalDate(newValue)
    }
  }, [currentValue, minValue, setGoalDate])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      scrollSpeed.current = Math.min(Math.abs(e.deltaY) / 10, 5)

      if (e.deltaY < 0) {
        increment()
      } else {
        decrement()
      }

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      const momentumScroll = () => {
        if (scrollSpeed.current > 0.5) {
          if (e.deltaY < 0) {
            increment()
          } else {
            decrement()
          }

          scrollSpeed.current *= 0.85
          scrollTimeout.current = setTimeout(momentumScroll, 150 / scrollSpeed.current)
        }
      }

      scrollTimeout.current = setTimeout(momentumScroll, 150)
    },
    [increment, decrement],
  )

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        container.removeEventListener('wheel', handleWheel)
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current)
        }
      }
    }
  }, [handleWheel])

  const handleStart = useCallback((e: any) => {
    setIsClicked(true)
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    setStartY(clientY)

    if (e.type.includes('touch')) {
      e.preventDefault()
    }
  }, [])

  const handleMove = useCallback(
    (e: any) => {
      if (!isClicked) return

      setIsDragging(true)
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY

      const diff = startY - clientY
      if (Math.abs(diff) > 3) {
        if (diff > 0) {
          increment()
        } else {
          decrement()
        }
        setStartY(clientY)

        if (e.type.includes('touch')) {
          e.preventDefault()
        }
      }
    },
    [isClicked, startY, increment, decrement],
  )

  const handleEnd = useCallback(() => {
    setIsClicked(false)
    setIsDragging(false)
  }, [])
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    container.addEventListener('mousedown', handleStart)
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleEnd)

    container.addEventListener('touchstart', handleStart, { passive: false })
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('touchend', handleEnd)

    return () => {
      container.removeEventListener('mousedown', handleStart)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)

      container.removeEventListener('touchstart', handleStart)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [handleStart, handleMove, handleEnd])

  return (
    <div className="w-full max-w-xs mx-auto">
      <div
        ref={containerRef}
        className={`flex items-center justify-center shadow-lg rounded-lg p-4 select-none
          ${isDragging ? 'bg-gray-100' : 'bg-white'} 
          ${isClicked ? 'cursor-grabbing' : 'cursor-grab'}
          transition-colors duration-150 h-32`}
      >
        <div className="flex items-center justify-center w-full space-x-4">
          <div className="flex flex-col items-center justify-center">
            <button
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              onClick={increment}
            >
              <ChevronUpIcon className="w-6 h-6" />
            </button>

            <p className="text-3xl font-bold">{currentValue}</p>

            <button
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              onClick={decrement}
            >
              <ChevronDownIcon className="w-6 h-6" />
            </button>
          </div>

          <p className="text-2xl font-bold">일</p>
        </div>
      </div>
    </div>
  )
}
