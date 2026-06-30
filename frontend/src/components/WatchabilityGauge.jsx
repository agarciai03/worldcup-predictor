import { motion } from 'framer-motion'
import '../styles/watchability-gauge.css'

export default function WatchabilityGauge({ data }) {
  const { score, tier, breakdown } = data
  const circumference = 2 * Math.PI * 90
  const offset = circumference - (score / 100) * circumference
  const tierClass = tier.toLowerCase().replace(' ', '-')

  const bars = [
    { label: 'Competitiveness', value: breakdown.competitiveness, color: '#C4FF3D' },
    { label: 'Goal Potential', value: breakdown.goal_potential, color: '#C4FF3D' },
    { label: 'Star Power', value: breakdown.star_power, color: '#FF3E2E' },
    { label: 'Stage Weight', value: breakdown.stage_weight, color: '#C4FF3D' },
    { label: 'Rivalry', value: breakdown.rivalry, color: '#FF3E2E' },
  ]

  return (
    <div className="gauge-block">
      <div className="gauge-circle-wrap">
        <svg width="220" height="220" viewBox="0 0 220 220" className="gauge-svg">
          <defs>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4FF3D" />
              <stop offset="100%" stopColor="#FF3E2E" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(245,241,232,0.08)" strokeWidth="14" />
          <motion.circle
            cx="110" cy="110" r="90" fill="none"
            stroke="url(#gauge-grad)" strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
            transform="rotate(-90 110 110)"
          />
        </svg>
        <div className="gauge-center">
          <motion.span
            className="gauge-score display"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="gauge-out-of">/ 100</span>
          <span className={`gauge-tier ${tierClass}`}>{tier}</span>
        </div>
      </div>

      <div className="gauge-bars">
        <div className="eyebrow eyebrow-lime" style={{ marginBottom: 16 }}>Breakdown</div>
        {bars.map((b, i) => (
          <div className="gauge-bar-row" key={b.label}>
            <span className="gauge-bar-label">{b.label}</span>
            <div className="gauge-bar-track">
              <motion.div
                className="gauge-bar-fill"
                style={{ background: b.color }}
                initial={{ width: 0 }}
                animate={{ width: `${b.value}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
              />
            </div>
            <span className="gauge-bar-value">{b.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
