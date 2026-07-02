import { useEffect, useRef } from 'react'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer])

type ReportChartsProps = {
  perSecondActions: number[]
  correctCount: number
  mistakes: number
}

type ActionPoint = {
  second: number
  value: number
}

export function ReportCharts(props: ReportChartsProps) {
  const actionsChartRef = useRef<HTMLDivElement | null>(null)
  const summaryChartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!actionsChartRef.current) {
      return
    }

    const chart = echarts.init(actionsChartRef.current)
    const actionSeries = buildActionSeries(props.perSecondActions)
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
        name: '秒',
        data: actionSeries.map((item) => `${item.second + 1}`),
      },
      yAxis: {
        type: 'value',
        name: '次数',
        minInterval: 1,
      },
      series: [
        {
          name: '完成次数',
          type: 'bar',
          data: actionSeries.map((item) => item.value),
          itemStyle: {
            color: '#2f80ed',
            borderRadius: [6, 6, 0, 0],
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
  }, [props.perSecondActions])

  useEffect(() => {
    if (!summaryChartRef.current) {
      return
    }

    const chart = echarts.init(summaryChartRef.current)
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
        data: ['正确数量', '错误数量'],
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: [
            {
              value: props.correctCount,
              itemStyle: { color: '#16a34a' },
            },
            {
              value: props.mistakes,
              itemStyle: { color: '#dc2626' },
            },
          ],
          itemStyle: {
            borderRadius: [6, 6, 0, 0],
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
  }, [props.correctCount, props.mistakes])

  return (
    <div className="report-chart-grid">
      <section className="chart-card" aria-label="每秒完成次数图表">
        <h2>每秒完成次数柱形图</h2>
        <div className="chart-canvas" ref={actionsChartRef} />
      </section>
      <section className="chart-card" aria-label="正确错误对比图表">
        <h2>正确错误对比</h2>
        <div className="chart-canvas" ref={summaryChartRef} />
      </section>
    </div>
  )
}

export default ReportCharts

function buildActionSeries(values: number[]): ActionPoint[] {
  const lastActiveSecond = values.reduce((lastIndex, value, index) => {
    return value > 0 ? index : lastIndex
  }, -1)

  if (lastActiveSecond === -1) {
    return Array.from({ length: 6 }, (_, index) => ({
      second: index,
      value: 0,
    }))
  }

  return values
    .slice(0, Math.min(lastActiveSecond + 1, 30))
    .map((value, index) => ({
      second: index,
      value: value ?? 0,
    }))
}
