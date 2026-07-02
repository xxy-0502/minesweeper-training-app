import { useEffect, useRef } from 'react'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { difficultyProfiles } from '../game/difficulty'
import { getAverageReactionMs } from '../game/statistics'
import type { TrainingReportSnapshot } from '../types/report'

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

type ReportHistoryProps = {
  history: TrainingReportSnapshot[]
}

export function ReportHistory({ history }: ReportHistoryProps) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const sortedHistory = [...history].reverse()
  const recentHistory = history.slice(0, 8)

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const chart = echarts.init(chartRef.current)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 32,
        left: 42,
        right: 18,
        bottom: 38,
      },
      xAxis: {
        type: 'category',
        name: '次数',
        data: sortedHistory.map((_, index) => `第 ${index + 1} 次`),
      },
      yAxis: {
        type: 'value',
        name: '分数',
      },
      series: [
        {
          name: '训练分数',
          type: 'line',
          smooth: true,
          symbolSize: 8,
          data: sortedHistory.map((report) => report.stats.score),
          lineStyle: {
            color: '#0f5bd7',
            width: 3,
          },
          itemStyle: {
            color: '#0f5bd7',
          },
          areaStyle: {
            color: 'rgba(47, 128, 237, 0.12)',
          },
        },
      ],
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [sortedHistory])

  if (history.length === 0) {
    return (
      <section className="chart-card history-section">
        <h2>历史水平</h2>
        <p className="empty-state">完成训练后会在这里显示历史分数趋势。</p>
      </section>
    )
  }

  return (
    <section className="chart-card history-section">
      <div className="history-header">
        <div>
          <h2>历史水平</h2>
          <p>通过最近训练分数变化观察训练表现是否提升。</p>
        </div>
        <strong>{history.length} 次记录</strong>
      </div>

      <div className="chart-canvas" ref={chartRef} />

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>结束时间</th>
              <th>难度</th>
              <th>分数</th>
              <th>总题数</th>
              <th>正确</th>
              <th>错误</th>
              <th>平均反应</th>
            </tr>
          </thead>
          <tbody>
            {recentHistory.map((report) => (
              <tr key={`${report.sessionEndedAt}-${report.stats.totalActions}`}>
                <td>{formatDateTime(report.sessionEndedAt)}</td>
                <td>{difficultyProfiles[report.difficulty].label}</td>
                <td>{report.stats.score}</td>
                <td>{report.stats.totalActions}</td>
                <td>
                  {report.stats.safeReveals + (report.stats.correctFlags ?? 0)}
                </td>
                <td>{report.stats.mistakes}</td>
                <td>{formatReactionTime(report)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ReportHistory

function formatDateTime(value: string | null) {
  return value ? new Date(value).toLocaleString() : '未记录'
}

function formatReactionTime(report: TrainingReportSnapshot) {
  const averageReactionMs = getAverageReactionMs(report.stats)
  return averageReactionMs ? `${averageReactionMs} ms` : '暂无数据'
}
