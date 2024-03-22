import { memo, useEffect, useState } from 'react';
import type { FC } from 'react';
import resets from '../_resets.module.css';
import classes from './Dashboard.module.css';
import { DividerIcon } from './DividerIcon';
import { EscaperoomIconIcon } from './EscaperoomIconIcon';
import { GameroomIcon } from './GameroomIcon';
import { InfoIconIcon } from './InfoIconIcon';
import { LeaderboardsIcon } from './LeaderboardsIcon';
import { ProfileBgIcon } from './ProfileBgIcon';
import { SpectateIcon } from './SpectateIcon';
import { StarIcon } from './StarIcon';
import { VectorIcon } from './VectorIcon';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import Toast from "../ui/new-toast"; 
import logo from '../../assets/egr.png'
import GameOption from './GameOption';
import GetRoomList from '../../rooms/GetRoomList';
import CreateRoom from "../../rooms/CreateRoom"; 
import JoinRoom from '../../rooms/JoinRoom';
import GetRoomByID from '../../rooms/GetRoomByID';
import SpectateRoom from '../../rooms/SpectateRoom';
import WalletConnector from '../walletConnector';
import {
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import ActiveGame from '../ActiveGame';

interface Props {
  className?: string;
}


interface Room {
  active: boolean;
  id: string;
  max_player_count: number;
  name: string;
  player_count: string;
}

interface DetailedRoom {
  active: boolean;
  id: string;
  max_player_count: number;
  name: string;
  player_count: string;
  players_list: [];
}

/* @figmaId 68:2 */

export const Dashboard: FC<Props> = memo(function Dashboard(props = {}) {

  const [selectedGame, setSelectedGame] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [detailedRooms, setDetailedRooms] = useState<DetailedRoom[]>([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [txnInProgress, setTxnInProgress] = useState(false);
  const [activeOption, setActiveOption] = useState('JOIN ROOM');

  const { isLoading, connected, account, network } = useWallet();

  const { toast } = useToast();

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  const [retryClicked, setRetryClicked] = useState(false);

  const handleSpectateRetry = () => {
    setIsLoading(true);
    setRetryClicked(!retryClicked);
    setIsLoading(false);
  };

  const [selectedLink, setSelectedLink] = useState('gameroom');

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  const games = [
    { name: "Escape Room", icon: EscaperoomIconIcon },
    { name: "Duels", icon: EscaperoomIconIcon },
  ];
 
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <ActiveGame></ActiveGame>
      <div className={classes.mainBG}>
      <div className={classes.sideNavBG}>
        <div className={classes.profileBG}>
          <ProfileBgIcon className={classes.icon} />
          <img src={logo} className={classes.logo} />
        </div>

        <div className={classes.gameOptionsCont}>
          {games.map((game, index) => (
            <GameOption
              key={index}
              selected={selectedGame === index}
              gameName={game.name}
              Icon={game.icon}
              onClick={() => setSelectedGame(index)}
            />
          ))}
        </div> {/*End of div with class gameOptionsCont. */}
      </div> {/*End of div with class sideNav. */}

      {connected && network && network.name.toString() !== "RandomNet" && (
        <Toast title="Wrong Network" description="Please switch your network to RandomNet to use this app!" />
      )}
      

          

    
{selectedGame === 0 && (
  <>
    {selectedLink === 'gameroom' && (
      <div className={classes.midSectionBg}>
        <div className={classes.midSectionGradient}>
          <div className={classes.roomdetailsBg}>
            <div className={classes.roomactionHeader}>
              <div
                className={`${activeOption === 'JOIN ROOM' ? classes.activeBg : classes.inactiveBg}`}
                onClick={() => handleOptionClick('JOIN ROOM')}
              >
                <div className={`${classes.jOINROOM} ${activeOption !== 'JOIN ROOM' ? classes.roomactionOpt : ''}`}>
                  JOIN ROOM
                </div>
              </div>
              <div
                className={`${activeOption === 'CREATE ROOM' ? classes.activeBg : classes.inactiveBg}`}
                onClick={() => handleOptionClick('CREATE ROOM')}
              >
                <div className={`${classes.cREATEROOM} ${activeOption !== 'CREATE ROOM' ? classes.roomactionOpt : ''}`}>
                  CREATE ROOM
                </div>
              </div>
            </div>

            {activeOption === 'JOIN ROOM' && (
              <div className={classes.roomRes}>
                <div className={classes.roomNav}>
                  <div className={classes.roomIdHeader}>room-id</div>
                  <div className={classes.roomCreatorHeader}>room-creator</div>
                  <div className={classes.roomSizeHeader}>room-size</div>
                  <div className={classes.availableSeatsHeader}>available-seats</div>
                  <div className={classes.spectatorsHeader}>spectators</div>
                  <div className={classes.roomBettingHeader}>room-betting</div>
                  <div className={classes.roomBettingHeader}>status</div>
                </div>

                {activeOption === 'JOIN ROOM' && (
                  <>
                    {/* <GetRoomList setRooms={setRooms} setIsLoading={setIsLoading} /> */}
                    <GetRoomByID setIsLoading={setIsLoading} setDetailedRooms={setDetailedRooms} />
                    {isLoading ? (
                        <div className={classes.roomBg}>
                         <div className={classes.roomBg}>
                        <div className={classes.roomId}>...</div>
                        <div className={classes.roomCreator}>...</div>
                        <div className={classes.roomSize}>...</div>
                        <div className={classes.availableSeats}>...</div>
                        <div className={classes.spectators}>...</div>
                        <div className={classes.roomBetting}>...</div>
                        <div className={classes.roomStatus}>...</div>
                      </div>
                      </div>
                    ) : (
                      detailedRooms.flat().map((detailedRoom) => (
                        detailedRoom && (
                      <div className={classes.roomBg} key={detailedRoom.id}>
                        {/* Your room details */}
                        <div className={classes.roomId}>{detailedRoom.id}</div>
                        <div className={classes.roomId}>New Room</div>
                        <div className={classes.roomId}>5</div>
                        <div className={classes.roomId}>{detailedRoom.players_list.length} / 5</div>
                        <div className={classes.roomId}>{detailedRoom.active.toString()}</div>
                        <div className={classes.roomId}>{detailedRoom.active.toString()}</div>
                        <div className={classes.roomStatus}>
                          {/* Pass detailed room ID to JoinRoom component */}
                          <JoinRoom key={detailedRoom.id} detailedRoom={detailedRooms} roomId={detailedRoom.id} setIsLoading={setIsLoading} />
                        </div>
                        </div>
                          )
                        ))
                      )}
                  </>
                )}
              </div>
            )}

            {activeOption === 'CREATE ROOM' && (
              <div className={classes.createRoomDiv}>
                <CreateRoom setTxn={setTxnInProgress} isTxnInProgress={txnInProgress} />
              </div>
            )}
          </div>
        </div>
      </div>
    )}

{selectedLink === 'spectate' && (
        <div className={classes.midSectionBg}>
          <div className={classes.midSectionGradient}>
            <div className={classes.roomdetailsBg}>
              <div className={classes.roomRes}>
                <div className={classes.roomNav}>
                  <div className={classes.roomIdHeader}>room-id</div>
                </div>
                {!retryClicked && (
                  <GetRoomList setRooms={setRooms} setIsLoading={setIsLoading} />
                )}
                {isLoading ? (
                  <div className={classes.roomBg}>
                    <div className={classes.roomId}>...</div>
                  </div>
                ) : (
                  rooms.flat().map((room) => (
                    <div className={classes.roomBg} key={room.id}>
                      <div className={classes.roomId}>{room.id}</div>
                      <SpectateRoom roomId={room.id} rooms={rooms} setIsLoading={setIsLoading} />
                    </div>
                  ))
                )}
              </div>
              <button className={classes.roomStatusJoin} onClick={handleSpectateRetry}>Retry</button>
            </div>
          </div>
        </div>
      )}


    <div className={classes.howto}>
      <div className={classes.divider}>
        <DividerIcon className={classes.icon5} />
      </div>
      <div className={classes.howtoplayBox}>
        <div className={classes.infoIcon}>
          <InfoIconIcon className={classes.icon6} />
        </div>
        <div className={classes.howToPlay}>how-to-play</div>
      </div>
      <div className={classes.howToPlayText}>
        In Escape Gamble room, players battle random events to emerge as the winner taking all the room bets. Players are spawned randomly on tiles in the room, and at each turn, they can make a move in four directions (UP, LEFT, RIGHT, DOWN). The Random API will also make its move, bringing a myriad of unforeseen events for players to come back, avoid, or invite. Good and bad events occur throughout the game, so play smart.
      </div>
    </div>
  </>
)}


{selectedGame === 1 && (
  <>
  <div className={classes.midSectionBg}>
  <div className={classes.midSectionGradient}></div>
  <div className={classes.comingSoonDiv}>
  <h1 className={classes.comingSoon}>Coming Soon!!!</h1>
  </div>
  </div>
  </>
  )}
      

    <div className={classes.gameTitleBg}>
      <div className={classes.aPTOS}>APTOS</div>
      <div className={classes.star}>
        <StarIcon className={classes.icon3} />
      </div>
      <div className={classes.eGR}>EGR</div>
    </div> {/*End of div with class gameTitleBg. */}


    <div className={classes.navBar}>
      <div className={classes.links}>
      <div
          className={`${classes.navLinkBox} `}
          onClick={() => handleLinkClick('gameroom')}
        >
          <div className={`${selectedLink === 'gameroom' ? classes.activeFill : classes.inactiveFill}`}>
          <GameroomIcon
            className={classes.navIcon}
            activeFill='#FDD800'
            inactiveFill='#586B90'
            isActive={selectedLink === 'gameroom'}
          />
          </div>
          <div className={`${selectedLink === 'gameroom' ? classes.activeLinkText : classes.inactiveLinkText}`}>gameroom</div>
        </div>

        <div 
          className={classes.navLinkBox}
          onClick={() => handleLinkClick('spectate')}
        >
          <div className={`${selectedLink === 'spectate' ? classes.activeFill : classes.inactiveFill}`}>
          <SpectateIcon
            className={classes.navSpecIcon}
            activeFill='#FDD800'
            inactiveFill='#586B90'
            isActive={selectedLink === 'spectate'}
          />
          </div>
          <div className={`${selectedLink === 'spectate' ? classes.activeLinkText : classes.inactiveLinkText}`}>spectate</div>
        </div>

        <div 
          className={classes.navLinkBox}
          onClick={() => handleLinkClick('leaderboards')}
        >
          <div className={`${selectedLink === 'leaderboards' ? classes.activeFill : classes.inactiveFill}`}>
          <LeaderboardsIcon
            className={classes.navIcon}
            activeFill='#FDD800'
            inactiveFill='#586B90'
            isActive={selectedLink === 'leaderboards'}
          />
          </div>
          <div className={`${selectedLink === 'leaderboards' ? classes.activeLinkText : classes.inactiveLinkText}`}>leaderboards</div>
        </div>

        <div 
          className={classes.navLinkBox}
          onClick={() => handleLinkClick('faq')}
        >
          <div className={`${selectedLink === 'faq' ? classes.activeFill : classes.inactiveFill}`}>
          <VectorIcon
            className={classes.navIcon}
            activeFill='#FDD800' // Example active fill color
            inactiveFill='#586B90' // Example inactive fill color
            isActive={selectedLink === 'faq'} // Example condition for active/inactive
          />
          </div>
          <div className={`${selectedLink === 'faq' ? classes.activeLinkText : classes.inactiveLinkText}`}>faq</div>
        </div>
      </div>
    <div className={classes.connect}>
    <WalletConnector />
    </div>

    </div>  {/* End of div with class navBar. */}
    </div>
  </div>
  );
});
