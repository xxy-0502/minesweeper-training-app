import { Link } from 'react-router-dom'
import { difficultyProfiles } from '../game/difficulty'
import { getAverageReactionMs } from '../game/statistics'
import { useGameStore } from '../store/gameStore'
import { useTrainingStore } from '../store/trainingStore'

export function ReportPage() {
  const durationMinutes = useTrainingStore((state) => state.durationMinutes)
  const difficulty = useTrainingStore((state) => state.difficulty)
  const startedAt = useTrainingStore((state) => state.startedAt)
  const config = useGameStore((state) => state.config)
  const sessionStartedAt = useGameStore((state) => state.sessionStartedAt)
  const sessionEndedAt = useGameStore((state) => state.sessionEndedAt)
  const stats = useGameStore((state) => state.stats)
  const reportDifficulty = config.difficulty ?? difficulty
  const reportDuration = config.durationMinutes || durationMinutes
  const reportStartedAt = sessionStartedAt ?? startedAt
  const averageReactionMs = getAverageReactionMs(stats)
  const chartValues = getChartValues(stats.perSecondActions)
  const maxChartValue = Math.max(1, ...chartValues)
  const profile = difficultyProfiles[reportDifficulty]

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
          <strong>{reportDuration} 分钟</strong>
        </article>
        <article>
          <span>开始时间</span>
          <strong>
            {reportStartedAt
              ? new Date(reportStartedAt).toLocaleString()
              : '未记录'}
          </strong>
        </article>
        <article>
          <span>结束时间</span>
          <strong>
            {sessionEndedAt
              ? new Date(sessionEndedAt).toLocaleString()
              : '进行中'}
          </strong>
        </article>
        <article>
          <span>分数</span>
          <strong>{stats.score}</strong>
        </article>
        <article>
          <span>总题数</span>
          <strong>{stats.wins + stats.losses}</strong>
        </article>
        <article>
          <span>平均反应时间</span>
          <strong>
            {averageReactionMs ? `${averageReactionMs} ms` : '暂无数据'}
          </strong>
        </article>
        <article>
          <span>正确数量</span>
          <strong>{stats.safeReveals}</strong>
        </article>
        <article>
          <span>错误数量</span>
          <strong>{stats.mistakes}</strong>
        </article>
      </section>

      <section className="chart-placeholder" aria-label="每秒完成次数图表">
        <h2>每秒完成次数柱形图</h2>
        <div className="bar-row">
          {chartValues.map((value, index) => (
            <span
              key={index}
              aria-label={`第 ${index + 1} 秒 ${value} 次`}
              style={{
                height: `${Math.max(8, (value / maxChartValue) * 100)}%`,
              }}
              title={`${index + 1}s: ${value}`}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

function getChartValues(values: number[]) {
  if (values.length === 0) {
    return [0, 0, 0, 0, 0, 0]
  }

  return values.slice(0, 30)
}
