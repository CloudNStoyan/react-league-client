import { FunctionComponent, useState } from "react";
import { GameMatch, Participant } from "./apiTypes";
import { format } from "timeago.js";
import styled from "styled-components";
import { staticSummonerData, SummonerSpellType } from "../static/summoner";
import {
  RuneSubTreeType,
  RuneKeystone,
  staticRunesData,
} from "../static/runes";
import { ItemType, staticItemsData } from "../static/items";
import { useAppSelector } from "./hooks";

interface MatchComponentProps {
  match: GameMatch;
}

const GetData = (match: GameMatch, playerPuuid: string) => {
  const player = match.info.participants.find((p) => p.puuid === playerPuuid);

  const endDate = new Date(match.info.gameEndTimestamp);

  const gameLength = format(endDate);

  const duration = `${Math.floor(match.info.gameDuration / 60)}m ${
    match.info.gameDuration % 60
  }s`;

  const summonerSpells = [player.summoner1Id, player.summoner2Id].map((id) =>
    staticSummonerData.find((s) => s.key === id.toString())
  );

  const champSquareSrc = `http://ddragon.leagueoflegends.com/cdn/13.5.1/img/champion/${player.championName}.png`;

  const keystoneData = player.perks.styles[0];
  const subTreeId = player.perks.styles[1].style;

  const keystone = staticRunesData
    .find((c) => c.id === keystoneData.style)
    .slots[0].runes.find((c) => c.id === keystoneData.selections[0].perk);

  const subTree = staticRunesData.find((c) => c.id === subTreeId);

  const itemIds = [
    player.item0,
    player.item1,
    player.item2,
    player.item3,
    player.item4,
    player.item5,
    player.item6,
  ];

  const items = itemIds.map((id) => staticItemsData.find((x) => x.id === id));

  const participants = match.info.participants;

  const matchData = {
    gameMode: match.info.gameMode,
    gameLength,
    player,
    duration,
    champSquareSrc,
    summonerSpells,
    keystone,
    subTree,
    items,
    participants,
  };

  return matchData;
};

const MatchComponentStyled = styled.div`
  .length {
    width: 100px;
  }

  .participant-name {
    width: 150px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .champ {
    position: relative;
    span {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #333;
      color: white;
      border-radius: 50%;
      font-size: 11px;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      z-index: 100;
    }
  }

  .kda {
    font-weight: 500;

    > :not(:last-child)::after {
      content: "/";
      margin: 0 2px;
      color: gray;
    }

    .deaths {
      color: red;
    }
  }
  .victory::after,
  .defeat::after {
    display: block;
    content: " ";
    width: 50px;
    height: 3px;
  }

  .defeat::after {
    background-color: red;
  }

  .victory::after {
    background-color: blue;
  }
`;

const SummonerSpell: FunctionComponent<{ spell: SummonerSpellType }> = ({
  spell,
}) => {
  const ddragonVersion = useAppSelector(
    (state) => state.mainReducer.ddragonVersion
  );

  return (
    <div>
      <img
        title={spell.name}
        width={20}
        height={20}
        src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${spell.image.full}`}
      />
    </div>
  );
};

const Rune: FunctionComponent<{ rune: RuneSubTreeType | RuneKeystone }> = ({
  rune,
}) => {
  return (
    <div>
      <img
        title={rune.name}
        width={20}
        height={20}
        src={`https://ddragon.canisback.com/img/${rune.icon}`}
      />
    </div>
  );
};

const Item: FunctionComponent<{ item?: ItemType }> = ({ item }) => {
  if (!item) {
    return <div className="w-8 h-8 bg-slate-300"></div>;
  }

  const ddragonVersion = useAppSelector(
    (state) => state.mainReducer.ddragonVersion
  );

  return (
    <div className="w-8 h-8">
      <img
        title={item.name}
        src={`http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${item.image.full}`}
      />
    </div>
  );
};

const Summoner: FunctionComponent<{
  participant: Participant;
  onPlayerClick: () => void;
  selected: boolean;
}> = ({ participant, onPlayerClick, selected }) => {
  const ddragonVersion = useAppSelector(
    (state) => state.mainReducer.ddragonVersion
  );

  const champSquareSrc = `http://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${participant.championName}.png`;
  return (
    <a
      className={`flex gap-2 items-center cursor-pointer select-none ${
        selected ? "font-semibold" : "opacity-75"
      }`}
      onClick={onPlayerClick}
    >
      <div>
        <img
          title={participant.championName}
          height={16}
          width={16}
          src={champSquareSrc}
        />
      </div>
      <span className="participant-name text-sm">
        {participant.summonerName}
      </span>
    </a>
  );
};

const MatchComponent: FunctionComponent<MatchComponentProps> = ({ match }) => {
  const summoner = useAppSelector((state) => state.settingsReducer.summoner);

  const [playerPuuid, setPlayerPuuid] = useState(summoner.puuid);
  const {
    gameMode,
    gameLength,
    player,
    duration,
    champSquareSrc,
    summonerSpells,
    keystone,
    subTree,
    items,
    participants,
  } = GetData(match, playerPuuid);
  return (
    <MatchComponentStyled className="flex">
      <div className="flex">
        <div>
          <div>{gameMode}</div>
          <div className="text-sm length">{gameLength}</div>
          <div className={player.win ? "victory" : "defeat"}>
            {player.win ? "Victory" : "Defeat"}
          </div>
          <div>{duration}</div>
        </div>
        <div className="flex flex-col justify-around">
          <div className="flex gap-1">
            <div className="champ">
              <img
                title={player.championName}
                width={48}
                height={48}
                src={champSquareSrc}
              />
              <span>{player.champLevel}</span>
            </div>
            <div className="flex flex-col gap-1 justify-center">
              {summonerSpells.map((spell) => (
                <SummonerSpell spell={spell} key={spell.key} />
              ))}
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <Rune rune={keystone} />
              <Rune rune={subTree} />
            </div>
            <div className="kda">
              <span>{player.kills}</span>
              <span className="deaths">{player.deaths}</span>
              <span>{player.assists}</span>
            </div>
          </div>
          <div className="flex gap-1">
            {items.map((item, idx) => (
              <Item item={item} key={item?.id ?? idx} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 ml-2">
        <div>
          {participants
            .filter((c) => c.teamId === player.teamId)
            .map((c) => (
              <Summoner
                selected={c.puuid == playerPuuid}
                participant={c}
                key={c.summonerId}
                onPlayerClick={() => setPlayerPuuid(c.puuid)}
              />
            ))}
        </div>
        <div>
          {participants
            .filter((c) => c.teamId !== player.teamId)
            .map((c) => (
              <Summoner
                selected={c.puuid == playerPuuid}
                participant={c}
                key={c.summonerId !== "BOT" ? c.summonerId : c.summonerName}
                onPlayerClick={() => setPlayerPuuid(c.puuid)}
              />
            ))}
        </div>
      </div>
    </MatchComponentStyled>
  );
};

export default MatchComponent;
