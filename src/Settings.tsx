import { useState } from "react";
import { useAppDispatch } from "./hooks";
import { fetchSummoner } from "./settingsSlice";

const Settings = () => {
  const dispatch = useAppDispatch();
  const [summonerName, setSummonerName] = useState("");
  const onLoad = () => {
    dispatch(fetchSummoner(summonerName));
  };

  const onSummonerNameChange = (e: { target: { value: string } }) => {
    setSummonerName(e.target.value);
  };

  return (
    <div className="m-2">
      <div className="flex gap-5">
        <input
          className="border-2 border-purple-400 p-2"
          value={summonerName}
          onChange={onSummonerNameChange}
          onBlur={onSummonerNameChange}
        />
        <button
          onClick={onLoad}
          className="border-2 border-purple-400 p-2"
          type="button"
        >
          Load
        </button>
      </div>
    </div>
  );
};

export default Settings;
