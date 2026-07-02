import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { difficultyProfiles } from '../game/difficulty'
import { getAverageReactionMs } from '../game/statistics'
import { useGameStore } from '../store/gameStore'
import { useTrainingStore } from '../store/trainingStore'
import { loadLatestReport, loadReportHistory } from '../utils/reportStorage'

const trainingName = '扫雷康复训练'
const ReportCharts = lazy(() => import('../components/ReportCharts'))
const ReportHistory = lazy(() => import('../components/ReportHistory'))

export function ReportPage() {
  const durationMinutes = useTrainingStore((state) => state.durationMinutes)
  const difficulty = useTrainingStore((state) => state.difficulty)
  const startedAt = useTrainingStore((state) => state.startedAt)
  const config = useGameStore((state) => state.config)
  const sessionStartedAt = useGameStore((state) => state.sessionStartedAt)
  const sessionEndedAt = useGameStore((state) => state.sessionEndedAt)
  const stats = useGameStore((state) => state.stats)
  const latestReport = loadLatestReport()
  const reportHistory = loadReportHistory()
  const currentReport = sessionStartedAt
    ? {
        trainingName,
        durationMinutes: config.durationMinutes,
        difficulty: config.difficulty,
        sessionStartedAt,
        sessionEndedAt,
        stats,
      }
    : null
  const report = currentReport ?? latestReport
  const reportStats = report?.stats ?? stats
  const reportDifficulty = report?.difficulty ?? config.difficulty ?? difficulty
  const reportDuration =
    report?.durationMinutes ?? config.durationMinutes ?? durationMinutes
  const reportStartedAt = report?.sessionStartedAt ?? startedAt
  const reportEndedAt = report?.sessionEndedAt ?? sessionEndedAt
  const averageReactionMs = getAverageReactionMs(reportStats)
  const correctCount = reportStats.safeReveals + (reportStats.correctFlags ?? 0)
  const mistakeCount = reportStats.mistakes
  const profile = difficultyProfiles[reportDifficulty]
  const isSavedReport = !currentReport && Boolean(latestReport)

  return (
    <main className="page">
      <section className="report-header">
        <div>
          <p className="eyebrow">Training Report</p>
          <h1>训练报告</h1>
          {isSavedReport ? (
            <p className="report-note">当前显示最近一次已保存训练记录。</p>
          ) : null}
        </div>
        <Link className="primary-action small" to="/">
          返回配置
        </Link>
      </section>

      <section className="metric-grid" aria-label="训练指标">
        <ReportMetric
          label="训练名称"
          value={report?.trainingName ?? trainingName}
        />
        <ReportMetric label="训练难度" value={profile.label} />
        <ReportMetric label="训练时间" value={`${reportDuration} 分钟`} />
        <ReportMetric
          label="开始时间"
          value={formatDateTime(reportStartedAt, '未记录')}
        />
        <ReportMetric
          label="结束时间"
          value={formatDateTime(reportEndedAt, '进行中')}
        />
        <ReportMetric label="分数" value={reportStats.score} />
        <ReportMetric label="总题数" value={reportStats.totalActions} />
        <ReportMetric
          label="平均反应时间"
          value={averageReactionMs ? `${averageReactionMs} ms` : '暂无数据'}
        />
        <ReportMetric label="正确数量" value={correctCount} />
        <ReportMetric label="错误数量" value={mistakeCount} />
      </section>

      <Suspense fallback={<p className="chart-loading">图表加载中...</p>}>
        <ReportCharts
          correctCount={correctCount}
          mistakes={mistakeCount}
          perSecondActions={reportStats.perSecondActions}
        />
      </Suspense>

      <Suspense fallback={<p className="chart-loading">历史数据加载中...</p>}>
        <ReportHistory history={reportHistory} />
      </Suspense>
    </main>
  )
}

function ReportMetric(props: { label: string; value: number | string }) {
  return (
    <article>
      <span>{props.label}</span>
      <strong>{props.value}</strong>
    </article>
  )
}

function formatDateTime(value: string | null | undefined, fallback: string) {
  if (!value) {
    return fallback
  }

  return new Date(value).toLocaleString()
}
