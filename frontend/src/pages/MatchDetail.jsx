import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { api } from '../services/api'
import WatchabilityGauge from '../components/WatchabilityGauge'
import '../styles/match-detail.css'

function formatKickoff(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function MatchDetail() {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.match(id).then(m => { setMatch(m); setLoading(false) })
  }, [id])

  if (loading || !match) return <div className="container loading">Loading match…</div>

  const { home_team, away_team, prediction, watchability, stage, venue, kickoff, home_squad, away_squad } = match

  const radarData = [
    { stat: 'Attack', home: home_team.attack, away: away_team.attack },
    { stat: 'Defense', home: home_team.defense, away: away_team.defense },
    { stat: 'Midfield', home: home_team.midfield, away: away_team.midfield },
    { stat: 'Form', home: home_team.form * 100, away: away_team.form * 100 },
    { stat: 'Ranking', home: 100 - home_team.fifa_rank * 2, away: 100 - away_team.fifa_rank * 2 },
  ]

  return (
    <div className="match-detail">
      <div className="container">
        <Link to="/matches" className="back-link">← back to fixtures</Link>

        <motion.div
          className="md-hero"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          <div className="md-hero-tags">
            <span className="tag tag-lime">{stage}</span>
            <span className="tag">{venue}</span>
            <span className="tag">{formatKickoff(kickoff)}</span>
          </div>

          <div className="md-versus">
            <motion.div
              className="md-team md-team-home"
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="md-flag" style={{ background: home_team.color }}>{home_team.id}</div>
              <span className="md-team-name display">{home_team.name}</span>
              <span className="md-team-star">★ {home_team.star_player}</span>
            </motion.div>

            <motion.div
              className="md-scoreboard"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="md-score-side">
                <span className="md-score display">{prediction.predicted_score.home}</span>
                <span className="md-score-prob">{(prediction.home_win * 100).toFixed(0)}% win</span>
              </div>
              <div className="md-score-mid">
                <span className="md-score-vs display">VS</span>
                <span className="md-score-prob">{(prediction.draw * 100).toFixed(0)}% draw</span>
              </div>
              <div className="md-score-side">
                <span className="md-score display">{prediction.predicted_score.away}</span>
                <span className="md-score-prob">{(prediction.away_win * 100).toFixed(0)}% win</span>
              </div>
            </motion.div>

            <motion.div
              className="md-team md-team-away"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="md-flag" style={{ background: away_team.color }}>{away_team.id}</div>
              <span className="md-team-name display">{away_team.name}</span>
              <span className="md-team-star">★ {away_team.star_player}</span>
            </motion.div>
          </div>

          <div className="md-prob-bar">
            <div className="md-prob-fill home" style={{ width: `${prediction.home_win * 100}%` }}>
              <span>{home_team.id} {(prediction.home_win * 100).toFixed(0)}%</span>
            </div>
            <div className="md-prob-fill draw" style={{ width: `${prediction.draw * 100}%` }}>
              <span>DRAW {(prediction.draw * 100).toFixed(0)}%</span>
            </div>
            <div className="md-prob-fill away" style={{ width: `${prediction.away_win * 100}%` }}>
              <span>{away_team.id} {(prediction.away_win * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="md-expected">
            <span className="eyebrow">Expected scoreline</span>
            <span className="md-expected-score display">
              {prediction.expected_score.home.toFixed(2)} <span className="md-expected-vs">—</span> {prediction.expected_score.away.toFixed(2)}
            </span>
            <span className="md-expected-note">based on attack vs defense rating distribution</span>
          </div>
        </motion.div>

        <section className="md-section">
          <div className="section-head">
            <div>
              <span className="eyebrow eyebrow-lime">Should you watch this</span>
              <h2 className="section-title">Watch <span className="accent">score</span></h2>
            </div>
          </div>
          <WatchabilityGauge data={watchability} />
        </section>

        <section className="md-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Side by side</span>
              <h2 className="section-title">Team <span className="accent">profile</span></h2>
            </div>
          </div>
          <div className="md-radar-wrap">
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart data={radarData} outerRadius="78%">
                <PolarGrid stroke="rgba(245, 241, 232, 0.12)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: '#F5F1E8', fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                <Radar name={home_team.name} dataKey="home" stroke="#C4FF3D" fill="#C4FF3D" fillOpacity={0.3} strokeWidth={2} />
                <Radar name={away_team.name} dataKey="away" stroke="#FF3E2E" fill="#FF3E2E" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="md-radar-legend">
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: '#C4FF3D' }} />
                <span className="legend-label">{home_team.name}</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: '#FF3E2E' }} />
                <span className="legend-label">{away_team.name}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="md-section">
          <div className="section-head">
            <div>
              <span className="eyebrow">Key players</span>
              <h2 className="section-title">Squads to <span className="accent">watch</span></h2>
            </div>
          </div>
          <div className="squads-grid">
            <div className="squad-col">
              <div className="squad-head" style={{ borderColor: home_team.color }}>
                <span className="squad-flag" style={{ background: home_team.color }}>{home_team.id}</span>
                <span className="squad-name display">{home_team.name}</span>
              </div>
              {home_squad.map(p => (
                <div className="squad-row" key={p.id}>
                  <span className="squad-emoji">{p.image}</span>
                  <div className="squad-info">
                    <span className="squad-player">{p.name}</span>
                    <span className="squad-meta">{p.position} · age {p.age}</span>
                  </div>
                  <div className="squad-stats">
                    <span>{p.goals}G</span>
                    <span>{p.assists}A</span>
                    <span className="rating">{p.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="squad-col">
              <div className="squad-head" style={{ borderColor: away_team.color }}>
                <span className="squad-flag" style={{ background: away_team.color }}>{away_team.id}</span>
                <span className="squad-name display">{away_team.name}</span>
              </div>
              {away_squad.map(p => (
                <div className="squad-row" key={p.id}>
                  <span className="squad-emoji">{p.image}</span>
                  <div className="squad-info">
                    <span className="squad-player">{p.name}</span>
                    <span className="squad-meta">{p.position} · age {p.age}</span>
                  </div>
                  <div className="squad-stats">
                    <span>{p.goals}G</span>
                    <span>{p.assists}A</span>
                    <span className="rating">{p.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
