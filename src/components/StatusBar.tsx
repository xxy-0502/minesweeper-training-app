import { difficultyProfiles } from '../game/difficulty'
import type { GameStatus } from '../game/types'
import type { Difficulty } from '../types/training'

type StatusBarProps = {
  difficulty: Difficulty
  durationMinutes: number
  remainingSeconds: number
  flagCount: number
  score: number
  status: GameStatus
}

export function StatusBar({
  difficulty,
  durationMinutes,
  remainingSeconds,
  flagCount,
  score,
  status,
}: StatusBarProps) {
  const profile = difficultyProfiles[difficulty]

  return (
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
        <span>剩余时间</span>
        <strong>{formatSeconds(remainingSeconds)}</strong>
      </div>
      <div>
        <span>剩余雷数</span>
        <strong>{Math.max(0, profile.mines - flagCount)}</strong>
      </div>
      <div>
        <span>当前分数</span>
        <strong>{score}</strong>
      </div>
      <div>
        <span>状态</span>
        <strong>{getStatusLabel(status)}</strong>
      </div>
    </section>
  )
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function getStatusLabel(status: GameStatus) {
  const labels: Record<GameStatus, string> = {
    ready: '准备',
    playing: '进行中',
    paused: '暂停',
    won: '胜利',
    lost: '失败',
    ended: '结束',
  }
  return labels[status]
}
