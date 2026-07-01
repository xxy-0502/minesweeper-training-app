import { Link } from 'react-router-dom'
import { difficultyProfiles } from '../data/difficulties'
import { useTrainingStore } from '../store/trainingStore'

const previewCells = Array.from({ length: 81 }, (_, index) => index)

export function GamePage() {
  const durationMinutes = useTrainingStore((state) => state.durationMinutes)
  const difficulty = useTrainingStore((state) => state.difficulty)
  const startedAt = useTrainingStore((state) => state.startedAt)
  const profile = difficultyProfiles[difficulty]

  return (
    <main className="page game-page">
      <section className="status-strip" aria-label="训练状态">
        <div>
          <span>难度</span>
          <strong>{profile.label}</strong>
        </div>
        <div>
          <span>训练时间</span>
          <strong>{durationMinutes} 分钟</strong>
        </div>
        <div>
          <span>剩余雷数</span>
          <strong>{profile.mines}</strong>
        </div>
        <div>
          <span>开始时间</span>
          <strong>
            {startedAt ? new Date(startedAt).toLocaleTimeString() : '未开始'}
          </strong>
        </div>
      </section>

      <section className="board-panel" aria-label="扫雷棋盘预览">
        <div className="board-toolbar">
          <h1>训练棋盘</h1>
          <div className="toolbar-actions">
            <button type="button">暂停</button>
            <Link className="primary-action small" to="/report">
              结束并查看报告
            </Link>
          </div>
        </div>
        <div className="board-preview" role="grid" aria-label="9 x 9 棋盘预览">
          {previewCells.map((cell) => (
            <button
              key={cell}
              className="cell"
              type="button"
              aria-label={`格子 ${cell + 1}`}
            >
              {cell % 13 === 0 ? '1' : ''}
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
