import { Link } from 'react-router-dom'
import { difficultyProfiles } from '../data/difficulties'
import { useTrainingStore } from '../store/trainingStore'

export function ReportPage() {
  const durationMinutes = useTrainingStore((state) => state.durationMinutes)
  const difficulty = useTrainingStore((state) => state.difficulty)
  const startedAt = useTrainingStore((state) => state.startedAt)
  const profile = difficultyProfiles[difficulty]

  return (
    <main className="page">
      <section className="report-header">
        <div>
          <p className="eyebrow">Training Report</p>
          <h1>训练报告</h1>
        </div>
        <Link className="primary-action small" to="/">
          返回配置
        </Link>
      </section>

      <section className="metric-grid" aria-label="训练指标">
        <article>
          <span>训练名称</span>
          <strong>扫雷康复训练</strong>
        </article>
        <article>
          <span>训练难度</span>
          <strong>{profile.label}</strong>
        </article>
        <article>
          <span>训练时间</span>
          <strong>{durationMinutes} 分钟</strong>
        </article>
        <article>
          <span>开始时间</span>
          <strong>
            {startedAt ? new Date(startedAt).toLocaleString() : '未记录'}
          </strong>
        </article>
      </section>

      <section className="chart-placeholder" aria-label="报告图表占位">
        <h2>每秒完成次数柱形图</h2>
        <div className="bar-row">
          {[40, 64, 52, 74, 48, 68].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>
    </main>
  )
}
