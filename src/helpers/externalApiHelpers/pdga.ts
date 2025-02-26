import { IPlayerExtended } from 'types/player';

export const getPdgaDataByNumber = async (pdgaNumber?: number | null) => {
  const returnValue: {
    pdgaRating: IPlayerExtended['pdgaRating'];
    pdgaRatingChange: IPlayerExtended['pdgaRatingChange'];
    pdgaActiveTo: IPlayerExtended['pdgaActiveTo'];
  } = { pdgaRating: null, pdgaRatingChange: null, pdgaActiveTo: null };

  if (!pdgaNumber) return returnValue;

  try {
    const pdgaResponse = await fetch(
      `https://www.pdga.com/player/${pdgaNumber}`,
    );
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
    const pdgaRatingChange = Number(
      [
        ...pdgaPlayerHtml.matchAll(/<\s*a title=[^>]*>(.*?)<\s*\/\s*a>/g),
      ]?.[0]?.[1],
    );

    if (!Number.isNaN(pdgaRating)) {
      returnValue.pdgaRating = pdgaRating;
    }
    if (!Number.isNaN(pdgaRatingChange)) {
      returnValue.pdgaRatingChange = pdgaRatingChange;
    }
    if (expireDateString) {
      returnValue.pdgaActiveTo = new Date(expireDateString).toISOString();
    }
  } catch (error) {
    console.error('Error getting metrix data', error);
  }

  return returnValue;
};
