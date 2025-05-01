import { format, formatDistance } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 날짜를 상대적 시간으로 변환 (예: "3일 전")
 */
export const formatRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistance(dateObj, new Date(), {
    addSuffix: true,
    locale: ko,
  })
}

/**
 * 날짜를 "YYYY.MM.DD HH:MM" 형식으로 변환
 */
export const formatDateTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'yyyy.MM.dd HH:mm', { locale: ko })
}
