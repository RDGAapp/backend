// * need to keep actual with same enum on the front-end
// * also update tournament schema in joiSchemas
// * when change, need to create migration to update tournaments.tournament_type
// * DON'T DELETE TYPES, ONLY ADD (migrations depends on them, so it can break old ones)
enum TournamentType {
  RussianChampionship = 'ЧР',
  Pro = 'про тур',
  Federal = 'федеральный',
  League = 'лига',

  AllStar = 'МВЗ',

  // @deprecated renamed to Federal
  Regional = 'региональный',
  // @deprecated renamed to Pro
  National = 'национальный тур',
  // @deprecated wasn't used
  BagTag = 'bag-tag',
}

export default TournamentType;

