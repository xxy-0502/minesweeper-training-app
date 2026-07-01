import type { Board, Cell, CellPosition } from './types'

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

export function createEmptyBoard(rows: number, cols: number): Board {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => createCell(row, col)),
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

export function placeMines(
  board: Board,
  mineCount: number,
  safePosition: CellPosition,
): Board {
  const nextBoard = cloneBoard(board).map((row) =>
    row.map((cell) => ({
      ...cell,
      isMine: false,
      adjacentMines: 0,
    })),
  )
  const rows = nextBoard.length
  const cols = nextBoard[0]?.length ?? 0
  const safeKey = positionKey(safePosition.row, safePosition.col)
  const candidates: CellPosition[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (positionKey(row, col) !== safeKey) {
        candidates.push({ row, col })
      }
    }
  }

  shuffle(candidates)
  candidates.slice(0, mineCount).forEach(({ row, col }) => {
    nextBoard[row][col].isMine = true
  })

  return calculateAdjacentMines(nextBoard)
}

export function revealAllMines(board: Board): Board {
  const nextBoard = cloneBoard(board)
  nextBoard.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.isRevealed = true
      }
    })
  })
  return nextBoard
}

export function isInsideBoard(board: Board, row: number, col: number) {
  return (
    row >= 0 && row < board.length && col >= 0 && col < (board[0]?.length ?? 0)
  )
}

function createCell(row: number, col: number): Cell {
  return {
    id: `${row}-${col}`,
    row,
    col,
    isMine: false,
    adjacentMines: 0,
    isRevealed: false,
    isFlagged: false,
  }
}

function calculateAdjacentMines(board: Board): Board {
  const nextBoard = cloneBoard(board)
  nextBoard.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.adjacentMines = 0
        return
      }

      cell.adjacentMines = neighborOffsets.reduce(
        (total, [rowOffset, colOffset]) => {
          const nextRow = cell.row + rowOffset
          const nextCol = cell.col + colOffset
          return total + (board[nextRow]?.[nextCol]?.isMine ? 1 : 0)
        },
        0,
      )
    })
  })
  return nextBoard
}

function positionKey(row: number, col: number) {
  return `${row}:${col}`
}

function shuffle(items: CellPosition[]) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = items[index]
    items[index] = items[swapIndex]
    items[swapIndex] = current
  }
}
