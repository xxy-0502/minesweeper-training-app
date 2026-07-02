import type { GameStatus } from '../game/types'

type ResultModalProps = {
  status: GameStatus
  message: string
  autoContinueRemaining: number | null
  onNextRound: () => void
  onReport: () => void
}

export function ResultModal({
  status,
  message,
  autoContinueRemaining,
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
        {status !== 'ended' && autoContinueRemaining !== null ? (
          <p className="result-countdown">
            {autoContinueRemaining} 秒后自动
            {status === 'won' ? '进入下一局' : '重开本局'}
          </p>
        ) : null}
      </div>
      <div className="toolbar-actions">
        {status !== 'ended' ? (
          <button type="button" onClick={onNextRound}>
            {status === 'won' ? '立即下一局' : '立即重开'}
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
