import { cloneBoard, isInsideBoard } from './board'
import type { Board } from './types'

const neighborOffsets = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

export function revealCell(board: Board, row: number, col: number) {
  const nextBoard = cloneBoard(board)
  const target = nextBoard[row]?.[col]

  if (!target || target.isRevealed || target.isFlagged) {
    return {
      board: nextBoard,
      revealedCount: 0,
      hitMine: false,
    }
  }

  if (target.isMine) {
    target.isRevealed = true
    return {
      board: nextBoard,
      revealedCount: 0,
      hitMine: true,
    }
  }

  const revealedCount = floodReveal(nextBoard, row, col)
  return {
    board: nextBoard,
    revealedCount,
    hitMine: false,
  }
}

function floodReveal(board: Board, startRow: number, startCol: number) {
  const queue = [{ row: startRow, col: startCol }]
  let revealedCount = 0

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || !isInsideBoard(board, current.row, current.col)) {
      continue
    }

    const cell = board[current.row][current.col]
    if (cell.isRevealed || cell.isFlagged || cell.isMine) {
      continue
    }

    cell.isRevealed = true
    revealedCount += 1

    if (cell.adjacentMines === 0) {
      neighborOffsets.forEach(([rowOffset, colOffset]) => {
        queue.push({
          row: current.row + rowOffset,
          col: current.col + colOffset,
        })
      })
    }
  }

  return revealedCount
}
