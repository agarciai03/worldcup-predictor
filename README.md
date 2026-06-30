# World Cup Watch Party Predictor

Predictive analytics app for the 2026 World Cup. Combines a scikit-learn match outcome model, a watchability scoring engine, and a tournament simulator behind a modern editorial UI.

**Aesthetic:** Stadium Under Lights — deep navy stage, lime-acid accent, vermillion alert, bone typography. Inspired by sports broadcast graphics and editorial sports magazines.

## Stack

**Backend** — Python 3.10+, FastAPI, scikit-learn, NumPy, Pandas
**Frontend** — React 18, Vite, React Router, Framer Motion, Recharts

## Structure

```
worldcup-predictor/
├── backend/
│   ├── main.py              FastAPI app + endpoints
│   ├── ml_predictor.py      RandomForest + GradientBoosting models
│   ├── watchability.py      Watchability scoring engine
│   ├── data.py              Teams, players, fixtures
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/           Dashboard, Matches, MatchDetail, Players, Simulator
    │   ├── components/      Navbar, MatchCard, WatchabilityGauge, PlayerCard, Footer
    │   ├── services/        API client with automatic mock fallback
    │   ├── data/            Mock data mirror (for standalone frontend demo)
    │   └── styles/          CSS modules
    └── package.json
```

## Running the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/teams` | All 16 teams |
| GET | `/api/teams/{id}` | Single team |
| GET | `/api/players?sort_by=rating` | Sortable player list |
| GET | `/api/players/{id}` | Single player |
| GET | `/api/matches` | All fixtures with predictions |
| GET | `/api/matches/{id}` | Match detail with full prediction |
| GET | `/api/recommendations?limit=5` | Top watchability picks |
| POST | `/api/predict` | Custom match simulation |
| GET | `/api/stats/summary` | Tournament-wide stats |

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` and proxies `/api/*` to the backend. **The frontend includes a complete mock-data fallback** — if the backend is offline, every page still renders with predictions computed in the browser.

## ML model

`MatchPredictor` trains on 2000 synthetic samples derived from team rating differentials, form, and stage weighting. It exposes three model heads:

- **Outcome** — `RandomForestClassifier(140)` returns win/draw/loss probabilities.
- **Home goals / Away goals** — two `GradientBoostingRegressor` heads return expected scores, post-processed with Poisson noise for realism.

## Watchability score

Composite 0–100 score per match:

| Component | Weight |
|-----------|--------|
| Competitiveness (closer odds = higher) | 28% |
| Goal potential | 22% |
| Star power (top-rated players on the pitch) | 18% |
| Stage weight (knockout > group) | 22% |
| Rivalry bonus | 10% |

Tiers: **MUST WATCH** ≥ 82, **RECOMMENDED** ≥ 70, **OPTIONAL** ≥ 58, otherwise **BACKGROUND**.

## Author

**Alberto García Izquierdo**
[GitHub](https://github.com/agarciai03) · [LinkedIn](https://linkedin.com/in/alberto-garcia-izquierdo)
