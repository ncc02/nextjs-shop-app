import clsx from 'clsx'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

interface PaginationProps {
  max: number
  current: number
  onNext: () => void
  onPrev: () => void
  className?: string
}

const Pagination = ({ max = 2, current = 1, onNext, onPrev, className }: PaginationProps) => {
  const next = () => {
    if (current === max) return

    onNext()
  }

  const prev = () => {
    if (current === 1) return

    onPrev()
  }

  return (
    <div className={clsx('flex items-center justify-center gap-8 w-full', className)}>
      <button
        onClick={prev}
        disabled={current === 1}
        className={clsx(current === 1 && 'text-gray-500')}
      >
        <FaArrowLeft strokeWidth={2} className="h-4 w-4" />
      </button>
      <p color="gray" className="font-normal">
        Page <strong className="text-gray-900">{current}</strong> of{' '}
        <strong className="text-gray-900">{max}</strong>
      </p>
      <button
        onClick={next}
        disabled={current === max}
        className={clsx(current === max && 'text-gray-500')}
      >
        <FaArrowRight strokeWidth={2} className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Pagination
