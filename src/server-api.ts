import { GameMatch, SummonerDTO } from "./apiTypes";

const BASE_ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:8004" : "/api";

export type FetchStatus = "loading" | "succeeded" | "failed" | "idle";

export const getMatches = async (summonerPuuid: string) => {
  const resp = await fetch(`${BASE_ENDPOINT}/matches/${summonerPuuid}`);

  const matches: string[] = await resp.json();

  return matches;
};

export const getMatch = async (matchId: string) => {
  const resp = await fetch(`${BASE_ENDPOINT}/match/${matchId}`);

  const match: GameMatch = await resp.json();

  return match;
};

export const getSummoner = async (summonerName: string) => {
  const resp = await fetch(`${BASE_ENDPOINT}/summoner/${summonerName}`);

  const summoner: SummonerDTO = await resp.json();

  return summoner;
};
