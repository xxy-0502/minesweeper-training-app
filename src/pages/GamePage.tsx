import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Board } from '../components/Board'
import { InfoModal } from '../components/InfoModal'
import { ResultModal } from '../components/ResultModal'
import { StatusBar } from '../components/StatusBar'
import { difficultyProfiles } from '../data/difficulties'
import { useGameStore } from '../store/gameStore'
import { useTrainingStore } from '../store/trainingStore'

const preparationLabels = ['3', '2', '1', 'Start']
const autoContinueSeconds = 2

export function GamePage() {
  const navigate = useNavigate()
  const [preparationStep, setPreparationStep] = useState(0)
  const [autoContinueRemaining, setAutoContinueRemaining] = useState<
    number | null
  >(null)
  const trainingDuration = useTrainingStore((state) => state.durationMinutes)
  const trainingDifficulty = useTrainingStore((state) => state.difficulty)
  const trainingStartedAt = useTrainingStore((state) => state.startedAt)
  const board = useGameStore((state) => state.board)
  const status = useGameStore((state) => state.status)
  const config = useGameStore((state) => state.config)
  const remainingSeconds = useGameStore((state) => state.remainingSeconds)
  const sessionStartedAt = useGameStore((state) => state.sessionStartedAt)
  const flagCount = useGameStore((state) => state.flagCount)
  const resultMessage = useGameStore((state) => state.resultMessage)
  const stats = useGameStore((state) => state.stats)
  const prepareGame = useGameStore((state) => state.prepareGame)
  const beginTraining = useGameStore((state) => state.beginTraining)
  const revealAt = useGameStore((state) => state.revealAt)
  const toggleFlagAt = useGameStore((state) => state.toggleFlagAt)
  const restartRound = useGameStore((state) => state.restartRound)
  const pause = useGameStore((state) => state.pause)
  const resume = useGameStore((state) => state.resume)
  const tick = useGameStore((state) => state.tick)
  const endTraining = useGameStore((state) => state.endTraining)
  const profile = difficultyProfiles[config.difficulty]
  const isPreparing =
    status === 'ready' && preparationStep < preparationLabels.length
  const preparationLabel = preparationLabels[preparationStep]

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
    setPreparationStep(0)
  }, [trainingStartedAt])

  useEffect(() => {
    if (!isPreparing) {
      return
    }

    const timer = window.setTimeout(() => {
      setPreparationStep((currentStep) => currentStep + 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [isPreparing, preparationStep])

  useEffect(() => {
    if (status === 'ready' && preparationStep === preparationLabels.length) {
      beginTraining()
    }
  }, [beginTraining, preparationStep, status])

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

  useEffect(() => {
    if (!['won', 'lost'].includes(status)) {
      setAutoContinueRemaining(null)
      return
    }

    setAutoContinueRemaining(autoContinueSeconds)
  }, [status])

  useEffect(() => {
    if (autoContinueRemaining === null || !['won', 'lost'].includes(status)) {
      return
    }

    if (autoContinueRemaining <= 0) {
      restartRound()
      return
    }

    const timer = window.setTimeout(() => {
      setAutoContinueRemaining((remaining) =>
        remaining === null ? null : remaining - 1,
      )
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [autoContinueRemaining, restartRound, status])

  const isBoardDisabled =
    isPreparing || ['paused', 'won', 'lost', 'ended'].includes(status)

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
              <button
                type="button"
                disabled={isPreparing || status !== 'playing'}
                onClick={pause}
              >
                暂停
              </button>
            )}
            <button
              className="primary-action small"
              type="button"
              disabled={isPreparing || !sessionStartedAt}
              onClick={endTraining}
            >
              结束并查看报告
            </button>
          </div>
        </div>
        {resultMessage && !['won', 'lost', 'ended'].includes(status) ? (
          <p className="game-message">{resultMessage}</p>
        ) : null}
        {isPreparing ? (
          <div className="preparation-panel" role="status" aria-live="polite">
            <strong>{preparationLabel}</strong>
            <span>准备开始训练</span>
          </div>
        ) : null}
        <Board
          board={board}
          disabled={isBoardDisabled}
          onFlag={toggleFlagAt}
          onReveal={revealAt}
        />
      </section>

      <ResultModal
        autoContinueRemaining={autoContinueRemaining}
        message={resultMessage}
        status={status}
        onNextRound={restartRound}
        onReport={() => navigate('/report')}
      />

      <InfoModal
        open={status === 'paused'}
        title="训练已暂停"
        primaryActionLabel="继续训练"
        onPrimaryAction={resume}
        onClose={resume}
      >
        <p>倒计时和棋盘操作已暂停，继续后将恢复本次训练。</p>
      </InfoModal>
    </main>
  )
}
