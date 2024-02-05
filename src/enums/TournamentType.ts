// * need to keep actual with same enum on the front-end
// * also update tournament schema in joiSchemas
// * when change, need to create migration to update tournaments.tournament_type
// * DON'T DELETE TYPES, ONLY ADD (migrations depends on them, so it can break old ones)
enum TournamentType {
  RussianChampionship = 'ЧР',
  National = 'национальный тур',
  Pro = 'про тур',
  AllStar = 'МВЗ',
  Regional = 'региональный',
  Federal = 'федеральный',
  League = 'лига',
  BagTag = 'bag-tag',
}

export default TournamentType;

