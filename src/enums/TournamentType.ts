// * need to keep actual with same enum on the front-end
// * also update tournamentType.d.ts with it
// * also update tournament schema in joiSchemas
// * when change, need to create migration to update tournaments.tournament_type
enum TournamentType {
  National = 'национальный тур',
  AllStar = 'МВЗ',
  Regional = 'региональный',
  League = 'лига',
  BagTag = 'bag-tag',
}

export default TournamentType;
