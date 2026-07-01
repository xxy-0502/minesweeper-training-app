import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Board } from '../components/Board'
import { ResultModal } from '../components/ResultModal'
import { StatusBar } from '../components/StatusBar'
import { difficultyProfiles } from '../data/difficulties'
import { useGameStore } from '../store/gameStore'
import { useTrainingStore } from '../store/trainingStore'

export function GamePage() {
  const navigate = useNavigate()
  const trainingDuration = useTrainingStore((state) => state.durationMinutes)
  const trainingDifficulty = useTrainingStore((state) => state.difficulty)
  const trainingStartedAt = useTrainingStore((state) => state.startedAt)
  const board = useGameStore((state) => state.board)
  const status = useGameStore((state) => state.status)
  const config = useGameStore((state) => state.config)
  const remainingSeconds = useGameStore((state) => state.remainingSeconds)
  const flagCount = useGameStore((state) => state.flagCount)
  const resultMessage = useGameStore((state) => state.resultMessage)
  const stats = useGameStore((state) => state.stats)
  const prepareGame = useGameStore((state) => state.prepareGame)
  const revealAt = useGameStore((state) => state.revealAt)
  const toggleFlagAt = useGameStore((state) => state.toggleFlagAt)
  const restartRound = useGameStore((state) => state.restartRound)
  const pause = useGameStore((state) => state.pause)
  const resume = useGameStore((state) => state.resume)
  const tick = useGameStore((state) => state.tick)
  const endTraining = useGameStore((state) => state.endTraining)
  const profile = difficultyProfiles[config.difficulty]

  useEffect(() => {
    if (!trainingStartedAt) {
      const startedAt = new Date().toISOString()
      prepareGame(
        {
          durationMinutes: trainingDuration,
          difficulty: trainingDifficulty,
        },
        startedAt,
      )
    }
  }, [prepareGame, trainingDifficulty, trainingDuration, trainingStartedAt])

  useEffect(() => {
    const timer = window.setInterval(() => {
      tick()
    }, 1000)
    return () => window.clearInterval(timer)
  }, [tick])

  useEffect(() => {
    if (status === 'ended') {
      navigate('/report')
    }
  }, [navigate, status])

  const isBoardDisabled = ['paused', 'won', 'lost', 'ended'].includes(status)

  return (
    <main className="page game-page">
      <StatusBar
        difficulty={config.difficulty}
        durationMinutes={config.durationMinutes}
        flagCount={flagCount}
        remainingSeconds={remainingSeconds}
        score={stats.score}
        status={status}
      />

      <section className="board-panel" aria-label="扫雷棋盘">
        <div className="board-toolbar">
          <div>
            <h1>训练棋盘</h1>
            <p>
              {profile.cols} x {profile.rows}，共 {profile.mines}{' '}
              个雷。点击翻开，右键或长按插旗。
            </p>
          </div>
          <div className="toolbar-actions">
            {status === 'paused' ? (
              <button type="button" onClick={resume}>
                继续
              </button>
            ) : (
              <button type="button" onClick={pause}>
                暂停
              </button>
            )}
            <button
              className="primary-action small"
              type="button"
              onClick={endTraining}
            >
              结束并查看报告
            </button>
          </div>
        </div>
        {resultMessage && !['won', 'lost', 'ended'].includes(status) ? (
          <p className="game-message">{resultMessage}</p>
        ) : null}
        <Board
          board={board}
          disabled={isBoardDisabled}
          onFlag={toggleFlagAt}
          onReveal={revealAt}
        />
      </section>

      <ResultModal
        message={resultMessage}
        status={status}
        onNextRound={restartRound}
        onReport={() => navigate('/report')}
      />
    </main>
  )
}
