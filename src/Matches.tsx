import { useEffect } from "react";
import { fetchDDragonVersion, fetchMatches } from "./mainSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import MatchComponent from "./MatchComponent";

const Matches = () => {
  const dispatch = useAppDispatch();
  const { matches, ddragonVersionStatus, status } = useAppSelector(
    (state) => state.mainReducer
  );

  const { summoner } = useAppSelector((state) => state.settingsReducer);

  useEffect(() => {
    if (status !== "idle") {
      return;
    }

    dispatch(fetchMatches(summoner.puuid));
  }, [status]);

  useEffect(() => {
    if (ddragonVersionStatus !== "idle") {
      return;
    }

    dispatch(fetchDDragonVersion());
  }, [ddragonVersionStatus]);

  return (
    <div>
      <div className="flex flex-col justify-center gap-2 p-2">
        {matches.length > 0 &&
          matches.map((c) => (
            <MatchComponent match={c} key={c.metadata.matchId} />
          ))}
      </div>
      <div className="flex justify-center items-center w-full mt-2">
        <button
          className="border-purple-400 border-2 p-2 text-purple-400 font-semibold"
          type="button"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Matches;
