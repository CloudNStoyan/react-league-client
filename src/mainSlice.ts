import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GameMatch } from "./apiTypes";
import { FetchStatus, getMatch, getMatches, getSummoner } from "./server-api";

export interface MainState {
  matches: GameMatch[];
  status: FetchStatus;
  offset: number;
  limit: number;
  ddragonVersion: string;
  ddragonVersionStatus: FetchStatus;
}

const initialState: MainState = {
  matches: [],
  status: "idle",
  offset: 0,
  limit: 5,
  ddragonVersion: null,
  ddragonVersionStatus: "idle",
};

export const fetchDDragonVersion = createAsyncThunk(
  "main/fetchDDragonVersion",
  async () => {
    const response = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json"
    );
    const versions: string[] = await response.json();

    return versions[0];
  }
);

export const fetchSummoner = createAsyncThunk(
  "main/fetchSummoner",
  async (summonerName: string) => {
    const summoner = await getSummoner(summonerName);

    return summoner;
  }
);

export const fetchMatches = createAsyncThunk(
  "main/fetchMatches",
  async (summonerPuuid: string) => {
    const matchIds = await getMatches(summonerPuuid);

    const matches = await Promise.all(
      matchIds.map((matchId) => getMatch(matchId))
    );

    return matches;
  }
);

const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.matches = action.payload;
      })
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMatches.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(fetchDDragonVersion.fulfilled, (state, action) => {
        state.ddragonVersionStatus = "succeeded";
        state.ddragonVersion = action.payload;
      })
      .addCase(fetchDDragonVersion.pending, (state) => {
        state.ddragonVersionStatus = "loading";
      })
      .addCase(fetchDDragonVersion.rejected, (state) => {
        state.ddragonVersionStatus = "failed";
      });
  },
});

export const {} = mainSlice.actions;
export default mainSlice.reducer;
