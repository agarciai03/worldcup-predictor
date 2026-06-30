import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import WatchabilityGauge from '../components/WatchabilityGauge'
import '../styles/simulator.css'

const STAGES = ['Group A', 'Round of 16', 'Quarter-final', 'Semi-final', 'Final']

export default function Simulator() {
  const [teams, setTeams] = useState([])
  const [home, setHome] = useState('ARG')
  const [away, setAway] = useState('BRA')
  const [stage, setStage] = useState('Final')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.teams().then(setTeams) }, [])

  const runSimulation = async () => {
    if (home === away) return
    setLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 700))
    const res = await api.predict(home, away, stage)
    setResult(res)
    setLoading(false)
  }

  const homeTeam = teams.find(t => t.id === home)
  const awayTeam = teams.find(t => t.id === away)

  return (
    <div className="container simulator">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="sim-head"
      >
        <span className="eyebrow eyebrow-lime">Custom matchup simulator</span>
        <h1 className="page-title display">Pick two, <span className="accent">simulate</span>.</h1>
        <p className="page-lede">Pit any two teams against each other at any stage. The Random Forest model returns probabilities, expected scores, and a full watchability breakdown.</p>
      </motion.div>

      <div className="sim-grid">
        <div className="sim-panel">
          <span className="sim-panel-label">Home side</span>
          <div className="team-grid">
            {teams.map(t => (
              <button
                key={t.id}
                className={`team-tile ${home === t.id ? 'active' : ''} ${away === t.id ? 'disabled' : ''}`}
                onClick={() => away !== t.id && setHome(t.id)}
                disabled={away === t.id}
              >
                <span className="team-tile-flag" style={{ background: t.color }}>{t.id}</span>
                <span className="team-tile-name">{t.name}</span>
                <span className="team-tile-rank">#{t.fifa_rank}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sim-center">
          <div className="versus-display">
            {homeTeam && (
              <motion.div className="vs-team" layoutId={`vs-${home}`}>
                <span className="vs-flag" style={{ background: homeTeam.color }}>{homeTeam.id}</span>
                <span className="vs-name display">{homeTeam.name}</span>
              </motion.div>
            )}
            <span className="vs-label display">VS</span>
            {awayTeam && (
              <motion.div className="vs-team" layoutId={`vs-${away}`}>
                <span className="vs-flag" style={{ background: awayTeam.color }}>{awayTeam.id}</span>
                <span className="vs-name display">{awayTeam.name}</span>
              </motion.div>
            )}
          </div>

          <div className="stage-picker">
            <span className="control-label">Stage</span>
            <div className="chip-row">
              {STAGES.map(s => (
                <button key={s} className={`chip ${stage === s ? 'active' : ''}`} onClick={() => setStage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button className="btn sim-btn" onClick={runSimulation} disabled={home === away || loading}>
            {loading ? 'Simulating…' : 'Run simulation →'}
          </button>
        </div>

        <div className="sim-panel">
          <span className="sim-panel-label">Away side</span>
          <div className="team-grid">
            {teams.map(t => (
              <button
                key={t.id}
                className={`team-tile ${away === t.id ? 'active' : ''} ${home === t.id ? 'disabled' : ''}`}
                onClick={() => home !== t.id && setAway(t.id)}
                disabled={home === t.id}
              >
                <span className="team-tile-flag" style={{ background: t.color }}>{t.id}</span>
                <span className="team-tile-name">{t.name}</span>
                <span className="team-tile-rank">#{t.fifa_rank}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="result-section"
          >
            <div className="section-head">
              <div>
                <span className="eyebrow eyebrow-lime">Simulation result</span>
                <h2 className="section-title">The <span className="accent">forecast</span></h2>
              </div>
              <span className="tag tag-lime">{stage}</span>
            </div>

            <div className="result-scoreboard">
              <div className="result-team">
                <span className="result-flag" style={{ background: result.home_team.color }}>{result.home_team.id}</span>
                <span className="result-name display">{result.home_team.name}</span>
                <span className="result-prob">{(result.prediction.home_win * 100).toFixed(1)}%</span>
                <span className="result-label">win probability</span>
              </div>

              <div className="result-score-block">
                <span className="result-score display">{result.prediction.predicted_score.home}</span>
                <span className="result-score-divider">·</span>
                <span className="result-score display">{result.prediction.predicted_score.away}</span>
                <span className="result-expected">expected {result.prediction.expected_score.home.toFixed(2)} — {result.prediction.expected_score.away.toFixed(2)}</span>
                <span className="result-draw">draw {(result.prediction.draw * 100).toFixed(1)}%</span>
              </div>

              <div className="result-team">
                <span className="result-flag" style={{ background: result.away_team.color }}>{result.away_team.id}</span>
                <span className="result-name display">{result.away_team.name}</span>
                <span className="result-prob">{(result.prediction.away_win * 100).toFixed(1)}%</span>
                <span className="result-label">win probability</span>
              </div>
            </div>

            <WatchabilityGauge data={result.watchability} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
