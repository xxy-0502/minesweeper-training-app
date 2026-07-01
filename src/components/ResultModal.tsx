import type { GameStatus } from '../game/types'

type ResultModalProps = {
  status: GameStatus
  message: string
  onNextRound: () => void
  onReport: () => void
}

export function ResultModal({
  status,
  message,
  onNextRound,
  onReport,
}: ResultModalProps) {
  if (!['won', 'lost', 'ended'].includes(status)) {
    return null
  }

  return (
    <div className="result-panel" role="status">
      <div>
        <h2>{getTitle(status)}</h2>
        <p>{message}</p>
      </div>
      <div className="toolbar-actions">
        {status !== 'ended' ? (
          <button type="button" onClick={onNextRound}>
            重新开始本局
          </button>
        ) : null}
        <button
          className="primary-action small"
          type="button"
          onClick={onReport}
        >
          查看报告
        </button>
      </div>
    </div>
  )
}

function getTitle(status: GameStatus) {
  if (status === 'won') return '本局胜利'
  if (status === 'lost') return '本局失败'
  return '训练结束'
}
