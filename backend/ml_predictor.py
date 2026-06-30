import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import random

random.seed(42)
np.random.seed(42)


def _synthetic_training_set(n=2000):
    X = []
    y_outcome = []
    y_home_goals = []
    y_away_goals = []
    for _ in range(n):
        h_atk = np.random.uniform(70, 96)
        h_def = np.random.uniform(70, 92)
        h_mid = np.random.uniform(70, 94)
        h_form = np.random.uniform(0.5, 0.95)
        h_rank = np.random.uniform(1, 50)
        a_atk = np.random.uniform(70, 96)
        a_def = np.random.uniform(70, 92)
        a_mid = np.random.uniform(70, 94)
        a_form = np.random.uniform(0.5, 0.95)
        a_rank = np.random.uniform(1, 50)
        home_strength = (h_atk * 0.35 + h_mid * 0.3 + h_def * 0.35) * h_form + (50 - h_rank) * 0.3 + 3
        away_strength = (a_atk * 0.35 + a_mid * 0.3 + a_def * 0.35) * a_form + (50 - a_rank) * 0.3
        diff = home_strength - away_strength
        noise = np.random.normal(0, 4)
        outcome_score = diff + noise
        if outcome_score > 5:
            outcome = 0
        elif outcome_score < -5:
            outcome = 2
        else:
            outcome = 1
        hg = max(0, int(np.random.poisson(max(0.5, (h_atk - a_def) / 18 + 1.2))))
        ag = max(0, int(np.random.poisson(max(0.5, (a_atk - h_def) / 18 + 1.0))))
        X.append([h_atk, h_def, h_mid, h_form, h_rank, a_atk, a_def, a_mid, a_form, a_rank])
        y_outcome.append(outcome)
        y_home_goals.append(hg)
        y_away_goals.append(ag)
    return np.array(X), np.array(y_outcome), np.array(y_home_goals), np.array(y_away_goals)


class MatchPredictor:
    def __init__(self):
        X, y_out, y_hg, y_ag = _synthetic_training_set()
        self.scaler = StandardScaler().fit(X)
        Xs = self.scaler.transform(X)
        self.outcome_model = RandomForestClassifier(n_estimators=140, max_depth=10, random_state=42).fit(Xs, y_out)
        self.home_goal_model = GradientBoostingRegressor(n_estimators=120, max_depth=4, random_state=42).fit(Xs, y_hg)
        self.away_goal_model = GradientBoostingRegressor(n_estimators=120, max_depth=4, random_state=42).fit(Xs, y_ag)

    def _features(self, home, away):
        return np.array([[
            home["attack"], home["defense"], home["midfield"], home["form"], home["fifa_rank"],
            away["attack"], away["defense"], away["midfield"], away["form"], away["fifa_rank"],
        ]])

    def predict(self, home, away):
        X = self.scaler.transform(self._features(home, away))
        probs = self.outcome_model.predict_proba(X)[0]
        hg = float(self.home_goal_model.predict(X)[0])
        ag = float(self.away_goal_model.predict(X)[0])
        classes = list(self.outcome_model.classes_)
        p_home = float(probs[classes.index(0)]) if 0 in classes else 0.0
        p_draw = float(probs[classes.index(1)]) if 1 in classes else 0.0
        p_away = float(probs[classes.index(2)]) if 2 in classes else 0.0
        return {
            "home_win": round(p_home, 4),
            "draw": round(p_draw, 4),
            "away_win": round(p_away, 4),
            "expected_score": {"home": round(hg, 2), "away": round(ag, 2)},
            "predicted_score": {"home": int(round(hg)), "away": int(round(ag))},
        }
