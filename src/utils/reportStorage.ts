import type { TrainingReportSnapshot } from '../types/report'

const LATEST_REPORT_KEY = 'minesweeper-training-app/latest-report'
const REPORT_HISTORY_KEY = 'minesweeper-training-app/report-history'
const maxHistoryCount = 30

export function saveLatestReport(report: TrainingReportSnapshot) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LATEST_REPORT_KEY, JSON.stringify(report))
  const history = loadReportHistory()
  const nextHistory = [report, ...history].slice(0, maxHistoryCount)
  window.localStorage.setItem(REPORT_HISTORY_KEY, JSON.stringify(nextHistory))
}

export function loadLatestReport() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(LATEST_REPORT_KEY)
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as TrainingReportSnapshot
  } catch {
    return null
  }
}

export function loadReportHistory() {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(REPORT_HISTORY_KEY)
  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue)
      ? (parsedValue as TrainingReportSnapshot[])
      : []
  } catch {
    return []
  }
}
