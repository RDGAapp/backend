import { IPlayerBase } from 'types/player';

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
  const query = new URLSearchParams();
  query.append('FILTER[UF_CRM_CONTACT_1705326811592]', rdgaNumber.toString());
  query.append('SELECT[]', 'NAME');
  query.append('SELECT[]', 'LAST_NAME');
  query.append('SELECT[]', 'ADDRESS');
  // metrix_number
  query.append('SELECT[]', 'UF_CRM_CONTACT_1705326873362');

  const result = await fetch(`${bitrixUrl}/crm.contact.list.json?${query}`);

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
    activeTo: new Date().toISOString(),
  };
};
