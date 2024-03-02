import { memo, useState } from 'react';
import type { FC } from 'react';
import resets from '../_resets.module.css';
import { BalanceIcon } from './BalanceIcon';
import classes from './Dashboard.module.css';
import { DividerIcon } from './DividerIcon';
import { DollarIcon } from './DollarIcon';
import { EscaperoomIconIcon } from './EscaperoomIconIcon';
import { GameroomIcon } from './GameroomIcon';
import { InfoIconIcon } from './InfoIconIcon';
import { LeaderboardsIcon } from './LeaderboardsIcon';
import { Line1Icon } from './Line1Icon';
import { NavLineIcon } from './NavLineIcon';
import { ProfileBgIcon } from './ProfileBgIcon';
import { SpectateIcon } from './SpectateIcon';
import { StarIcon } from './StarIcon';
import { VectorIcon } from './VectorIcon';
import GameOption from './GameOption';
import GetRoomList from '../../rooms/GetRoomList';
import createRoom from "../../rooms/CreateRoom"; 
import WalletConnector from '../walletConnector';
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface Props {
  className?: string;
}
/* @figmaId 68:2 */
export const Dashboard: FC<Props> = memo(function Dashboard(props = {}) {

  const [selectedGame, setSelectedGame] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeOption, setActiveOption] = useState('JOIN ROOM');

  const { connected } = useWallet();

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  const [selectedLink, setSelectedLink] = useState('gameroom');

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  const games = [
    { name: "Escape Room", icon: EscaperoomIconIcon },
    { name: "Duels", icon: EscaperoomIconIcon },
    // Add more game options as needed
  ];

  const handleCreateRoomClick = async () => {
    setIsLoading(true);
    // Call the createRoom function
    await createRoom(setIsLoading);
    setIsLoading(false); // Once the createRoom function completes, set isLoading to false
};
  
  
  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.mainBG}>
      <div className={classes.sideNavBG}>
        <div className={classes.profileBG}>
          <ProfileBgIcon className={classes.icon} />
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


    <div className={classes.gameTitleBg}>
      <div className={classes.aPTOS}>APTOS</div>
      <div className={classes.star}>
        <StarIcon className={classes.icon3} />
      </div>
      <div className={classes.eGR}>EGR</div>
    </div> {/*End of div with class gameTitleBg. */}

      {/* <div className={classes.line1}>
        <Line1Icon className={classes.icon4} />
      </div> */}

    
  {selectedLink === 'gameroom' && (
    // Render elements for the gameroom link

    <div className={classes.midSectionBg}>
      <div className={classes.midSectionGradient}>
        <div className={classes.roomdetailsBg}>
          <div className={classes.roomactionHeader}>
            <div
              className={`${activeOption === 'JOIN ROOM' ? classes.activeBg : classes.inactiveBg}`}
              onClick={() => handleOptionClick('JOIN ROOM')}>
              <div className={`${classes.jOINROOM} ${activeOption !== 'JOIN ROOM' ? classes.roomactionOpt: ''}`}>JOIN ROOM</div>
            </div>
            <div
              className={`${activeOption === 'CREATE ROOM' ? classes.activeBg : classes.inactiveBg}`}
              onClick={() => handleOptionClick('CREATE ROOM')}>
              <div className={`${classes.cREATEROOM} ${activeOption !== 'CREATE ROOM' ? classes.roomactionOpt : ''}`}>CREATE ROOM</div>
            </div>

          </div> {/*End of div with class roomactionHeader. */}

          {/* Conditionally render room contents based on the active option */}
            {activeOption === 'JOIN ROOM' && (
              <div className={classes.roomRes}>
                  <div className={classes.roomNav}>
                    <div className={classes.roomIdHeader}>room-id</div>
                    <div className={classes.roomCreatorHeader}>room-creator</div>
                    <div className={classes.roomSizeHeader}>room-size</div>
                    <div className={classes.availableSeatsHeader}>available-seats</div>
                    <div className={classes.spectatorsHeader}>spectators</div>
                    <div className={classes.roomBettingHeader}>room-betting</div>
                  </div>

                  <div className={classes.roomBg}>
                    <div className={classes.roomId}>001</div>
                    <div className={classes.roomCreator}>revanth91</div>
                    <div className={classes.roomSize}>100</div>
                    <div className={classes.availableSeats}>30/100</div>
                    <div className={classes.spectators}>20</div>
                    <div className={classes.roomBetting}>5 APT</div>
                  </div>  {/*End of div with class roomBg. */}
                  {activeOption === 'JOIN ROOM' && (
                  <>
                    <GetRoomList setRooms={setRooms} setIsLoading={setIsLoading} />
                    {isLoading ? (
                      <div className={classes.roomBg}>
                        <div className={classes.roomId}>loading...</div>
                        <div className={classes.roomCreator}>loading...</div>
                        <div className={classes.roomSize}>loading...</div>
                        <div className={classes.availableSeats}>loading...</div>
                        <div className={classes.spectators}>loading...</div>
                        <div className={classes.roomBetting}>loading...</div>
                      </div>
                    ) : (
                      rooms.map((room) => (
                      <div className={classes.roomBg}>
                        <div className={classes.roomId}>{room}</div>
                      </div>
                      ))
                    )}
                  </>
                  )}

              </div>
            )}




            {activeOption === 'CREATE ROOM' && (

              <div className={classes.createRoomDiv}>
              <button className={classes.createRoomBtn} 
              onClick={handleCreateRoomClick} >CREATE NEWROOM
              </button>
              {isLoading && <p>new room is being created</p>}
              </div>

            )}

          
        </div> {/*End of div with class roomdetailsBg. */}
      </div> {/*End of div with class midSectionGradient. */}
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
        {/* <div className={classes.textBlock3}> */}
          In Escape Gamble room, players battle random events to emerge as the winner taking all the room bets. Players
          are spawned randomly on{' '}
        {/* </div> */}
        {/* <div className={classes.textBlock4}> */}
          tiles in the room, and at each turn, they can make a move in four directions (UP,LEFT,RIGHT,DOWN). The Random
          API will also make it’s move,{' '}
        {/* </div> */}
        {/* <div className={classes.textBlock5}> */}
          bringing a myraid of unforseen events for players to comback, avoid or invite. Good and bad events occur
          throughout the game, so play smart.{' '}
        {/* </div> */}
      </div>

    </div> {/*End of div with class howto. */}
      
      {/* <div className={classes.rectangle7}></div> */}
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

    {/* <div className={classes.connect}>
      <div className={classes.balance}>
        <BalanceIcon className={classes.icon13} />
      </div>

      <div className={classes.connectwalletBg}>
        <div className={classes.dollar}>
          <DollarIcon className={classes.icon12} />
        </div>
        <div className={classes.loginText}>login</div>
      </div>
    </div> */}
    <WalletConnector />

    </div>  {/* End of div with class navBar. */}
    </div>

  </div>
  );
});
