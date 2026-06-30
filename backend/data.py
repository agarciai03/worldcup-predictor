from datetime import datetime, timedelta

TEAMS = [
    {"id": "ARG", "name": "Argentina", "fifa_rank": 1, "attack": 92, "defense": 86, "midfield": 89, "form": 0.85, "star_player": "Lionel Messi", "color": "#75AADB", "group": "A"},
    {"id": "FRA", "name": "France", "fifa_rank": 2, "attack": 94, "defense": 87, "midfield": 88, "form": 0.82, "star_player": "Kylian Mbappé", "color": "#0055A4", "group": "B"},
    {"id": "BRA", "name": "Brazil", "fifa_rank": 3, "attack": 95, "defense": 84, "midfield": 91, "form": 0.78, "star_player": "Vinícius Jr.", "color": "#FEDF00", "group": "C"},
    {"id": "ENG", "name": "England", "fifa_rank": 4, "attack": 90, "defense": 88, "midfield": 87, "form": 0.80, "star_player": "Jude Bellingham", "color": "#C8102E", "group": "D"},
    {"id": "ESP", "name": "Spain", "fifa_rank": 5, "attack": 89, "defense": 85, "midfield": 92, "form": 0.88, "star_player": "Lamine Yamal", "color": "#AA151B", "group": "A"},
    {"id": "POR", "name": "Portugal", "fifa_rank": 6, "attack": 91, "defense": 83, "midfield": 86, "form": 0.81, "star_player": "Cristiano Ronaldo", "color": "#046A38", "group": "B"},
    {"id": "NED", "name": "Netherlands", "fifa_rank": 7, "attack": 87, "defense": 86, "midfield": 85, "form": 0.76, "star_player": "Cody Gakpo", "color": "#FF6B35", "group": "C"},
    {"id": "BEL", "name": "Belgium", "fifa_rank": 8, "attack": 86, "defense": 84, "midfield": 87, "form": 0.72, "star_player": "Kevin De Bruyne", "color": "#FFD100", "group": "D"},
    {"id": "GER", "name": "Germany", "fifa_rank": 9, "attack": 88, "defense": 85, "midfield": 88, "form": 0.79, "star_player": "Florian Wirtz", "color": "#000000", "group": "E"},
    {"id": "ITA", "name": "Italy", "fifa_rank": 10, "attack": 84, "defense": 89, "midfield": 86, "form": 0.74, "star_player": "Federico Chiesa", "color": "#0064B0", "group": "F"},
    {"id": "CRO", "name": "Croatia", "fifa_rank": 11, "attack": 83, "defense": 82, "midfield": 90, "form": 0.71, "star_player": "Luka Modrić", "color": "#FF0000", "group": "E"},
    {"id": "URU", "name": "Uruguay", "fifa_rank": 12, "attack": 85, "defense": 83, "midfield": 84, "form": 0.77, "star_player": "Darwin Núñez", "color": "#5CBFEB", "group": "F"},
    {"id": "MAR", "name": "Morocco", "fifa_rank": 13, "attack": 82, "defense": 87, "midfield": 83, "form": 0.83, "star_player": "Achraf Hakimi", "color": "#C1272D", "group": "G"},
    {"id": "USA", "name": "USA", "fifa_rank": 14, "attack": 81, "defense": 80, "midfield": 82, "form": 0.75, "star_player": "Christian Pulisic", "color": "#3C3B6E", "group": "G"},
    {"id": "MEX", "name": "Mexico", "fifa_rank": 15, "attack": 80, "defense": 79, "midfield": 81, "form": 0.68, "star_player": "Santiago Giménez", "color": "#006847", "group": "H"},
    {"id": "JPN", "name": "Japan", "fifa_rank": 16, "attack": 82, "defense": 82, "midfield": 84, "form": 0.79, "star_player": "Takefusa Kubo", "color": "#BC002D", "group": "H"},
]

PLAYERS = [
    {"id": "p1", "name": "Lionel Messi", "team": "ARG", "position": "FW", "goals": 8, "assists": 6, "rating": 9.4, "shots": 32, "key_passes": 28, "age": 38, "image": "🐐"},
    {"id": "p2", "name": "Kylian Mbappé", "team": "FRA", "position": "FW", "goals": 9, "assists": 4, "rating": 9.2, "shots": 38, "key_passes": 19, "age": 27, "image": "⚡"},
    {"id": "p3", "name": "Vinícius Jr.", "team": "BRA", "position": "FW", "goals": 7, "assists": 5, "rating": 9.0, "shots": 29, "key_passes": 22, "age": 26, "image": "🔥"},
    {"id": "p4", "name": "Jude Bellingham", "team": "ENG", "position": "MF", "goals": 5, "assists": 7, "rating": 9.1, "shots": 21, "key_passes": 31, "age": 23, "image": "👑"},
    {"id": "p5", "name": "Lamine Yamal", "team": "ESP", "position": "FW", "goals": 6, "assists": 8, "rating": 9.3, "shots": 24, "key_passes": 34, "age": 19, "image": "💫"},
    {"id": "p6", "name": "Cristiano Ronaldo", "team": "POR", "position": "FW", "goals": 7, "assists": 2, "rating": 8.7, "shots": 41, "key_passes": 12, "age": 41, "image": "🏆"},
    {"id": "p7", "name": "Erling Haaland", "team": "NED", "position": "FW", "goals": 8, "assists": 3, "rating": 9.0, "shots": 36, "key_passes": 14, "age": 26, "image": "🤖"},
    {"id": "p8", "name": "Kevin De Bruyne", "team": "BEL", "position": "MF", "goals": 3, "assists": 9, "rating": 8.9, "shots": 18, "key_passes": 42, "age": 35, "image": "🎯"},
    {"id": "p9", "name": "Florian Wirtz", "team": "GER", "position": "MF", "goals": 4, "assists": 7, "rating": 8.8, "shots": 22, "key_passes": 29, "age": 23, "image": "✨"},
    {"id": "p10", "name": "Luka Modrić", "team": "CRO", "position": "MF", "goals": 2, "assists": 5, "rating": 8.6, "shots": 14, "key_passes": 33, "age": 40, "image": "🧙"},
    {"id": "p11", "name": "Darwin Núñez", "team": "URU", "position": "FW", "goals": 6, "assists": 2, "rating": 8.4, "shots": 35, "key_passes": 9, "age": 27, "image": "🦅"},
    {"id": "p12", "name": "Achraf Hakimi", "team": "MAR", "position": "DF", "goals": 3, "assists": 5, "rating": 8.7, "shots": 16, "key_passes": 24, "age": 28, "image": "🛡️"},
    {"id": "p13", "name": "Christian Pulisic", "team": "USA", "position": "FW", "goals": 5, "assists": 4, "rating": 8.3, "shots": 23, "key_passes": 18, "age": 28, "image": "🌟"},
    {"id": "p14", "name": "Takefusa Kubo", "team": "JPN", "position": "MF", "goals": 4, "assists": 6, "rating": 8.5, "shots": 19, "key_passes": 26, "age": 25, "image": "🥷"},
    {"id": "p15", "name": "Federico Chiesa", "team": "ITA", "position": "FW", "goals": 4, "assists": 3, "rating": 8.4, "shots": 25, "key_passes": 17, "age": 29, "image": "⚔️"},
    {"id": "p16", "name": "Cody Gakpo", "team": "NED", "position": "FW", "goals": 5, "assists": 4, "rating": 8.5, "shots": 27, "key_passes": 16, "age": 27, "image": "🌪️"},
]

def _generate_matches():
    base = datetime(2026, 6, 30, 18, 0)
    pairs = [
        ("ARG", "ESP", "Group A", "MetLife Stadium"),
        ("BRA", "NED", "Group C", "Estadio Azteca"),
        ("FRA", "POR", "Group B", "SoFi Stadium"),
        ("ENG", "GER", "Round of 16", "BMO Field"),
        ("ITA", "CRO", "Group E", "Lumen Field"),
        ("MAR", "USA", "Group G", "Levi's Stadium"),
        ("JPN", "MEX", "Group H", "Estadio BBVA"),
        ("URU", "BEL", "Group F", "Hard Rock Stadium"),
        ("ESP", "POR", "Round of 16", "Gillette Stadium"),
        ("ARG", "BRA", "Quarter-final", "MetLife Stadium"),
        ("FRA", "ENG", "Semi-final", "AT&T Stadium"),
        ("GER", "NED", "Quarter-final", "Mercedes-Benz Stadium"),
    ]
    out = []
    for i, (home, away, stage, venue) in enumerate(pairs):
        kickoff = base + timedelta(days=i // 2, hours=(i % 2) * 3)
        out.append({
            "id": f"m{i+1}",
            "home": home,
            "away": away,
            "stage": stage,
            "venue": venue,
            "kickoff": kickoff.isoformat(),
            "status": "upcoming" if i > 1 else "live" if i == 0 else "soon",
        })
    return out

MATCHES = _generate_matches()

def get_team(team_id):
    return next((t for t in TEAMS if t["id"] == team_id), None)

def get_player(player_id):
    return next((p for p in PLAYERS if p["id"] == player_id), None)

def get_match(match_id):
    return next((m for m in MATCHES if m["id"] == match_id), None)

def players_of_team(team_id):
    return [p for p in PLAYERS if p["team"] == team_id]
