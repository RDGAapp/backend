import { IPlayerExtended } from 'types/player';

interface IApiPlayer {
  rdgaNumber: number;
  rating: number;
  diff: number;
}

let cachedPlayers: {
  rdgaNumber: IPlayerExtended['rdgaNumber'];
  rdgaRating: IPlayerExtended['rdgaRating'];
  rdgaRatingChange: IPlayerExtended['rdgaRatingChange'];
}[] = [];
let expireDate: Date = new Date();

export const getRdgaDataByNumber = async (rdgaNumber: number) => {
  const returnValue: {
    rdgaRating: IPlayerExtended['rdgaRating'];
    rdgaRatingChange: IPlayerExtended['rdgaRatingChange'];
  } = { rdgaRating: 0, rdgaRatingChange: null };

  if (!rdgaNumber) return returnValue;

  try {
    if (expireDate <= new Date()) {
      const rdgaResponse = await fetch(
        `https://rdga-api-astrogator.amvera.io/api/actual_rating`,
      );
      cachedPlayers = ((await rdgaResponse.json()) as IApiPlayer[]).map(
        (data) => ({
          rdgaNumber: data.rdgaNumber,
          rdgaRating: data.rating,
          rdgaRatingChange: data.diff,
        }),
      );
      expireDate.setDate(expireDate.getDate() + 1);
    }

    const player = cachedPlayers.find(
      (player) => player.rdgaNumber === rdgaNumber,
    );

    if (player) {
      returnValue.rdgaRating = player.rdgaRating;
      returnValue.rdgaRatingChange = player.rdgaRatingChange;
    }

  } catch (error) {
    console.error('Error getting rdga data', error);
  }

  return returnValue;
};

export const clearRdgaDataCache = () => {
  expireDate = new Date();
  cachedPlayers = [];
};
