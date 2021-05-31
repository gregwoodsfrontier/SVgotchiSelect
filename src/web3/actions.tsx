import { AavegotchiContractObject, AavegotchiObject } from "types";
import { Contract, BigNumber } from "ethers";
import { request } from "graphql-request";

const uri = "https://api.thegraph.com/subgraphs/name/aavegotchi/aavegotchi-core-matic";

type FetchAavegotchisRes = Promise<
  { status: 200; data: Array<AavegotchiObject> } | { status: 400; error: any }
>;

interface QueryResponse {
  aavegotchis: Array<AavegotchiObject>;
}

/**
 * Fetches all Aavegotchis for given address. The Aavegotchi subgraph is used to increase the maximum data we are able to pull for oweners with a large amoiunt of gotchis. Also allows us to get the set bonuses added to the traits.
 * @param {ethers.Contract} contract - Aavegotchi contract.
 * @param {string} address - Address of owners wallet.
 * @returns {Promise<FetchAavegotchisRes>} Promise object represents success status + corresponding data
 */
export const getAavegotchisForUser = async (
  contract: Contract,
  address: string
): Promise<FetchAavegotchisRes> => {
  const query = `
    {
      aavegotchis(where: {owner: "${address.toLowerCase()}"}) {
        id
        name
        withSetsNumericTraits
        status
      }
    }
  `
  try {
    const response = await request<QueryResponse>(uri, query);
    console.log(response);

    // Filter out portals
    const gotchisOnly = response.aavegotchis.filter(
      (gotchi) => gotchi.status.toString() === "3"
    );

    if (gotchisOnly.length === 0)
      throw new Error(
        "No gotchis found - Please make sure your wallet is connected"
      );

    const gotchisWithSVGs = await _getAllAavegotchiSVGs(
      gotchisOnly || [],
      contract
    );
    return {
      status: 200,
      data: gotchisWithSVGs,
    };
  } catch (error) {
    return {
      status: 400,
      error: error,
    };
  }
};

const _getAavegotchiSvg = async (tokenId: string, contract: Contract) => {
  const svg = (await contract?.getAavegotchiSvg(tokenId)) as string;
  return svg;
};

const _getAllAavegotchiSVGs = async (
  gotchis: Array<AavegotchiContractObject>,
  contract: Contract
): Promise<Array<AavegotchiObject>> => {
  return Promise.all(
    gotchis.map(async (gotchi) => {
      const svg = await _getAavegotchiSvg(gotchi.id, contract);
      return {
        ...gotchi,
        svg,
      };
    })
  );
};
