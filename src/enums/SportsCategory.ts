// * need to keep actual with same enum on the front-end
// * also update player schema in joiSchemas (joiSchemas/players.ts)
// * when change, need to create migration to update players.sports_category
// * DON'T DELETE TYPES, ONLY ADD (migrations depends on them, so it can break old ones)
enum SportsCategory {
  Master = 'master',
  Candidate = 'candidate',
  AdultFirst = 'adult-1',
  AdultSecond = 'adult-2',
  AdultThird = 'adult-3',
  JuniorFirst = 'junior-1',
  JuniorSecond = 'junior-2',
  JuniorThird = 'junior-3',
}

export default SportsCategory;
