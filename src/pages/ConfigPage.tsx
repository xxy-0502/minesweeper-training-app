import { useNavigate } from 'react-router-dom'
import { difficultyProfiles, durationOptions } from '../data/difficulties'
import { useTrainingStore } from '../store/trainingStore'
import type { Difficulty } from '../types/training'

export function ConfigPage() {
  const navigate = useNavigate()
  const durationMinutes = useTrainingStore((state) => state.durationMinutes)
  const difficulty = useTrainingStore((state) => state.difficulty)
  const setDuration = useTrainingStore((state) => state.setDuration)
  const setDifficulty = useTrainingStore((state) => state.setDifficulty)
  const startTraining = useTrainingStore((state) => state.startTraining)
  const profile = difficultyProfiles[difficulty]

  function handleStart() {
    startTraining()
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
        <button className="primary-action" type="button" onClick={handleStart}>
          开始训练
        </button>
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
    </main>
  )
}
