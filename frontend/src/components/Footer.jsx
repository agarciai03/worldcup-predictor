import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-brand display">STADIUM</div>
          <p className="footer-sub">A watch party predictor for the 2026 World Cup.</p>
        </div>
        <div className="footer-col">
          <span className="footer-label">Stack</span>
          <ul>
            <li>FastAPI · Python</li>
            <li>scikit-learn · RandomForest</li>
            <li>React · Vite</li>
            <li>Framer Motion · Recharts</li>
          </ul>
        </div>
        <div className="footer-col">
          <span className="footer-label">Built by</span>
          <ul>
            <li><a href="https://github.com/agarciai03" target="_blank" rel="noopener noreferrer">github.com/agarciai03</a></li>
            <li><a href="https://linkedin.com/in/alberto-garcia-izquierdo" target="_blank" rel="noopener noreferrer">linkedin.com/in/alberto-garcia-izquierdo</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <span className="footer-label">Model</span>
          <ul>
            <li>Synthetic training set · 2000 matches</li>
            <li>Outcome · classification</li>
            <li>Score · gradient boosting</li>
            <li>Watchability · weighted score</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>© 2026 Stadium · Portfolio project</span>
        <span className="footer-tag">Built for portfolio · Mérida, Spain</span>
      </div>
    </footer>
  )
}
