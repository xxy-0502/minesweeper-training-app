import type { CSSProperties } from 'react'
import { CellButton } from './CellButton'
import type { Board as GameBoard } from '../game/types'

type BoardProps = {
  board: GameBoard
  disabled: boolean
  onReveal: (row: number, col: number) => void
  onFlag: (row: number, col: number) => void
}

export function Board({ board, disabled, onReveal, onFlag }: BoardProps) {
  const cols = board[0]?.length ?? 0

  return (
    <div
      className="board"
      role="grid"
      aria-label={`${board.length} x ${cols} 扫雷棋盘`}
      style={{ '--board-cols': cols } as CSSProperties}
    >
      {board.flat().map((cell) => (
        <CellButton
          key={cell.id}
          cell={cell}
          disabled={disabled}
          onFlag={onFlag}
          onReveal={onReveal}
        />
      ))}
    </div>
  )
}
