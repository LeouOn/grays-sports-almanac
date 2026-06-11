export interface SportsEvent {
  id: string;
  year: number;
  sport: 'Football' | 'Baseball' | 'Boxing' | 'Horse Racing' | 'Basketball' | 'Hockey';
  event: string;
  winner: string;
  loser: string;
  score?: string;
  odds?: string;
  notableDetails: string;
  tags?: string[];
}

export const sportsAlmanac: SportsEvent[] = [
  // ── 1950s FOOTBALL (PRE-SUPER BOWL NFL CHAMPIONSHIPS) ────
  {
    id: 'nfl-1958', year: 1958, sport: 'Football',
    event: 'NFL Championship — "The Greatest Game Ever Played"',
    winner: 'Baltimore Colts', loser: 'New York Giants',
    score: '23-17 OT', odds: 'Colts -3.5',
    notableDetails: 'First NFL game to go to overtime. Johnny Unitas engineers a legendary drive. Alan Ameche scores the winning TD. This game single-handedly popularized professional football on national TV and set the stage for the AFL-NFL merger and the Super Bowl era.'
  },
  {
    id: 'nfl-1956', year: 1956, sport: 'Football',
    event: 'NFL Championship', winner: 'New York Giants', loser: 'Chicago Bears',
    score: '47-7', odds: 'Bears slight favorites',
    notableDetails: 'Giants destroy the Bears. Frank Gifford runs for a TD, catches a TD, and throws a TD pass. The Giants\' most dominant championship performance.'
  },
  {
    id: 'nfl-1950', year: 1950, sport: 'Football',
    event: 'NFL Championship', winner: 'Cleveland Browns', loser: 'Los Angeles Rams',
    score: '30-28', odds: 'Rams -2',
    notableDetails: 'Browns\' first NFL championship after moving from the AAFC. Otto Engineers a comeback. Lou Groza kicks the winning FG with 28 seconds left. Proved AAFC teams could compete in the NFL.'
  },

  // ── 1950s BASEBALL ───────────────────────────────────────
  {
    id: 'ws-1956', year: 1956, sport: 'Baseball',
    event: 'World Series — Don Larsen\'s Perfect Game', winner: 'New York Yankees', loser: 'Brooklyn Dodgers',
    score: '4-3', odds: 'Yankees -160',
    notableDetails: 'Don Larsen throws the only perfect game in World Series history (Game 5). Yogi Berra leaps into his arms. The Yankees win the series in 7 games. The only no-hitter in postseason history until 2010.'
  },
  {
    id: 'ws-1954', year: 1954, sport: 'Baseball',
    event: 'World Series — Willie Mays\' Catch', winner: 'New York Giants', loser: 'Cleveland Indians',
    score: '4-0', odds: 'Indians -160 (won 111 games)',
    notableDetails: 'Willie Mays makes "The Catch" — an over-the-shoulder basket catch in deep center field at the Polo Grounds in Game 1. Indians won 111 regular season games (AL record at the time) but get swept.'
  },
  {
    id: 'ws-1951', year: 1951, sport: 'Baseball',
    event: 'World Series', winner: 'New York Yankees', loser: 'New York Giants',
    score: '4-2', odds: 'Yankees -200',
    notableDetails: 'The "Shot Heard Round the World" — Bobby Thomson\'s walk-off HR wins the NL pennant for the Giants over the Dodgers. Yankees then beat the Giants in the Series. Joe DiMaggio\'s final season.'
  },
  {
    id: 'ws-1955', year: 1955, sport: 'Baseball',
    event: 'World Series — Brooklyn Dodgers Finally Win', winner: 'Brooklyn Dodgers', loser: 'New York Yankees',
    score: '4-3', odds: 'Yankees -180',
    notableDetails: 'Brooklyn Dodgers win their FIRST World Series after 5 previous losses to the Yankees. Johnny Podres pitches a 2-0 shutout in Game 7. Sandy Amoros makes a game-saving catch in left field. The borough of Brooklyn erupts.'
  },
  {
    id: 'ws-1957', year: 1957, sport: 'Baseball',
    event: 'World Series — Milwaukee Braves', winner: 'Milwaukee Braves', loser: 'New York Yankees',
    score: '4-3', odds: 'Yankees -150',
    notableDetails: 'Hank Aaron hits .393 with 3 HRs. Lew Burdette wins 3 games including a Game 7 shutout on 2 days rest. The Braves\' only championship in Milwaukee.'
  },

  // ── 1950s BOXING ─────────────────────────────────────────
  {
    id: 'marciano-walcott', year: 1952, sport: 'Boxing',
    event: 'Heavyweight Championship', winner: 'Rocky Marciano', loser: 'Jersey Joe Walcott',
    score: 'KO 13th round', odds: 'Walcott -8.5',
    notableDetails: 'Marciano wins the heavyweight title with a devastating right hand that knocks Walcott unconscious against the ropes. Marciano would retire undefeated at 49-0 — the only heavyweight champ to do so.'
  },
  {
    id: 'marciano-charles', year: 1954, sport: 'Boxing',
    event: 'Heavyweight Championship', winner: 'Rocky Marciano', loser: 'Ezzard Charles',
    score: 'KO 8th round', odds: 'Marciano -300',
    notableDetails: 'Marciano retains title in rematch. Charles had pushed Marciano to the brink in their first fight (split decision). Marciano knocks him out in the rematch.'
  },
  {
    id: 'robinson-fullmer', year: 1957, sport: 'Boxing',
    event: 'World Middleweight Championship', winner: 'Sugar Ray Robinson', loser: 'Gene Fullmer',
    score: 'KO 5th round', odds: 'Fullmer slight favorite',
    notableDetails: 'Robinson reclaims the middleweight title with a perfectly timed left hook. At 36 years old, Robinson becomes a 5-time world champion — a record that still stands. Many consider Robinson the greatest pound-for-pound fighter ever.'
  },

  // ── 1950s HORSE RACING ───────────────────────────────────
  {
    id: 'citation-48', year: 1948, sport: 'Horse Racing',
    event: 'Belmont Stakes (Triple Crown)', winner: 'Citation', loser: 'Field',
    score: '11 lengths', odds: '1-20 favorite',
    notableDetails: 'Citation wins the Triple Crown. One of the greatest racehorses ever. First horse to win over $1 million in career earnings. Would be the last Triple Crown winner for 25 years until Secretariat (1973).'
  },

  // ── 1960s FOOTBALL ───────────────────────────────────────
  {
    id: 'nfl-1962', year: 1962, sport: 'Football',
    event: 'NFL Championship', winner: 'Green Bay Packers', loser: 'New York Giants',
    score: '16-7', odds: 'Packers -9',
    notableDetails: 'Vince Lombardi\'s Packers win their 2nd straight championship at Yankee Stadium in brutal cold. Jerry Kramer and Fuzzy Thurston lead the famous "Packers Sweep." The beginning of the Packers dynasty.'
  },
  {
    id: 'nfl-1967', year: 1967, sport: 'Football',
    event: 'NFL Championship — "The Ice Bowl"', winner: 'Green Bay Packers', loser: 'Dallas Cowboys',
    score: '21-17', odds: 'Packers -7',
    notableDetails: 'Played in -13°F wind chill at Lambeau Field. Bart Starr scores the winning TD on a QB sneak behind Kramer with 16 seconds left. Arguably the greatest NFL game ever played. The Packers go on to win Super Bowl II.'
  },
  {
    id: 'sb-i', year: 1967, sport: 'Football',
    event: 'Super Bowl I (AFL-NFL World Championship)', winner: 'Green Bay Packers', loser: 'Kansas City Chiefs',
    score: '35-10', odds: 'Packers -14',
    notableDetails: 'The first Super Bowl. Lombardi\'s Packers dominate. Max McGee catches 7 passes for 138 yards and 2 TDs despite being hungover — he had partied all night because he didn\'t expect to play. The game was not a sellout.'
  },
  {
    id: 'sb-iii', year: 1969, sport: 'Football',
    event: 'Super Bowl III — "The Guarantee"', winner: 'New York Jets', loser: 'Baltimore Colts',
    score: '16-7', odds: 'Colts -18',
    notableDetails: 'Joe Namath guarantees victory and delivers. The AFL\'s first Super Bowl win legitimized the merger. One of the greatest upsets in sports history. The Colts were 18-point favorites.'
  },

  // ── 1960s BASEBALL ───────────────────────────────────────
  {
    id: 'ws-1960', year: 1960, sport: 'Baseball',
    event: 'World Series — Mazeroski\'s Walk-Off', winner: 'Pittsburgh Pirates', loser: 'New York Yankees',
    score: '4-3', odds: 'Yankees -200',
    notableDetails: 'Bill Mazeroski hits a walk-off home run in Game 7 — the only Game 7 walk-off HR in World Series history. Yankees outscored the Pirates 55-27 in the series but LOST. A bizarre, thrilling upset.'
  },
  {
    id: 'ws-1961', year: 1961, sport: 'Baseball',
    event: 'World Series', winner: 'New York Yankees', loser: 'Cincinnati Reds',
    score: '4-1', odds: 'Yankees -250',
    notableDetails: 'Roger Maris hits 61 home runs during the regular season, breaking Babe Ruth\'s single-season record (with an asterisk due to the expanded 162-game schedule). Whitey Ford pitches 2 shutouts.'
  },
  {
    id: 'ws-1966', year: 1966, sport: 'Baseball',
    event: 'World Series', winner: 'Baltimore Orioles', loser: 'Los Angeles Dodgers',
    score: '4-0', odds: 'Dodgers -160',
    notableDetails: 'Orioles sweep the defending champion Dodgers. Frank Robinson wins the Triple Crown during the regular season (.316, 49 HR, 122 RBI). Jim Palmer, at 20 years old, outpitches Sandy Koufax in Game 2. Koufax\'s final season.'
  },
  {
    id: 'ws-1967', year: 1967, sport: 'Baseball',
    event: 'World Series — "Impossible Dream"', winner: 'St. Louis Cardinals', loser: 'Boston Red Sox',
    score: '4-3', odds: 'Cardinals -150',
    notableDetails: 'The Red Sox go from 9th place in 1966 to the pennant — the "Impossible Dream." But Bob Gibson dominates with 3 complete game victories (1.00 ERA, 26 Ks). Carl Yastrzemski wins the Triple Crown but loses the Series.'
  },
  {
    id: 'ws-1968', year: 1968, sport: 'Baseball',
    event: 'World Series — "The Year of the Pitcher"', winner: 'Detroit Tigers', loser: 'St. Louis Cardinals',
    score: '4-3', odds: 'Cardinals -130',
    notableDetails: 'Bob Gibson posts a 1.12 ERA during the regular season (lowest live-ball era ERA). Denny McLain wins 31 games (last 30-game winner). Mickey Lolich wins 3 games including Game 7 on 2 days rest. The "Year of the Pitcher" led directly to the lowering of the mound in 1969.'
  },

  // ── 1960s BOXING ─────────────────────────────────────────
  {
    id: 'ali-liston-1', year: 1964, sport: 'Boxing',
    event: 'Heavyweight Championship — "The Upset"', winner: 'Muhammad Ali (Cassius Clay)', loser: 'Sonny Liston',
    score: 'TKO 7th round', odds: 'Liston 7-1 favorite',
    notableDetails: '22-year-old Cassius Clay shocks the world by beating the fearsome Sonny Liston. Clay dances, jabs, and refuses to be cornered. After the fight, he announces his conversion to Islam and changes his name to Muhammad Ali. The most transformative sporting event of the 1960s.'
  },
  {
    id: 'ali-liston-2', year: 1965, sport: 'Boxing',
    event: 'Heavyweight Championship — "The Phantom Punch"', winner: 'Muhammad Ali', loser: 'Sonny Liston',
    score: 'KO 1st round (1:44)', odds: 'Ali -4',
    notableDetails: 'Ali knocks out Liston with a punch so fast that many ringside didn\'t see it. The "phantom punch" controversy persists to this day. The iconic photo of Ali standing over Liston is one of the most famous sports photos ever taken.'
  },
  {
    id: 'ali-folley', year: 1967, sport: 'Boxing',
    event: 'Heavyweight Championship', winner: 'Muhammad Ali', loser: 'Zora Folley',
    score: 'KO 7th round', odds: 'Ali -8',
    notableDetails: 'Ali\'s last fight before his 3-year exile for refusing the Vietnam draft. He was 29-0 and in his prime. He would not fight again until 1970. The Supreme Court overturned his conviction in 1971.'
  },

  // ── 1960s BASKETBALL ─────────────────────────────────────
  {
    id: 'celtics-1962', year: 1962, sport: 'Basketball',
    event: 'NBA Finals', winner: 'Boston Celtics', loser: 'Los Angeles Lakers',
    score: '4-3', odds: 'Celtics -200',
    notableDetails: 'Bill Russell grabs 40 rebounds in Game 7. Sam Jones hits the game-winning shot with 2 seconds left. Celtics win their 4th straight title. The beginning of the greatest dynasty in NBA history (8 straight championships, 11 in 13 years).'
  },
  {
    id: 'celtics-1969', year: 1969, sport: 'Basketball',
    event: 'NBA Finals', winner: 'Boston Celtics', loser: 'Los Angeles Lakers',
    score: '4-3', odds: 'Lakers -180',
    notableDetails: 'Bill Russell\'s final game. John Havlicek steals the ball in the Eastern Conference Finals ("Havlicek stole the ball!"). Celtics win Game 7 in LA despite being underdogs. Russell retires with 11 championships in 13 years. Don Nelson\'s shot bounces over the rim and in.'
  },
  {
    id: 'wilt-100', year: 1962, sport: 'Basketball',
    event: 'NBA Regular Season — Wilt Chamberlain Scores 100', winner: 'Philadelphia Warriors', loser: 'New York Knicks',
    score: '169-147', odds: 'N/A (regular season)',
    notableDetails: 'Wilt Chamberlain scores 100 points in a single game — the most unbreakable record in NBA history. He shot 36-of-63 from the field and 28-of-32 from the free throw line (career 51% FT shooter). The game was played in Hershey, PA — no TV cameras, only a few hundred fans.'
  },

  // ── 1960s HOCKEY ─────────────────────────────────────────
  {
    id: 'canadiens-1960', year: 1960, sport: 'Hockey',
    event: 'Stanley Cup Finals', winner: 'Montreal Canadiens', loser: 'Toronto Maple Leafs',
    score: '4-0', odds: 'Canadiens -200',
    notableDetails: 'Canadiens win their 5th straight Stanley Cup — still the longest consecutive championship streak in NHL history. Maurice "Rocket" Richard scores the Cup-winning goal in his final season.'
  },

  // ── 1950s/1960s SOCCER ───────────────────────────────────
  // Note: no Soccer sport type yet in schema — using Football for now
  // Skipping to avoid confusion with American Football

  // ── SUPER BOWLS ──────────────────────────────────────────
  {
    id: 'sb-iv', year: 1970, sport: 'Football',
    event: 'Super Bowl IV', winner: 'Kansas City Chiefs', loser: 'Minnesota Vikings',
    score: '23-7', odds: 'Vikings -12',
    notableDetails: 'AFL wins final pre-merger Super Bowl. Chiefs dominate as heavy underdogs.'
  },
  {
    id: 'sb-v', year: 1971, sport: 'Football',
    event: 'Super Bowl V', winner: 'Baltimore Colts', loser: 'Dallas Cowboys',
    score: '16-13', odds: 'Colts -2.5',
    notableDetails: 'Sloppy game (the "Blunder Bowl"). Jim O\'Brien walk-off 32-yd FG.'
  },
  {
    id: 'sb-vii', year: 1973, sport: 'Football',
    event: 'Super Bowl VII', winner: 'Miami Dolphins', loser: 'Washington Redskins',
    score: '14-7', odds: 'Redskins -1',
    notableDetails: 'Dolphins complete 17-0 perfect season. Only perfect season in NFL history.'
  },
  {
    id: 'sb-ix', year: 1975, sport: 'Football',
    event: 'Super Bowl IX', winner: 'Pittsburgh Steelers', loser: 'Minnesota Vikings',
    score: '16-6', odds: 'Steelers -3',
    notableDetails: 'Steelers first championship. Steel Curtain defense allows only 17 rushing yards.'
  },
  {
    id: 'sb-x', year: 1976, sport: 'Football',
    event: 'Super Bowl X', winner: 'Pittsburgh Steelers', loser: 'Dallas Cowboys',
    score: '21-17', odds: 'Steelers -7',
    notableDetails: 'Lynn Swann 161 yds receiving. Staubach Hail Mary too late.'
  },
  {
    id: 'sb-xiii', year: 1979, sport: 'Football',
    event: 'Super Bowl XIII', winner: 'Pittsburgh Steelers', loser: 'Dallas Cowboys',
    score: '35-31', odds: 'Steelers -3.5',
    notableDetails: 'Terry Bradshaw 4 TD passes. Steelers 3rd ring in 5 years.'
  },
  {
    id: 'sb-xiv', year: 1980, sport: 'Football',
    event: 'Super Bowl XIV', winner: 'Pittsburgh Steelers', loser: 'Los Angeles Rams',
    score: '31-19', odds: 'Steelers -10.5',
    notableDetails: 'Bradshaw to Stallworth 73-yd TD. Steelers 4th ring in 6 years.'
  },
  {
    id: 'sb-xvi', year: 1982, sport: 'Football',
    event: 'Super Bowl XVI', winner: 'San Francisco 49ers', loser: 'Cincinnati Bengals',
    score: '26-21', odds: '49ers -1',
    notableDetails: 'Montana\'s first ring. 49ers goal-line stand. Beginning of a dynasty.'
  },
  {
    id: 'sb-xvii', year: 1983, sport: 'Football',
    event: 'Super Bowl XVII', winner: 'Washington Redskins', loser: 'Miami Dolphins',
    score: '27-17', odds: 'Dolphins -3',
    notableDetails: 'John Riggins 43-yd TD run on 4th & 1. "I\'m only 35, I can play another 5 years."'
  },
  {
    id: 'sb-xx', year: 1986, sport: 'Football',
    event: 'Super Bowl XX', winner: 'Chicago Bears', loser: 'New England Patriots',
    score: '46-10', odds: 'Bears -10',
    notableDetails: 'The \'85 Bears defense (arguably greatest ever). Refrigerator Perry TD run.'
  },
  {
    id: 'sb-xxi', year: 1987, sport: 'Football',
    event: 'Super Bowl XXI', winner: 'New York Giants', loser: 'Denver Broncos',
    score: '39-20', odds: 'Giants -9.5',
    notableDetails: 'Phil Simms 22/25 passing (88% — Super Bowl record). Gatorade shower invented.'
  },
  {
    id: 'sb-xxii', year: 1988, sport: 'Football',
    event: 'Super Bowl XXII', winner: 'Washington Redskins', loser: 'Denver Broncos',
    score: '42-10', odds: 'Broncos -3',
    notableDetails: 'Doug Williams 1st black QB to win Super Bowl. 35 pts in 2nd quarter.'
  },
  {
    id: 'sb-xxiii', year: 1989, sport: 'Football',
    event: 'Super Bowl XXIII', winner: 'San Francisco 49ers', loser: 'Cincinnati Bengals',
    score: '20-16', odds: '49ers -7',
    notableDetails: 'Montana 92-yd game-winning drive. John Taylor TD catch with 34 seconds left.'
  },
  {
    id: 'sb-xxiv', year: 1990, sport: 'Football',
    event: 'Super Bowl XXIV', winner: 'San Francisco 49ers', loser: 'Denver Broncos',
    score: '55-10', odds: '49ers -12',
    notableDetails: 'Most lopsided Super Bowl. Montana 5 TD passes. Rice 3 TDs.'
  },

  // ── WORLD SERIES ─────────────────────────────────────────
  {
    id: 'ws-1971', year: 1971, sport: 'Baseball',
    event: 'World Series', winner: 'Pittsburgh Pirates', loser: 'Baltimore Orioles',
    score: '4-3', odds: 'Orioles heavy favorites',
    notableDetails: 'Roberto Clemente .414 avg. Blass throws 2 CGs. Great upset.'
  },
  {
    id: 'ws-1975', year: 1975, sport: 'Baseball',
    event: 'World Series', winner: 'Cincinnati Reds', loser: 'Boston Red Sox',
    score: '4-3', odds: 'Reds -185',
    notableDetails: 'Game 6: Carlton Fisk waves ball fair. Arguably greatest WS game ever.'
  },
  {
    id: 'ws-1977', year: 1977, sport: 'Baseball',
    event: 'World Series', winner: 'New York Yankees', loser: 'Los Angeles Dodgers',
    score: '4-2', odds: 'Yankees -175',
    notableDetails: 'Reggie Jackson 3 HRs on 3 pitches in Game 6. "Mr. October" cemented.'
  },
  {
    id: 'ws-1985', year: 1985, sport: 'Baseball',
    event: 'World Series', winner: 'Kansas City Royals', loser: 'St. Louis Cardinals',
    score: '4-3', odds: 'Cardinals -130',
    notableDetails: 'Don Denkinger blown call at 1B in Game 6. Royals rally from 1-0 deficit in 9th.'
  },
  {
    id: 'ws-1986', year: 1986, sport: 'Baseball',
    event: 'World Series', winner: 'New York Mets', loser: 'Boston Red Sox',
    score: '4-3', odds: 'Mets -140',
    notableDetails: 'Game 6: Buckner error. Mets down to last strike in Game 6 & 7, win both.'
  },
  {
    id: 'ws-1988', year: 1988, sport: 'Baseball',
    event: 'World Series', winner: 'Los Angeles Dodgers', loser: 'Oakland Athletics',
    score: '4-1', odds: 'A\'s -240',
    notableDetails: 'Kirk Gibson pinch-hit walk-off HR in Game 1 on two bad legs. Huge upset.'
  },
  {
    id: 'ws-1990', year: 1990, sport: 'Baseball',
    event: 'World Series', winner: 'Cincinnati Reds', loser: 'Oakland Athletics',
    score: '4-0', odds: 'A\'s -200',
    notableDetails: 'Wire-to-wire sweep. Reds outscore A\'s 22-8. Eric Davis dominates.'
  },

  // ── BOXING ───────────────────────────────────────────────
  {
    id: 'ali-frazier-1', year: 1971, sport: 'Boxing',
    event: 'The Fight of the Century', winner: 'Joe Frazier', loser: 'Muhammad Ali',
    score: 'UD 15 rounds', odds: 'Ali slight favorite',
    notableDetails: 'Both undefeated. Frazier knocks Ali down in 15th. Ali\'s first loss.'
  },
  {
    id: 'foreman-frazier', year: 1973, sport: 'Boxing',
    event: 'Foreman vs Frazier', winner: 'George Foreman', loser: 'Joe Frazier',
    score: 'TKO 2nd round', odds: 'Frazier slight favorite',
    notableDetails: 'Foreman destroys Frazier. "Down goes Frazier! Down goes Frazier!" — Howard Cosell.'
  },
  {
    id: 'rumble-in-jungle', year: 1974, sport: 'Boxing',
    event: 'The Rumble in the Jungle', winner: 'Muhammad Ali', loser: 'George Foreman',
    score: 'KO 8th round', odds: 'Foreman 4-1 favorite',
    notableDetails: 'Zaire. Ali\'s rope-a-dope exhausts Foreman, then KOs him.'
  },
  {
    id: 'thrilla-manila', year: 1975, sport: 'Boxing',
    event: 'Thrilla in Manila', winner: 'Muhammad Ali', loser: 'Joe Frazier',
    score: 'TKO 14th round', odds: 'Ali -200',
    notableDetails: 'Rubber match. "The closest thing to death." Frazier\'s corner stops it before 15th.'
  },
  {
    id: 'leonard-duran-2', year: 1980, sport: 'Boxing',
    event: 'Leonard vs Duran II — "No Más"', winner: 'Sugar Ray Leonard', loser: 'Roberto Durán',
    score: 'TKO 8th round', odds: 'Even',
    notableDetails: 'Durán quits mid-round. "No más" ("no more"). Stunning end to a grudge match.'
  },
  {
    id: 'hagler-hearns', year: 1985, sport: 'Boxing',
    event: 'Hagler vs Hearns — "The War"', winner: 'Marvin Hagler', loser: 'Thomas Hearns',
    score: 'TKO 3rd round', odds: 'Hagler -210',
    notableDetails: '8 minutes of pure violence. Round 1 is greatest round in boxing history.'
  },
  {
    id: 'tyson-berbick', year: 1986, sport: 'Boxing',
    event: 'Tyson vs Berbick', winner: 'Mike Tyson', loser: 'Trevor Berbick',
    score: 'TKO 2nd round', odds: 'Tyson -400',
    notableDetails: 'Tyson youngest heavyweight champ ever (20 yrs, 4 months). Berbick knocked down 3 times trying to get up.'
  },
  {
    id: 'tyson-spinks', year: 1988, sport: 'Boxing',
    event: 'Tyson vs Spinks', winner: 'Mike Tyson', loser: 'Michael Spinks',
    score: 'KO 1st round (91 seconds)', odds: 'Tyson -350',
    notableDetails: 'Undisputed heavyweight title. Spinks never fights again. Tyson at his peak.'
  },
  {
    id: 'douglas-tyson', year: 1990, sport: 'Boxing',
    event: 'Douglas vs Tyson', winner: 'Buster Douglas', loser: 'Mike Tyson',
    score: 'KO 10th round', odds: 'Tyson 42-1 favorite',
    notableDetails: 'BIGGEST UPSET IN BOXING HISTORY. Tyson knocked down and out. 42:1 underdog wins.'
  },

  // ── TRIPLE CROWN HORSE RACING ────────────────────────────
  {
    id: 'secretariat-73', year: 1973, sport: 'Horse Racing',
    event: 'Belmont Stakes (Triple Crown)', winner: 'Secretariat', loser: 'Field',
    score: '31 lengths, 2:24 flat', odds: '1-10 favorite',
    notableDetails: 'Greatest performance in racing history. Still holds all 3 Triple Crown race records.'
  },
  {
    id: 'seattle-slew-77', year: 1977, sport: 'Horse Racing',
    event: 'Belmont Stakes (Triple Crown)', winner: 'Seattle Slew', loser: 'Field',
    score: '4 lengths', odds: '2-5 favorite',
    notableDetails: 'Only undefeated Triple Crown winner. Bought for $17,500 as a yearling.'
  },
  {
    id: 'affirmed-78', year: 1978, sport: 'Horse Racing',
    event: 'Belmont Stakes (Triple Crown)', winner: 'Affirmed', loser: 'Alydar',
    score: 'Head', odds: 'Affirmed slight favorite',
    notableDetails: 'Affirmed beats Alydar in all 3 Triple Crown races by a combined margin of under 2 lengths.'
  },

  // ── NCAA BASKETBALL ──────────────────────────────────────
  {
    id: 'ncst-1983', year: 1983, sport: 'Basketball',
    event: 'NCAA Championship', winner: 'NC State Wolfpack', loser: 'Houston Cougars',
    score: '54-52', odds: 'Houston -7.5',
    notableDetails: 'Jim Valvano\'s "Cardiac Pack." Lorenzo Charles dunks Dereck Whittenburg airball at buzzer. All-time Cinderella.'
  },
  {
    id: 'villanova-1985', year: 1985, sport: 'Basketball',
    event: 'NCAA Championship', winner: 'Villanova Wildcats', loser: 'Georgetown Hoyas',
    score: '66-64', odds: 'Georgetown -9.5',
    notableDetails: '8-seed beats defending champs. Villanova shoots 78.6% — misses only 1 FG in 2nd half.'
  },
  {
    id: 'kansas-1988', year: 1988, sport: 'Basketball',
    event: 'NCAA Championship', winner: 'Kansas Jayhawks', loser: 'Oklahoma Sooners',
    score: '83-79', odds: 'Oklahoma -6',
    notableDetails: '"Danny and the Miracles." 6-seed Kansas stuns Billy Tubbs\' high-powered Sooners.'
  },

  // ── HOCKEY ───────────────────────────────────────────────
  {
    id: 'miracle-on-ice', year: 1980, sport: 'Hockey',
    event: 'Winter Olympics Semi-Final — "Miracle on Ice"', winner: 'United States', loser: 'Soviet Union',
    score: '4-3', odds: 'Soviets massive favorites (est. 1000-1 for USA gold)',
    notableDetails: 'College kids beat the greatest hockey team in the world. Al Michaels: "Do you believe in miracles? YES!"'
  },
  {
    id: 'ws-2001', year: 2001, sport: 'Baseball',
    event: 'World Series 2001', winner: 'Arizona Diamondbacks', loser: 'New York Yankees',
    score: '4-3', odds: 'Yankees slight favorites',
    notableDetails: 'First World Series after 9/11. D-backs score 2 runs in bottom of 9th in Game 7 off Mariano Rivera, Luis Gonzalez hits walk-off single.'
  },
  // ── MISSING WORLD SERIES (filling gaps) ─────────────────────
  {
    id: 'ws-1972', year: 1972, sport: 'Baseball',
    event: 'World Series', winner: 'Oakland Athletics', loser: 'Cincinnati Reds',
    score: '4-3', odds: 'A\'s -150',
    notableDetails: 'First of 3 straight A\'s championships. Gene Tenace hits 4 HRs after hitting 5 all regular season. Catfish Hunter wins 2 games. Start of the Mustache Gang dynasty.'
  },
  {
    id: 'ws-1973', year: 1973, sport: 'Baseball',
    event: 'World Series', winner: 'Oakland Athletics', loser: 'New York Mets',
    score: '4-3', odds: 'A\'s -180',
    notableDetails: 'A\'s repeat. Reggie Jackson (injured) and manager Dick Williams clash. Bert Campaneris hits .350. The Mets went from last place on Aug 30 to the World Series — the "You Gotta Believe" Mets.'
  },
  {
    id: 'ws-1974', year: 1974, sport: 'Baseball',
    event: 'World Series', winner: 'Oakland Athletics', loser: 'Los Angeles Dodgers',
    score: '4-1', odds: 'A\'s -160',
    notableDetails: 'A\'s 3-peat. Catfish Hunter wins 2 games (will sign with Yankees as FA after season). Rollie Fingers saves 2 games. Reggie Jackson slugs .600. Last time a team won 3 straight World Series until the 1998-2000 Yankees.'
  },
  {
    id: 'ws-1976', year: 1976, sport: 'Baseball',
    event: 'World Series — "The Big Red Machine"', winner: 'Cincinnati Reds', loser: 'New York Yankees',
    score: '4-0', odds: 'Reds -200',
    notableDetails: 'The Big Red Machine sweeps the Yankees. Pete Rose hits .350, Joe Morgan hits .333 with 2 HRs. Johnny Bench hits .533 in the sweep. One of the greatest teams ever assembled.'
  },
  {
    id: 'ws-1978', year: 1978, sport: 'Baseball',
    event: 'World Series — "The Boston Massacre"', winner: 'New York Yankees', loser: 'Los Angeles Dodgers',
    score: '4-2', odds: 'Yankees -160',
    notableDetails: 'Yankees repeat. Bucky Dent hits a HR over the Green Monster in the 1-game AL East playoff against Boston (the "Bucky Dent game"). Reggie Jackson hits 3 HRs in Game 6 again (but loses).'
  },
  {
    id: 'ws-1979', year: 1979, sport: 'Baseball',
    event: 'World Series — "We Are Family"', winner: 'Pittsburgh Pirates', loser: 'Baltimore Orioles',
    score: '4-3', odds: 'Orioles -180',
    notableDetails: '"We Are Family" Pirates. Willie Stargell hits .400 with 3 HRs. Kent Tekulve appears in all 7 games. The Pirates\' last World Series win to date.'
  },
  {
    id: 'ws-1980', year: 1980, sport: 'Baseball',
    event: 'World Series — Phillies Win First', winner: 'Philadelphia Phillies', loser: 'Kansas City Royals',
    score: '4-2', odds: 'Phillies -130',
    notableDetails: 'The Phillies\' first World Series title in franchise history (founded 1883 — 97 years). Mike Schmidt hits .381 with 2 HRs. Tug McGraw strikes out the final batter. "You beauty!"'
  },
  {
    id: 'ws-1984', year: 1984, sport: 'Baseball',
    event: 'World Series', winner: 'Detroit Tigers', loser: 'San Diego Padres',
    score: '4-1', odds: 'Tigers -210',
    notableDetails: 'Tigers started the season 35-5 — the greatest start in MLB history. Jack Morris throws a complete game in Game 5 to clinch. Kirk Gibson hits a clinching HR off Goose Gossage (who refused to walk him). Alan Trammell MVP (.450, 2 HRs).'
  },
  {
    id: 'ws-1989', year: 1989, sport: 'Baseball',
    event: 'World Series — "The Earthquake Series"', winner: 'Oakland Athletics', loser: 'San Francisco Giants',
    score: '4-0', odds: 'A\'s -200',
    notableDetails: 'The Loma Prieta earthquake (M6.9) hits 30 minutes before Game 3, collapsing a freeway and killing 63. The Series is delayed 10 days. When play resumes, the A\'s sweep. Dave Stewart wins 2 games. The "Battle of the Bay" ends anticlimactically.'
  },
  {
    id: 'ws-1992', year: 1992, sport: 'Baseball',
    event: 'World Series — First Outside the US', winner: 'Toronto Blue Jays', loser: 'Atlanta Braves',
    score: '4-2', odds: 'Braves -130',
    notableDetails: 'First World Series with a non-US team. Blue Jays win on Dave Winfield\'s 2-run double in the 11th inning of Game 6. Joe Carter catches the final out. First championship for a Canadian team in any major sport.'
  },
  {
    id: 'ws-1996', year: 1996, sport: 'Baseball',
    event: 'World Series — Yankees Dynasty Begins', winner: 'New York Yankees', loser: 'Atlanta Braves',
    score: '4-2', odds: 'Braves -145',
    notableDetails: 'Yankees come back from 0-2 deficit. Jim Leyritz hits a game-tying 3-run HR off Mark Wohlers in Game 4 (turning point). Joe Torre\'s first championship. Start of the Yankees dynasty (4 titles in 5 years).'
  },
  {
    id: 'ws-1998', year: 1998, sport: 'Baseball',
    event: 'World Series — 114-Win Yankees', winner: 'New York Yankees', loser: 'San Diego Padres',
    score: '4-0', odds: 'Yankees -250',
    notableDetails: 'Yankees won 114 regular season games (AL record). Scott Brosius hits .471 with 2 HRs and wins MVP. The greatest team of the modern era sweeps the Padres. Total dominance.'
  },
  {
    id: 'ws-1999', year: 1999, sport: 'Baseball',
    event: 'World Series', winner: 'New York Yankees', loser: 'Atlanta Braves',
    score: '4-0', odds: 'Yankees -200',
    notableDetails: 'Yankees sweep the Braves. Chad Curtis hits walk-off HR in Game 3. Mariano Rivera saves all 4 games. Yankees win 3rd title in 4 years. The 1998-2000 Yankees win 3 straight World Series.'
  },
  {
    id: 'ws-2000', year: 2000, sport: 'Baseball',
    event: 'World Series — "Subway Series"', winner: 'New York Yankees', loser: 'New York Mets',
    score: '4-1', odds: 'Yankees -160',
    notableDetails: 'First Subway Series since 1956. Yankees win their 3rd straight World Series (4th in 5 years). Roger Clemens throws a broken bat shard at Mike Piazza. Derek Jeter hits .400 and wins MVP.'
  },

  // ── NBA FINALS (expanding from 2 to full coverage) ──────────
  {
    id: 'nba-1980', year: 1980, sport: 'Basketball',
    event: 'NBA Finals — Magic\'s Rookie Masterpiece', winner: 'Los Angeles Lakers', loser: 'Philadelphia 76ers',
    score: '4-2', odds: '76ers slight favorites (Kareem injured)',
    notableDetails: 'Magic Johnson (20 years old, rookie) starts at center in Game 6 with Kareem Abdul-Jabbar injured. Scores 42 points, grabs 15 rebounds, dishes 7 assists. Named Finals MVP. The birth of "Showtime."'
  },
  {
    id: 'nba-1984', year: 1984, sport: 'Basketball',
    event: 'NBA Finals — Bird vs Magic', winner: 'Boston Celtics', loser: 'Los Angeles Lakers',
    score: '4-3', odds: 'Celtics -160',
    notableDetails: 'The first Bird vs Magic Finals. Cedric Maxwell scores 24 in Game 7. Gerald Henderson steals James Worthy\'s pass in Game 2 to force OT. Bird averages 27/14/4. The rivalry that saved the NBA.'
  },
  {
    id: 'nba-1985', year: 1985, sport: 'Basketball',
    event: 'NBA Finals — Lakers Get Revenge', winner: 'Los Angeles Lakers', loser: 'Boston Celtics',
    score: '4-2', odds: 'Celtics -130',
    notableDetails: 'Lakers beat Celtics in the Finals for the first time (0-8 previously). Kareem (38 years old) scores 30 in Game 6 clincher. Memorial Day Massacre: Celtics blow out Lakers 148-114 in Game 1 — the Lakers respond by winning 4 of the next 5.'
  },
  {
    id: 'nba-1987', year: 1987, sport: 'Basketball',
    event: 'NBA Finals — "Junior Skyhook"', winner: 'Los Angeles Lakers', loser: 'Boston Celtics',
    score: '4-2', odds: 'Lakers -170',
    notableDetails: 'Magic Johnson\'s "junior skyhook" over Kevin McHale and Robert Parish wins Game 4 at Boston Garden. Lakers take 3-1 lead. Magic named MVP. The iconic moment of the Lakers-Celtics rivalry.'
  },
  {
    id: 'nba-1988', year: 1988, sport: 'Basketball',
    event: 'NBA Finals — Lakers Repeat', winner: 'Los Angeles Lakers', loser: 'Detroit Pistons',
    score: '4-3', odds: 'Lakers -150',
    notableDetails: 'Isiah Thomas scores 25 points in the 3rd quarter of Game 6 on a severely sprained ankle — one of the gutsiest performances ever. Lakers win Game 7 behind James Worthy\'s 36/16/10 triple-double. Worthy MVP.'
  },
  {
    id: 'nba-1989', year: 1989, sport: 'Basketball',
    event: 'NBA Finals — Pistons Get Their Ring', winner: 'Detroit Pistons', loser: 'Los Angeles Lakers',
    score: '4-0', odds: 'Pistons -180',
    notableDetails: '"The Bad Boys" sweep the defending champion Lakers. Joe Dumars averages 27.3 PPG and wins MVP. Isiah Thomas and the Pistons finally get their championship after losing to Lakers in 1988.'
  },
  {
    id: 'nba-1990', year: 1990, sport: 'Basketball',
    event: 'NBA Finals — Pistons Repeat', winner: 'Detroit Pistons', loser: 'Portland Trail Blazers',
    score: '4-1', odds: 'Pistons -200',
    notableDetails: 'Pistons repeat as champions. Isiah Thomas MVP (27.6 PPG, 7.0 APG). Vinnie Johnson hits the series-clinching shot with 0.7 seconds left in Game 5. The Bad Boys era peaks.'
  },
  {
    id: 'nba-1991', year: 1991, sport: 'Basketball',
    event: 'NBA Finals — Jordan\'s First Title', winner: 'Chicago Bulls', loser: 'Los Angeles Lakers',
    score: '4-1', odds: 'Bulls -200',
    notableDetails: 'Michael Jordan wins his first NBA championship. Averages 31/11/8. The famous "switch hands" layup in Game 2. Bulls win 4 straight after losing Game 1. The beginning of the Jordan dynasty. Magic Johnson retires (first time) after this series.'
  },
  {
    id: 'nba-1992', year: 1992, sport: 'Basketball',
    event: 'NBA Finals', winner: 'Chicago Bulls', loser: 'Portland Trail Blazers',
    score: '4-2', odds: 'Bulls -220',
    notableDetails: 'Jordan shrugs after hitting 6 3-pointers in Game 1 (35 points in the 1st half). Bulls repeat. Jordan averages 35.8 PPG. Clyde Drexler and Jordan have a legendary individual battle.'
  },
  {
    id: 'nba-1994', year: 1994, sport: 'Basketball',
    event: 'NBA Finals — Jordan\'s Absence', winner: 'Houston Rockets', loser: 'New York Knicks',
    score: '4-3', odds: 'Knicks -130',
    notableDetails: 'Hakeem Olajuwon dominates Patrick Ewing in a 7-game classic. Olajuwon blocks John Starks\' potential series-winning 3-pointer in Game 6. Hakeem averages 27/9/4 with 3.7 blocks. The "Clutch City" Rockets win without having to face Jordan (playing baseball).'
  },
  {
    id: 'nba-1995', year: 1995, sport: 'Basketball',
    event: 'NBA Finals — Rockets Repeat', winner: 'Houston Rockets', loser: 'Orlando Magic',
    score: '4-0', odds: 'Magic -150 (had home court)',
    notableDetails: 'Rockets sweep the Magic despite being underdogs. Hakeem outplays young Shaquille O\'Neal. Kenny Smith hits 7 3-pointers in Game 1. The 6th-seeded Rockets become the lowest seed ever to win the title. "Never underestimate the heart of a champion."'
  },
  {
    id: 'nba-1996', year: 1996, sport: 'Basketball',
    event: 'NBA Finals — 72-Win Bulls', winner: 'Chicago Bulls', loser: 'Seattle SuperSonics',
    score: '4-2', odds: 'Bulls -800',
    notableDetails: 'Bulls won 72 games in the regular season (NBA record until 2016 Warriors won 73). Jordan comes back from baseball. Dennis Rodman grabs 11+ rebounds per game. Jordan wins Finals MVP (27.3 PPG). The greatest single-season team ever assembled.'
  },
  {
    id: 'nba-1997', year: 1997, sport: 'Basketball',
    event: 'NBA Finals — "The Flu Game"', winner: 'Chicago Bulls', loser: 'Utah Jazz',
    score: '4-2', odds: 'Bulls -230',
    notableDetails: 'Jordan scores 38 points in Game 5 despite being visibly ill (reported flu or food poisoning) — "The Flu Game." Steve Kerr hits the series-clinching jumper in Game 6 off Jordan\'s pass. Jordan averages 32/7/6.'
  },
  {
    id: 'nba-1999', year: 1999, sport: 'Basketball',
    event: 'NBA Finals — Spurs\' First Title', winner: 'San Antonio Spurs', loser: 'New York Knicks',
    score: '4-1', odds: 'Spurs -300',
    notableDetails: 'Lockout-shortened season (50 games). Tim Duncan (2nd year) and David Robinson ("The Twin Towers") dominate. Duncan averages 27/14 and wins Finals MVP at age 23. The Knicks were the 8th seed — lowest ever to reach the Finals.'
  },

  // ── 1990s & early 2000s EXPANSIONS ────────────────────────
  {
    id: 'sb-xxv', year: 1991, sport: 'Football',
    event: 'Super Bowl XXV', winner: 'New York Giants', loser: 'Buffalo Bills',
    score: '20-19', odds: 'Bills -7',
    notableDetails: 'Giants control ball for 40:33. Bills kicker Scott Norwood misses 47-yard FG wide right at the buzzer.'
  },
  {
    id: 'sb-xxviii', year: 1994, sport: 'Football',
    event: 'Super Bowl XXVIII', winner: 'Dallas Cowboys', loser: 'Buffalo Bills',
    score: '30-13', odds: 'Cowboys -10.5',
    notableDetails: 'Dallas dominates second half. Emmitt Smith rushes for 132 yards and 2 TDs, wins MVP. Bills lose 4th straight Super Bowl.'
  },
  {
    id: 'sb-xxxii', year: 1998, sport: 'Football',
    event: 'Super Bowl XXXII', winner: 'Denver Broncos', loser: 'Green Bay Packers',
    score: '31-24', odds: 'Packers -11.5',
    notableDetails: 'John Elway wins first championship. Terrell Davis runs for 157 yards & 3 TDs despite a migraine. Elway\'s famous "helicopter" run on 3rd down.'
  },
  {
    id: 'sb-xxxvi', year: 2002, sport: 'Football',
    event: 'Super Bowl XXXVI', winner: 'New England Patriots', loser: 'St. Louis Rams',
    score: '20-17', odds: 'Rams -14',
    notableDetails: 'Played in Feb 2002 for 2001 season. First Super Bowl won on final play. Adam Vinatieri 48-yd GW FG. Tom Brady wins MVP.'
  },
  // ── MISSING SUPER BOWLS (filling gaps) ─────────────────────
  {
    id: 'sb-ii', year: 1968, sport: 'Football',
    event: 'Super Bowl II', winner: 'Green Bay Packers', loser: 'Oakland Raiders',
    score: '33-14', odds: 'Packers -14',
    notableDetails: 'Lombardi\'s final game as Packers coach. Bart Starr MVP. Packers dominate the AFL champions for the 2nd straight year.'
  },
  {
    id: 'sb-vi', year: 1972, sport: 'Football',
    event: 'Super Bowl VI', winner: 'Dallas Cowboys', loser: 'Miami Dolphins',
    score: '24-3', odds: 'Cowboys -6',
    notableDetails: 'Cowboys win their first Super Bowl. Roger Staubach MVP. Dolphins held to 185 total yards. The only Super Bowl decided by exactly 21 points.'
  },
  {
    id: 'sb-viii', year: 1974, sport: 'Football',
    event: 'Super Bowl VIII', winner: 'Miami Dolphins', loser: 'Minnesota Vikings',
    score: '24-7', odds: 'Dolphins -6.5',
    notableDetails: 'Dolphins win 2nd straight Super Bowl. Larry Csonka rushes for 145 yards on 33 carries. The "No-Name Defense" dominates.'
  },
  {
    id: 'sb-xi', year: 1977, sport: 'Football',
    event: 'Super Bowl XI', winner: 'Oakland Raiders', loser: 'Minnesota Vikings',
    score: '32-14', odds: 'Raiders -4',
    notableDetails: 'John Madden finally wins his Super Bowl. Fred Biletnikoff MVP (4 catches, 79 yards, 3 set up TDs). Raiders\' first championship.'
  },
  {
    id: 'sb-xii', year: 1978, sport: 'Football',
    event: 'Super Bowl XII', winner: 'Dallas Cowboys', loser: 'Denver Broncos',
    score: '27-10', odds: 'Cowboys -7',
    notableDetails: 'Craig Morton (Broncos QB) throws 4 INTs against his former team. Harvey Martin and Randy White share MVP (only co-MVPs in SB history). "Doomsday Defense" dominates.'
  },
  {
    id: 'sb-xv', year: 1981, sport: 'Football',
    event: 'Super Bowl XV', winner: 'Oakland Raiders', loser: 'Philadelphia Eagles',
    score: '27-10', odds: 'Eagles -3',
    notableDetails: 'Raiders become first wild card team to win the Super Bowl. Jim Plunkett MVP (261 yds, 3 TDs). Al Davis: "Just win, baby."'
  },
  {
    id: 'sb-xix', year: 1985, sport: 'Football',
    event: 'Super Bowl XIX', winner: 'San Francisco 49ers', loser: 'Miami Dolphins',
    score: '38-16', odds: '49ers -3.5',
    notableDetails: 'Montana vs Marino. Montana dominates (331 yds, 3 TD passes + 59 yds rushing). Marino\'s record-breaking season ends in a blowout. 49ers score 3 TDs in 7 minutes of the 2nd half.'
  },
  {
    id: 'sb-xxvi', year: 1992, sport: 'Football',
    event: 'Super Bowl XXVI', winner: 'Washington Redskins', loser: 'Buffalo Bills',
    score: '37-24', odds: 'Redskins -7',
    notableDetails: 'Mark Rypien MVP (292 yds, 2 TDs). Bills lose 2nd straight Super Bowl. Thurman Thomas loses his helmet before the game and misses the first 2 plays.'
  },
  {
    id: 'sb-xxvii', year: 1993, sport: 'Football',
    event: 'Super Bowl XXVII', winner: 'Dallas Cowboys', loser: 'Buffalo Bills',
    score: '52-17', odds: 'Cowboys -6.5',
    notableDetails: 'Cowboys dominate. Troy Aikman 4 TDs. Leon Lett showboats on a fumble return and gets tackled at the 1 yard line by Don Beebe — the most famous hustle play in Super Bowl history. Bills lose 3rd straight.'
  },
  {
    id: 'sb-xxix', year: 1995, sport: 'Football',
    event: 'Super Bowl XXIX', winner: 'San Francisco 49ers', loser: 'San Diego Chargers',
    score: '49-26', odds: '49ers -18.5',
    notableDetails: 'Steve Young throws 6 TD passes (Super Bowl record). Finally out of Montana\'s shadow: "Get the monkey off my back!" 49ers score on every drive except the last one (kneel-down).'
  },
  {
    id: 'sb-xxx', year: 1996, sport: 'Football',
    event: 'Super Bowl XXX', winner: 'Dallas Cowboys', loser: 'Pittsburgh Steelers',
    score: '27-17', odds: 'Cowboys -13.5',
    notableDetails: 'Cowboys win 3rd Super Bowl in 4 years. Larry Brown becomes the unlikely MVP (2 INTs). Deion Sanders plays both ways. Neil O\'Donnell throws 2 devastating pick-sixes.'
  },
  {
    id: 'sb-xxxi', year: 1997, sport: 'Football',
    event: 'Super Bowl XXXI', winner: 'Green Bay Packers', loser: 'New England Patriots',
    score: '35-21', odds: 'Packers -14',
    notableDetails: 'Brett Favre\'s only Super Bowl win. Desmond Howard returns a kickoff 99 yards for a TD — the first special teams TD in Super Bowl history. Reggie White sacks Bledsoe 3 times.'
  },
  {
    id: 'sb-xxxiv', year: 2000, sport: 'Football',
    event: 'Super Bowl XXXIV', winner: 'St. Louis Rams', loser: 'Tennessee Titans',
    score: '23-16', odds: 'Rams -7',
    notableDetails: '"The Tackle" — Mike Jones stops Kevin Dyson at the 1-yard-line on the final play of the game. Kurt Warner goes from grocery stock boy to Super Bowl MVP (414 yds, 2 TDs). "The Greatest Show on Turf."'
  },
  {
    id: 'ws-1991', year: 1991, sport: 'Baseball',
    event: 'World Series 1991', winner: 'Minnesota Twins', loser: 'Atlanta Braves',
    score: '4-3', odds: 'Twins slight favorites',
    notableDetails: 'Three games won in final at-bat. Game 7 is a 1-0 10-inning thriller; Jack Morris pitches complete game shutout.'
  },
  {
    id: 'ws-1993', year: 1993, sport: 'Baseball',
    event: 'World Series 1993', winner: 'Blue Jays', loser: 'Phillies',
    score: '4-2', odds: 'Blue Jays -140',
    notableDetails: 'Joe Carter hits walk-off 3-run HR off Mitch Williams in bottom of 9th in Game 6. "Touch \'em all, Joe!"'
  },
  {
    id: 'ws-2001', year: 2001, sport: 'Baseball',
    event: 'World Series 2001', winner: 'Arizona Diamondbacks', loser: 'New York Yankees',
    score: '4-3', odds: 'Yankees slight favorites',
    notableDetails: 'First World Series after 9/11. D-backs score 2 runs in bottom of 9th in Game 7 off Mariano Rivera, Luis Gonzalez hits walk-off single.'
  },
  {
    id: 'nba-1993', year: 1993, sport: 'Basketball',
    event: 'NBA Finals 1993', winner: 'Chicago Bulls', loser: 'Phoenix Suns',
    score: '4-2', odds: 'Suns slight favorites (had home court)',
    notableDetails: 'Bulls win first three-peat. John Paxson hits GW 3-pointer with 3.9 seconds left in Game 6. Michael Jordan averages 41.0 PPG.'
  },
  {
    id: 'nba-1998', year: 1998, sport: 'Basketball',
    event: 'NBA Finals 1998', winner: 'Chicago Bulls', loser: 'Utah Jazz',
    score: '4-2', odds: 'Jazz -110 (had home court)',
    notableDetails: 'Michael Jordan\'s final game with the Bulls. Steals ball from Malone and hits "The Last Shot" over Bryon Russell in Game 6.'
  },
  {
    id: 'tyson-holyfield-ii', year: 1997, sport: 'Boxing',
    event: 'WBA Heavyweight Championship — "The Bite Fight"', winner: 'Evander Holyfield', loser: 'Mike Tyson',
    score: 'Disqualification', odds: 'Tyson -200',
    notableDetails: 'Tyson bites Holyfield\'s ears twice in the third round and is disqualified. Sparks massive brawl in the ring.'
  },
];
