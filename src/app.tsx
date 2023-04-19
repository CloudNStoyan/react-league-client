import Matches from "./Matches";
import Settings from "./Settings";
import { useAppSelector } from "./hooks";

const App = () => {
  const summonerStatus = useAppSelector(
    (state) => state.settingsReducer.status
  );

  return (
    <div className="flex flex-col justify-center items-center">
      {summonerStatus === "succeeded" ? <Matches /> : <Settings />}
    </div>
  );
};

export default App;
