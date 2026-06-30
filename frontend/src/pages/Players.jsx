import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts'
import { api } from '../services/api'
import PlayerCard from '../components/PlayerCard'
import '../styles/players-page.css'

const SORTS = [
  { id: 'rating', label: 'Rating' },
  { id: 'goals', label: 'Goals' },
  { id: 'assists', label: 'Assists' },
  { id: 'shots', label: 'Shots' },
  { id: 'key_passes', label: 'Key passes' },
]

export default function Players() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [sort, setSort] = useState('rating')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.players(sort), api.teams()]).then(([p, t]) => {
      setPlayers(p)
      setTeams(t)
      setLoading(false)
    })
  }, [sort])

  if (loading) return <div className="container loading">Loading players…</div>

  const teamLookup = Object.fromEntries(teams.map(t => [t.id, t]))
  const top = players[0]
  const top10 = players.slice(0, 10)
  const chartData = top10.map(p => ({ name: p.name.split(' ').slice(-1)[0], value: p[sort], color: teamLookup[p.team]?.color || '#C4FF3D' }))

  return (
    <div className="container players-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="players-head"
      >
        <span className="eyebrow eyebrow-lime">Player leaderboards · {players.length} tracked</span>
        <h1 className="page-title display">Stars in <span className="accent">numbers</span></h1>
        <p className="page-lede">Tournament-wide stats, sortable. The chart updates with your selected metric.</p>
      </motion.div>

      {top && (
        <motion.div
          className="hero-player"
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="hero-player-side" style={{ background: `linear-gradient(135deg, ${teamLookup[top.team]?.color}33, transparent)` }}>
            <span className="hero-player-rank display">01</span>
            <span className="hero-player-emoji">{top.image}</span>
          </div>
          <div className="hero-player-main">
            <span className="eyebrow">Leading by {SORTS.find(s => s.id === sort).label.toLowerCase()}</span>
            <h2 className="hero-player-name display">{top.name}</h2>
            <div className="hero-player-meta">
              <span className="team-pill" style={{ background: teamLookup[top.team]?.color }}>{teamLookup[top.team]?.name}</span>
              <span className="meta-item">{top.position}</span>
              <span className="meta-item">age {top.age}</span>
            </div>
            <div className="hero-player-stats">
              <div><span className="stat-num display">{top.goals}</span><span className="stat-lbl">goals</span></div>
              <div><span className="stat-num display">{top.assists}</span><span className="stat-lbl">assists</span></div>
              <div><span className="stat-num display">{top.shots}</span><span className="stat-lbl">shots</span></div>
              <div><span className="stat-num display">{top.key_passes}</span><span className="stat-lbl">key passes</span></div>
              <div className="rating-cell"><span className="stat-num display">{top.rating.toFixed(1)}</span><span className="stat-lbl">rating</span></div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="sort-bar">
        <span className="control-label">Sort by</span>
        <div className="chip-row">
          {SORTS.map(s => (
            <button key={s.id} className={`chip ${sort === s.id ? 'active' : ''}`} onClick={() => setSort(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="players-grid">
        <div className="leaderboard">
          {players.map((p, i) => (
            <PlayerCard key={p.id} player={p} team={teamLookup[p.team]} rank={i + 1} highlight={i === 0} />
          ))}
        </div>

        <div className="chart-panel">
          <div className="chart-head">
            <span className="eyebrow">Top 10 · {SORTS.find(s => s.id === sort).label}</span>
            <h3 className="chart-title display">Visual <span className="accent">ranking</span></h3>
          </div>
          <ResponsiveContainer width="100%" height={460}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
              <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#F5F1E8', fontSize: 12, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                cursor={{ fill: 'rgba(196, 255, 61, 0.06)' }}
                contentStyle={{ background: '#12172A', border: '1px solid rgba(245,241,232,0.1)', borderRadius: 2, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                labelStyle={{ color: '#F5F1E8' }}
                itemStyle={{ color: '#C4FF3D' }}
              />
              <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
