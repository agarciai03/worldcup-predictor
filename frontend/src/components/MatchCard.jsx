import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/match-card.css'

function formatKickoff(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function MatchCard({ match, featured = false, index = 0 }) {
  const { home_team, away_team, prediction, watchability, stage, venue, kickoff, status, id } = match
  const tierClass = watchability.tier.toLowerCase().replace(' ', '-')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link to={`/match/${id}`} className={`match-card ${featured ? 'featured' : ''}`}>
        <div className="match-card-head">
          <div className="match-card-meta">
            <span className="tag">{stage}</span>
            {status === 'live' && <span className="tag tag-vermillion"><span className="live-dot" /> LIVE</span>}
          </div>
          <div className={`watch-badge ${tierClass}`}>
            <span className="watch-score">{watchability.score}</span>
            <span className="watch-tier">{watchability.tier}</span>
          </div>
        </div>

        <div className="match-card-body">
          <div className="team-row">
            <div className="team-side">
              <div className="team-flag" style={{ background: home_team.color }}>{home_team.id}</div>
              <div className="team-info">
                <span className="team-name display">{home_team.name}</span>
                <span className="team-rank">#{home_team.fifa_rank} FIFA</span>
              </div>
            </div>
            <div className="score-block">
              <span className="score-number display">{prediction.predicted_score.home}</span>
              <span className="score-divider">·</span>
              <span className="score-number display">{prediction.predicted_score.away}</span>
            </div>
            <div className="team-side reverse">
              <div className="team-info right">
                <span className="team-name display">{away_team.name}</span>
                <span className="team-rank">#{away_team.fifa_rank} FIFA</span>
              </div>
              <div className="team-flag" style={{ background: away_team.color }}>{away_team.id}</div>
            </div>
          </div>

          <div className="probability-strip">
            <div className="prob-segment home" style={{ width: `${prediction.home_win * 100}%` }}>
              <span>{(prediction.home_win * 100).toFixed(0)}%</span>
            </div>
            <div className="prob-segment draw" style={{ width: `${prediction.draw * 100}%` }}>
              <span>{(prediction.draw * 100).toFixed(0)}%</span>
            </div>
            <div className="prob-segment away" style={{ width: `${prediction.away_win * 100}%` }}>
              <span>{(prediction.away_win * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="match-card-foot">
          <span className="foot-item">{formatKickoff(kickoff)}</span>
          <span className="foot-dot">·</span>
          <span className="foot-item">{venue}</span>
        </div>
      </Link>
    </motion.div>
  )
}
