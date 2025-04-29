'use client'
import Icon from '@/components/ui/icons/Icon'
import { useState } from 'react'

export default function TopAlarm() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="absolute top-4 right-4 h-14 z-50">
      <div
        className="flex items-center justify-center w-14 h-14 p-1 bg-main-yellow rounded-2xl shadow-sm cursor-pointer"
        onClick={toggleModal}
      >
        <Icon name="bell" />
      </div>

      {isModalOpen && (
        <div className="absolute top-16 right-0 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">알림</h3>
            <button onClick={toggleModal} className="text-gray-500">
              <Icon name="x" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <p className="text-gray-500 text-sm text-center py-4">새로운 알림이 없습니다</p>
          </div>
        </div>
      )}
    </div>
  )
}
