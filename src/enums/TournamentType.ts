// @deprecated use type from types/db
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

