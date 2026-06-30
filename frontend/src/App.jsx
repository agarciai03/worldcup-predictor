import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Matches from './pages/Matches'
import MatchDetail from './pages/MatchDetail'
import Players from './pages/Players'
import Simulator from './pages/Simulator'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/players" element={<Players />} />
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
