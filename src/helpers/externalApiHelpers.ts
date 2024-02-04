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

    const currentMetrixRating =
      metrixData[1].sort((a, b) => b[0] - a[0])[0]?.[1] ?? null;
    const previousMetrixRating =
      metrixData[1].sort((a, b) => b[0] - a[0])[1]?.[1] ?? null;

    returnValue.metrixRating = currentMetrixRating ?? null;
    returnValue.metrixRatingChange = previousMetrixRating
      ? currentMetrixRating - previousMetrixRating
      : null;
  } catch (error) {
    console.error('Error getting metrix data', error);
  }

  return returnValue;
};

export const getPdgaDataByNumber = async (pdgaNumber?: number | null) => {
  const returnValue: {
    pdgaRating: IPlayerExtended['pdgaRating'];
    pdgaActiveTo: IPlayerExtended['pdgaActiveTo'];
  } = { pdgaRating: null, pdgaActiveTo: null };

  if (!pdgaNumber) return returnValue;

  try {
    const pdgaResponse = await fetch(`https://www.pdga.com/player/${pdgaNumber}`);
    const pdgaPlayerHtml = await pdgaResponse.text();

    const expireDateString = [
      ...pdgaPlayerHtml.matchAll(/<\s*small[^>]*>(.*?)<\s*\/\s*small>/g),
    ][0]?.[1]
      ?.split(' ')
      ?.at(-1)
      ?.replaceAll(')', '');

    const pdgaRating = Number(
      pdgaPlayerHtml
        .match(/<\s*strong[^>]*>Current Rating:<\s*\/\s*strong> \d+/g)?.[0]
        .split(' ')
        .at(-1),
    );

    if (!Number.isNaN(pdgaRating)) {
      returnValue.pdgaRating = pdgaRating;
    }
    if (expireDateString) {
      returnValue.pdgaActiveTo = new Date(expireDateString).toISOString();
    }
  } catch (error) {
    console.error('Error getting metrix data', error);
  }

  return returnValue;
};
