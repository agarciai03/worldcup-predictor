import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../services/api'
import MatchCard from '../components/MatchCard'
import '../styles/matches-page.css'

const STAGES = ['All', 'Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Round of 16', 'Quarter-final', 'Semi-final']
const SORT_OPTIONS = [
  { id: 'watchability', label: 'Watchability' },
  { id: 'kickoff', label: 'Kickoff time' },
  { id: 'competitiveness', label: 'Competitiveness' },
]

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [stage, setStage] = useState('All')
  const [sort, setSort] = useState('watchability')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.matches().then(m => { setMatches(m); setLoading(false) })
  }, [])

  let filtered = matches.filter(m => stage === 'All' || m.stage === stage || (stage.startsWith('Group') && m.stage === stage))
  if (sort === 'watchability') filtered = [...filtered].sort((a, b) => b.watchability.score - a.watchability.score)
  if (sort === 'kickoff') filtered = [...filtered].sort((a, b) => new Date(a.kickoff) - new Date(b.kickoff))
  if (sort === 'competitiveness') filtered = [...filtered].sort((a, b) => b.watchability.breakdown.competitiveness - a.watchability.breakdown.competitiveness)

  if (loading) return <div className="container loading">Loading fixtures…</div>

  return (
    <div className="container matches-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="matches-head"
      >
        <span className="eyebrow eyebrow-lime">All fixtures · {filtered.length} matches</span>
        <h1 className="page-title display">The <span className="accent">schedule</span></h1>
        <p className="page-lede">Every fixture, scored and ranked. Filter by stage, sort by what matters to you.</p>
      </motion.div>

      <div className="controls">
        <div className="control-group">
          <span className="control-label">Stage</span>
          <div className="chip-row">
            {STAGES.map(s => (
              <button key={s} className={`chip ${stage === s ? 'active' : ''}`} onClick={() => setStage(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">Sort by</span>
          <div className="chip-row">
            {SORT_OPTIONS.map(s => (
              <button key={s.id} className={`chip ${sort === s.id ? 'active' : ''}`} onClick={() => setSort(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="matches-grid">
        {filtered.map((m, i) => <MatchCard match={m} index={i} key={m.id} />)}
      </div>

      {filtered.length === 0 && (
        <div className="empty">No fixtures match this filter. Reset stage to "All".</div>
      )}
    </div>
  )
}
