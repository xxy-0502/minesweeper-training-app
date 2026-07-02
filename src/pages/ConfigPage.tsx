import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfoModal } from '../components/InfoModal'
import { difficultyProfiles, durationOptions } from '../game/difficulty'
import { useGameStore } from '../store/gameStore'
import { useTrainingStore } from '../store/trainingStore'
import type { Difficulty } from '../types/training'

export function ConfigPage() {
  const navigate = useNavigate()
  const [showHelp, setShowHelp] = useState(false)
  const durationMinutes = useTrainingStore((state) => state.durationMinutes)
  const difficulty = useTrainingStore((state) => state.difficulty)
  const setDuration = useTrainingStore((state) => state.setDuration)
  const setDifficulty = useTrainingStore((state) => state.setDifficulty)
  const startTraining = useTrainingStore((state) => state.startTraining)
  const prepareGame = useGameStore((state) => state.prepareGame)
  const profile = difficultyProfiles[difficulty]

  function handleStart() {
    const startedAt = new Date().toISOString()
    startTraining()
    prepareGame({ durationMinutes, difficulty }, startedAt)
    navigate('/game')
  }

  return (
    <main className="page">
      <section className="intro-panel">
        <div>
          <p className="eyebrow">Minesweeper Training</p>
          <h1>扫雷康复训练游戏系统</h1>
          <p className="lead">
            选择训练时间和难度后进入 3、2、1、Start
            准备流程，完成后生成训练报告。
          </p>
        </div>
        <div className="toolbar-actions">
          <button type="button" onClick={() => setShowHelp(true)}>
            游戏说明
          </button>
          <button
            className="primary-action"
            type="button"
            onClick={handleStart}
          >
            开始训练
          </button>
        </div>
      </section>

      <section className="setup-grid" aria-label="训练配置">
        <div className="field-group">
          <label htmlFor="duration">训练时间</label>
          <select
            id="duration"
            value={durationMinutes}
            onChange={(event) => setDuration(Number(event.target.value))}
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option} 分钟
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="difficulty">训练难度</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as Difficulty)
            }
          >
            {Object.entries(difficultyProfiles).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>

        <dl className="profile-summary">
          <div>
            <dt>棋盘尺寸</dt>
            <dd>
              {profile.cols} x {profile.rows}
            </dd>
          </div>
          <div>
            <dt>地雷数量</dt>
            <dd>{profile.mines}</dd>
          </div>
          <div>
            <dt>默认规则</dt>
            <dd>点击翻开，长按插旗</dd>
          </div>
        </dl>
      </section>

      <InfoModal
        open={showHelp}
        title="游戏说明"
        primaryActionLabel="开始训练"
        onPrimaryAction={handleStart}
        onClose={() => setShowHelp(false)}
      >
        <ul className="modal-list">
          <li>左键或轻触格子可以翻开方块。</li>
          <li>右键或长按未翻开的方块可以插旗或取消插旗。</li>
          <li>数字表示周围 8 个格子中的地雷数量。</li>
          <li>翻开空白格时会自动展开相邻安全区域。</li>
          <li>踩到地雷会判定本局失败，清除全部非雷格会判定胜利。</li>
          <li>训练结束后会生成包含操作次数、反应时间和图表的报告。</li>
        </ul>
      </InfoModal>
    </main>
  )
}
