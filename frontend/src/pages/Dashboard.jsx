import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import MatchCard from '../components/MatchCard'
import '../styles/dashboard.css'

function Counter({ target, duration = 1.6 }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / (duration * 1000), 1)
      setValue(Math.floor(target * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return <span>{value}</span>
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recs, setRecs] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.summary(), api.recommendations(4), api.matches()])
      .then(([s, r, m]) => {
        setSummary(s)
        setRecs(r)
        setMatches(m)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="container loading">Loading tournament data…</div>

  const featured = recs[0]
  const others = recs.slice(1)

  return (
    <div className="dashboard">
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              >
                <span className="eyebrow eyebrow-lime">Edition 2026 · Live model output</span>
              </motion.div>
              <motion.h1
                className="hero-title display"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              >
                Never miss<br />the <span className="accent">match</span><br />that matters.
              </motion.h1>
              <motion.p
                className="hero-lede"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              >
                A Random Forest scores every fixture on competitiveness, goals, star power, stage weight and rivalry — then ranks the schedule by what's actually worth watching live.
              </motion.p>
              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
              >
                <Link to="/matches" className="btn">See all matches →</Link>
                <Link to="/simulator" className="btn btn-ghost">Run a simulation</Link>
              </motion.div>
            </div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="stat-block">
                <span className="eyebrow">Teams</span>
                <span className="stat-big display"><Counter target={summary.teams_count} /></span>
              </div>
              <div className="stat-block">
                <span className="eyebrow">Players tracked</span>
                <span className="stat-big display"><Counter target={summary.players_tracked} /></span>
              </div>
              <div className="stat-block">
                <span className="eyebrow">Fixtures predicted</span>
                <span className="stat-big display"><Counter target={summary.matches_scheduled} /></span>
              </div>
              <div className="stat-block accent">
                <span className="eyebrow eyebrow-lime">Tracked goals</span>
                <span className="stat-big display"><Counter target={summary.total_goals} /></span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hero-ticker">
          <div className="ticker-track">
            {[...matches, ...matches].slice(0, 16).map((m, i) => (
              <span className="ticker-item" key={i}>
                <span className="ticker-team">{m.home_team.id}</span>
                <span className="ticker-vs">vs</span>
                <span className="ticker-team">{m.away_team.id}</span>
                <span className="ticker-dot">·</span>
                <span className="ticker-stage">{m.stage}</span>
                <span className="ticker-sep">———</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="container featured-section">
          <div className="section-head">
            <div>
              <span className="eyebrow eyebrow-lime">Match of the moment</span>
              <h2 className="section-title">Match <span className="accent">No. 01</span></h2>
            </div>
            <span className="tag tag-lime">{featured.watchability.tier}</span>
          </div>
          <MatchCard match={featured} featured index={0} />
        </section>
      )}

      <section className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Ranked by watchability</span>
            <h2 className="section-title">Tonight's <span className="accent">picks</span></h2>
          </div>
          <Link to="/matches" className="see-all">View all →</Link>
        </div>
        <div className="cards-grid">
          {others.map((m, i) => <MatchCard match={m} index={i} key={m.id} />)}
        </div>
      </section>

      <div className="divider container" />

      <section className="container top-performers">
        <div className="section-head">
          <div>
            <span className="eyebrow">Tournament leaders</span>
            <h2 className="section-title">Top <span className="accent">performers</span></h2>
          </div>
          <Link to="/players" className="see-all">All players →</Link>
        </div>
        <div className="performers-grid">
          <div className="performer-card">
            <span className="performer-label">Top scorer</span>
            <span className="performer-emoji">{summary.top_scorer.image}</span>
            <span className="performer-name display">{summary.top_scorer.name}</span>
            <div className="performer-stat">
              <span className="performer-stat-num display">{summary.top_scorer.goals}</span>
              <span className="performer-stat-label">goals</span>
            </div>
          </div>
          <div className="performer-card">
            <span className="performer-label">Top assister</span>
            <span className="performer-emoji">{summary.top_assister.image}</span>
            <span className="performer-name display">{summary.top_assister.name}</span>
            <div className="performer-stat">
              <span className="performer-stat-num display">{summary.top_assister.assists}</span>
              <span className="performer-stat-label">assists</span>
            </div>
          </div>
          <div className="performer-card highlight">
            <span className="performer-label">Highest rated</span>
            <span className="performer-emoji">{summary.top_rated.image}</span>
            <span className="performer-name display">{summary.top_rated.name}</span>
            <div className="performer-stat">
              <span className="performer-stat-num display">{summary.top_rated.rating.toFixed(1)}</span>
              <span className="performer-stat-label">avg rating</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
