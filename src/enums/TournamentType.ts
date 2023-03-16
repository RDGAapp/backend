// * need to keep actual with same enum on the front-end
// * also update tournamentType.d.ts with it
// * also update tournament schema in joiSchemas
// * when change, need to create migration to update tournaments.tournament_type
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

