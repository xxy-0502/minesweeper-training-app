import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { ConfigPage } from './pages/ConfigPage'
import { GamePage } from './pages/GamePage'
import { ReportPage } from './pages/ReportPage'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand" to="/">
          扫雷康复训练
        </NavLink>
        <nav aria-label="主导航">
          <NavLink to="/">配置</NavLink>
          <NavLink to="/game">游戏</NavLink>
          <NavLink to="/report">报告</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ConfigPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </div>
  )
}

export default App
