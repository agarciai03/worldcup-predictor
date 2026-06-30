import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/navbar.css'

export default function Navbar() {
  const loc = useLocation()
  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/matches', label: 'Matches' },
    { to: '/players', label: 'Players' },
    { to: '/simulator', label: 'Simulator' },
  ]
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand">
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="9" fill="none" stroke="#C4FF3D" strokeWidth="2.5" />
            <path d="M16 7 L18 14 L25 14 L19.5 18 L21.5 25 L16 21 L10.5 25 L12.5 18 L7 14 L14 14 Z" fill="#C4FF3D" />
          </svg>
          <div className="brand-text">
            <span className="brand-name display">STADIUM</span>
            <span className="brand-sub">watch party predictor</span>
          </div>
        </Link>
        <nav className="nav-links">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end={link.to === '/'}>
              {link.label}
              {loc.pathname === link.to && (
                <motion.div layoutId="nav-underline" className="nav-underline" />
              )}
            </NavLink>
          ))}
        </nav>
        <div className="nav-live">
          <span className="live-dot" />
          <span className="nav-live-text">LIVE NOW · 1 MATCH</span>
        </div>
      </div>
    </header>
  )
}
