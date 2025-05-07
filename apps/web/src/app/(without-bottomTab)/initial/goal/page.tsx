'use client'
import Card_Haru from '@/components/ui/Haru/Card'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
export default function GoalPage() {
  const [goalDate, setGoalDate] = useState<number>(7)
  const [isClicked, setIsClicked] = useState<boolean>(false)
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center -space-y-8">
        <Image src="/images/haru.png" alt="initial" width={208} height={208} className="z-10" />
        <div className={`w-full ${isClicked ? 'hidden' : 'visible'}`}>
          <Card_Haru
            text={
              <p>
                내가 그리는 나의 모습,
                <br /> 하루잇 일기장에 남겨볼까요?
              </p>
            }
          />
        </div>
        <div
          className={`flex items-center text-center justify-center py-20 px-4 bg-white w-full rounded-3xl shadow-lg transition-all duration-300 ${
            isClicked ? 'mt-0' : 'mt-20'
          }`}
          style={{ whiteSpace: 'pre-line' }}
        >
          <div className="text-xl font-bold">
            저는{' '}
            <button
              onClick={() => setIsClicked(!isClicked)}
              className="w-16 text-gray-300 text-sm border-b-2 border-black"
            >
              입력
            </button>{' '}
            일 동안 <br />
            <NumberPicker goalDate={goalDate} setGoalDate={setGoalDate} />
            루틴에 도전해볼게요.
          </div>
        </div>
      </div>
    </>
  )
}

function NumberPicker({
  goalDate,
  setGoalDate,
  minValue = 1,
  maxValue = 31,
}: {
  goalDate: number
  setGoalDate: (value: number) => void
  minValue?: number
  maxValue?: number
}) {
  const [isClicked, setIsClicked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentValue, setCurrentValue] = useState(goalDate)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollSpeed = useRef(0)

  // Update internal state when prop changes
  useEffect(() => {
    setCurrentValue(goalDate)
  }, [goalDate])

  // Handle increment and decrement
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
    (e: any) => {
      e.preventDefault()

      // Calculate scroll speed based on deltaY
      scrollSpeed.current = Math.min(Math.abs(e.deltaY) / 10, 5)

      if (e.deltaY < 0) {
        increment()
      } else {
        decrement()
      }

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set momentum scrolling
      const momentumScroll = () => {
        if (scrollSpeed.current > 0.5) {
          if (e.deltaY < 0) {
            increment()
          } else {
            decrement()
          }

          scrollSpeed.current *= 0.85 // Decrease speed gradually
          scrollTimeout.current = setTimeout(momentumScroll, 150 / scrollSpeed.current)
        }
      }

      scrollTimeout.current = setTimeout(momentumScroll, 150)
    },
    [increment, decrement],
  )

  // Add and remove wheel event listener
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

  // Handle mouse/touch events for drag functionality
  const handleMouseDown = (e: any) => {
    setIsClicked(true)
    setStartY(e.clientY || (e.touches && e.touches[0].clientY) || 0)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchmove', handleMouseMove)
    document.addEventListener('touchend', handleMouseUp)
  }

  const handleMouseMove = (e: any) => {
    if (isClicked) {
      setIsDragging(true)
      const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0
      const diff = startY - currentY

      // Adjust sensitivity - change number for faster/slower response
      if (Math.abs(diff) > 5) {
        if (diff > 0) {
          increment()
        } else {
          decrement()
        }
        setStartY(currentY)
      }
    }
  }

  const handleMouseUp = () => {
    setIsClicked(false)
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchmove', handleMouseMove)
    document.removeEventListener('touchend', handleMouseUp)
  }

  return (
    <div className="w-40 aspect-square p-2">
      <div
        ref={containerRef}
        className={`flex items-center justify-center shadow-lg rounded-lg p-2 select-none
          ${isDragging ? 'bg-gray-100' : 'bg-white'} 
          ${isClicked ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="flex-1 h-full gap-2 flex flex-col items-center justify-center">
          <ChevronUpIcon className="w-6 h-6 hover:bg-gray-100 rounded-full p-1 cursor-pointer" onClick={increment} />
          <p className="text-2xl font-bold">{currentValue}</p>
          <ChevronDownIcon className="w-6 h-6 hover:bg-gray-100 rounded-full p-1 cursor-pointer" onClick={decrement} />
        </div>
        <p className="text-2xl font-bold">일</p>
      </div>
    </div>
  )
}
