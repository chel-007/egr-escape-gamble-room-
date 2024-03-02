import { FC } from 'react';

import classes from './Dashboard.module.css';

interface GameOptionProps {
  selected: boolean;
  gameName: string;
  Icon: FC<any>; // You can adjust the type of Icon as per your actual icon component
  onClick: () => void;
}

const GameOption: FC<GameOptionProps> = ({ selected, gameName, Icon, onClick }) => {
  const activeClass = selected ? 'roomactive' : 'roominactive';
  const bgClass = selected ? classes.roomactiveBg : classes.roominactiveBg;
  const iconClass = selected ? classes.roomactiveIcon : classes.roominactiveIcon;
  const textClass = selected ? classes.activeTextBlock : classes.inactiveTextBlock;
  
  return (
    <div className={`${classes.gameOptionsCont} ${classes[activeClass]}`} onClick={onClick}>
      <div className={bgClass}>
        <div className={iconClass}>
          <Icon className={classes.icon2}/>
        </div>
      </div>
      <div className={classes.roomText}>
        <div className={textClass}>{gameName}</div>
      </div>
    </div>
  );
};

export default GameOption;
