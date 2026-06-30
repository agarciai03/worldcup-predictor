from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from data import TEAMS, PLAYERS, MATCHES, get_team, get_player, get_match, players_of_team
from ml_predictor import MatchPredictor
from watchability import watchability_score

app = FastAPI(title="World Cup Watch Party Predictor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = MatchPredictor()


def enrich_match(match):
    home = get_team(match["home"])
    away = get_team(match["away"])
    prediction = predictor.predict(home, away)
    watch = watchability_score(prediction, home, away, match)
    return {
        **match,
        "home_team": home,
        "away_team": away,
        "prediction": prediction,
        "watchability": watch,
    }


@app.get("/")
def root():
    return {"name": "World Cup Watch Party Predictor", "status": "online", "version": "1.0.0"}


@app.get("/api/teams")
def list_teams():
    return TEAMS


@app.get("/api/teams/{team_id}")
def team_detail(team_id: str):
    team = get_team(team_id)
    if not team:
        raise HTTPException(404, "Team not found")
    return {**team, "players": players_of_team(team_id)}


@app.get("/api/players")
def list_players(sort_by: str = "rating"):
    valid = {"rating", "goals", "assists", "shots", "key_passes"}
    key = sort_by if sort_by in valid else "rating"
    return sorted(PLAYERS, key=lambda p: p[key], reverse=True)


@app.get("/api/players/{player_id}")
def player_detail(player_id: str):
    player = get_player(player_id)
    if not player:
        raise HTTPException(404, "Player not found")
    return {**player, "team_info": get_team(player["team"])}


@app.get("/api/matches")
def list_matches():
    return [enrich_match(m) for m in MATCHES]


@app.get("/api/matches/{match_id}")
def match_detail(match_id: str):
    match = get_match(match_id)
    if not match:
        raise HTTPException(404, "Match not found")
    enriched = enrich_match(match)
    enriched["home_squad"] = players_of_team(match["home"])
    enriched["away_squad"] = players_of_team(match["away"])
    return enriched


@app.get("/api/recommendations")
def recommendations(limit: int = 5):
    enriched = [enrich_match(m) for m in MATCHES]
    ranked = sorted(enriched, key=lambda m: m["watchability"]["score"], reverse=True)
    return ranked[:limit]


@app.post("/api/predict")
def custom_predict(payload: dict):
    home_id = payload.get("home")
    away_id = payload.get("away")
    home = get_team(home_id)
    away = get_team(away_id)
    if not home or not away:
        raise HTTPException(400, "Invalid team ids")
    if home_id == away_id:
        raise HTTPException(400, "Teams must be different")
    fake_match = {"id": "custom", "home": home_id, "away": away_id, "stage": payload.get("stage", "Group A"), "venue": "Simulator", "kickoff": "", "status": "simulation"}
    prediction = predictor.predict(home, away)
    watch = watchability_score(prediction, home, away, fake_match)
    return {
        "home_team": home,
        "away_team": away,
        "prediction": prediction,
        "watchability": watch,
    }


@app.get("/api/stats/summary")
def stats_summary():
    total_goals = sum(p["goals"] for p in PLAYERS)
    total_assists = sum(p["assists"] for p in PLAYERS)
    top_scorer = max(PLAYERS, key=lambda p: p["goals"])
    top_assister = max(PLAYERS, key=lambda p: p["assists"])
    top_rated = max(PLAYERS, key=lambda p: p["rating"])
    return {
        "teams_count": len(TEAMS),
        "players_tracked": len(PLAYERS),
        "matches_scheduled": len(MATCHES),
        "total_goals": total_goals,
        "total_assists": total_assists,
        "top_scorer": top_scorer,
        "top_assister": top_assister,
        "top_rated": top_rated,
    }
