import { IPlayerExtended } from 'types/player';

export const getMetrixDataByNumber = async (metrixNumber?: number | null) => {
  const returnValue: {
    metrixRating: IPlayerExtended['metrixRating'];
    metrixRatingChange: IPlayerExtended['metrixRatingChange'];
  } = { metrixRating: null, metrixRatingChange: null };

  if (!metrixNumber) return returnValue;

  try {
    const metrixResponse = await fetch(
      `https://discgolfmetrix.com/mystat_server_rating.php?user_id=${metrixNumber}&other=1&course_id=0`,
    );
    const metrixData = (await metrixResponse.json()) as [
      number,
      number,
      string,
    ][][];

    const sortedMetrixData = metrixData[1].sort((a, b) => b[0] - a[0]);
    const currentMetrixRating = sortedMetrixData[0]?.[1] ?? null;
    const previousMetrixRating = sortedMetrixData[1]?.[1] ?? null;

    returnValue.metrixRating = currentMetrixRating ?? null;
    returnValue.metrixRatingChange = previousMetrixRating
      ? currentMetrixRating - previousMetrixRating
      : null;
  } catch (error) {
    console.error('Error getting metrix data', error);
  }

  return returnValue;
};
