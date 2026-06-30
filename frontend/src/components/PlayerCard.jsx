import { motion } from 'framer-motion'
import '../styles/player-card.css'

export default function PlayerCard({ player, team, rank, highlight }) {
  return (
    <motion.div
      className={`player-card ${highlight ? 'highlight' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: (rank || 0) * 0.04 }}
    >
      {rank !== undefined && (
        <div className="player-rank display">{String(rank).padStart(2, '0')}</div>
      )}
      <div className="player-avatar" style={{ background: team?.color || '#1A2038' }}>
        <span className="player-emoji">{player.image}</span>
      </div>
      <div className="player-info">
        <div className="player-name-row">
          <span className="player-name display">{player.name}</span>
          <span className="player-position">{player.position}</span>
        </div>
        <div className="player-team-line">
          <span className="player-team-dot" style={{ background: team?.color }} />
          <span className="player-team">{team?.name || player.team}</span>
          <span className="player-age">· age {player.age}</span>
        </div>
      </div>
      <div className="player-stats">
        <div className="stat">
          <span className="stat-value display">{player.goals}</span>
          <span className="stat-label">goals</span>
        </div>
        <div className="stat">
          <span className="stat-value display">{player.assists}</span>
          <span className="stat-label">assists</span>
        </div>
        <div className="stat rating">
          <span className="stat-value display">{player.rating.toFixed(1)}</span>
          <span className="stat-label">rating</span>
        </div>
      </div>
    </motion.div>
  )
}
