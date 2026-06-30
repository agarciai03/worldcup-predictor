STAGE_WEIGHT = {
    "Group A": 0.7, "Group B": 0.7, "Group C": 0.7, "Group D": 0.7,
    "Group E": 0.7, "Group F": 0.7, "Group G": 0.7, "Group H": 0.7,
    "Round of 16": 0.85,
    "Quarter-final": 0.92,
    "Semi-final": 0.97,
    "Final": 1.0,
}


def watchability_score(prediction, home, away, match):
    p_home = prediction["home_win"]
    p_draw = prediction["draw"]
    p_away = prediction["away_win"]
    uncertainty = 1 - max(p_home, p_draw, p_away)
    competitive = uncertainty * 100
    hg = prediction["expected_score"]["home"]
    ag = prediction["expected_score"]["away"]
    goal_excitement = min(100, (hg + ag) * 22)
    star_quality = (home["attack"] + away["attack"]) / 2
    stage_factor = STAGE_WEIGHT.get(match["stage"], 0.7) * 100
    rivalry = 100 if (home["id"], away["id"]) in RIVALRIES or (away["id"], home["id"]) in RIVALRIES else 60
    raw = (
        competitive * 0.28
        + goal_excitement * 0.22
        + star_quality * 0.18
        + stage_factor * 0.22
        + rivalry * 0.10
    )
    score = round(min(100, raw), 1)
    tier = "MUST WATCH" if score >= 82 else "RECOMMENDED" if score >= 70 else "OPTIONAL" if score >= 58 else "BACKGROUND"
    return {
        "score": score,
        "tier": tier,
        "breakdown": {
            "competitiveness": round(competitive, 1),
            "goal_potential": round(goal_excitement, 1),
            "star_power": round(star_quality, 1),
            "stage_weight": round(stage_factor, 1),
            "rivalry": rivalry,
        },
    }


RIVALRIES = {
    ("ARG", "BRA"), ("ENG", "GER"), ("ESP", "POR"), ("FRA", "ENG"),
    ("NED", "GER"), ("ITA", "FRA"), ("MEX", "USA"), ("ARG", "ENG"),
}
