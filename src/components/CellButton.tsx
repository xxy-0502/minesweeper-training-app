import { useRef } from 'react'
import type { MouseEvent } from 'react'
import type { Cell } from '../game/types'

type CellButtonProps = {
  cell: Cell
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
}

export function CellButton({
  cell,
  disabled,
  onReveal,
  onFlag,
}: CellButtonProps) {
  const longPressTimer = useRef<number | null>(null)
  const longPressTriggered = useRef(false)

  function clearLongPressTimer() {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function handlePointerDown() {
    if (disabled || cell.isRevealed) {
      return
    }

    longPressTriggered.current = false
    clearLongPressTimer()
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true
      onFlag(cell.row, cell.col)
    }, 450)
  }

  function handlePointerUp() {
    clearLongPressTimer()
  }

  function handleClick() {
    if (disabled || longPressTriggered.current) {
      longPressTriggered.current = false
      return
    }

    onReveal(cell.row, cell.col)
  }

  function handleContextMenu(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if (!disabled) {
      onFlag(cell.row, cell.col)
    }
  }

  return (
    <button
      className={getCellClassName(cell)}
      type="button"
      aria-label={`第 ${cell.row + 1} 行第 ${cell.col + 1} 列`}
      disabled={disabled && !cell.isRevealed}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onPointerCancel={clearLongPressTimer}
      onPointerDown={handlePointerDown}
      onPointerLeave={clearLongPressTimer}
      onPointerUp={handlePointerUp}
    >
      {getCellContent(cell)}
    </button>
  )
}

function getCellContent(cell: Cell) {
  if (cell.isFlagged && !cell.isRevealed) {
    return 'F'
  }

  if (!cell.isRevealed) {
    return ''
  }

  if (cell.isMine) {
    return '*'
  }

  return cell.adjacentMines === 0 ? '' : cell.adjacentMines
}

function getCellClassName(cell: Cell) {
  const classNames = ['cell']
  if (cell.isRevealed) classNames.push('revealed')
  if (cell.isFlagged) classNames.push('flagged')
  if (cell.isMine && cell.isRevealed) classNames.push('mine')
  if (cell.isRevealed && cell.adjacentMines > 0) {
    classNames.push(`number-${cell.adjacentMines}`)
  }
  return classNames.join(' ')
}
