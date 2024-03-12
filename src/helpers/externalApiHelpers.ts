import { IPlayerBase, IPlayerExtended } from 'types/player';

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

export const getPdgaDataByNumber = async (pdgaNumber?: number | null) => {
  const returnValue: {
    pdgaRating: IPlayerExtended['pdgaRating'];
    pdgaActiveTo: IPlayerExtended['pdgaActiveTo'];
  } = { pdgaRating: null, pdgaActiveTo: null };

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

const bitrixUrl = process.env.BITRIX_URL;

export const getTelegramLoginByRdgaNumber = async (
  rdgaNumber: number,
): Promise<string | null> => {
  const result = await fetch(
    `${bitrixUrl}/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=${rdgaNumber}&SELECT[]=IM`,
  );

  if (!result.ok) {
    const text = await result.text();
    throw new Error(`Bitrix error: ${text}`);
  }

  const json = (await result.json()) as {
    result: { IM: { VALUE_TYPE: string; VALUE: string }[] }[];
    total: number;
  };

  if (json.total !== 1) {
    throw new Error(`Bitrix error: more or less than 1 contact found`);
  }

  return (
    json.result[0]?.IM.find((value) => value.VALUE_TYPE === 'TELEGRAM')
      ?.VALUE ?? null
  );
};

export const getPlayerDataFromBitrix = async (
  rdgaNumber: number,
): Promise<IPlayerBase> => {
  const result = await fetch(
    `${bitrixUrl}/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=${rdgaNumber}`,
  );

  if (!result.ok) {
    const text = await result.text();
    throw new Error(`Bitrix error: ${text}`);
  }

  const json = (await result.json()) as {
    result: {
      NAME: string;
      LAST_NAME: string | null;
      ADDRESS: string | null;
      UF_CRM_CONTACT_1705326873362: string | null;
    }[];
    total: number;
  };

  if (json.total !== 1) {
    throw new Error(`Bitrix error: more or less than 1 contact found`);
  }

  const { NAME, LAST_NAME, ADDRESS, UF_CRM_CONTACT_1705326873362 } =
    json.result[0];

  const metrixNumber = Number(UF_CRM_CONTACT_1705326873362);

  return {
    name: NAME.trim(),
    surname: (LAST_NAME ?? '').trim(),
    rdgaNumber,
    town: (ADDRESS ?? '').trim(),
    metrixNumber: isNaN(metrixNumber) ? null : metrixNumber,
    pdgaNumber: null,
    sportsCategory: null,
    rdgaRating: 0,
    rdgaRatingChange: 0,
    activeTo: new Date().toISOString(),
  };
};
