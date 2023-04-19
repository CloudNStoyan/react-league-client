import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchStatus, getSummoner } from "./server-api";
import { SummonerDTO } from "./apiTypes";

export interface SettingsState {
  status: FetchStatus;
  summonerName: string;
  summoner: SummonerDTO | null;
}

const initialState: SettingsState = {
  status: "idle",
  summonerName: "",
  summoner: null,
};

export const fetchSummoner = createAsyncThunk(
  "settings/fetchSummoner",
  async (summonerName: string) => {
    const summoner = await getSummoner(summonerName);

    return summoner;
  }
);

const mainSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSummonerName: (state, action: PayloadAction<string>) => {
      state.summonerName = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSummoner.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summoner = action.payload;
      })
      .addCase(fetchSummoner.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSummoner.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {} = mainSlice.actions;
export default mainSlice.reducer;
