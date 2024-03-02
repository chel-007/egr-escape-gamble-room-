import { memo, useEffect } from "react";
import type { FC } from "react";
import { useNavigate } from 'react-router-dom';

import resets from "../_resets.module.css";
import { BackroundIcon } from "./BackroundIcon";
import { Group12Icon } from "./Group12Icon";
import { Group13Icon } from "./Group13Icon";
import { Group13Icon2 } from "./Group13Icon2";
import { Group16Icon } from "./Group16Icon";
import classes from "./TV1.module.css";
import { Tv1Icon } from "./Tv1Icon";
import { VectorIcon } from "./VectorIcon";
import { VectorIcon2 } from "./VectorIcon2";
import { gsap } from "gsap";

interface Props {
  className?: string;
}
/* @figmaId 33:4502 */
export const TV1: FC<Props> = memo(function TV1(props = {}) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    // Navigate to the Dashboard page
    navigate('/dashboard');
  };

  useEffect(() => {
    const chel = document.querySelector(`.${classes.chel}`);

    function handleHover() {
      gsap.to(chel, { y: -50, duration: 0.5, yoyo: true, repeat: 6 });
    }

    function handleMouseOut() {
      gsap.to(chel, { y:0, duration: 0.5, yoyo: true, repeat: 1 });
    }

    chel?.addEventListener("mouseenter", handleHover);
    chel?.addEventListener("mouseleave", handleMouseOut);

    return () => {
      chel?.removeEventListener("mouseenter", handleHover);
      chel?.addEventListener("mouseleave", handleMouseOut);
    };
  }, []);


  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.rectangle4}></div>
      <div className={classes.dice675482_19201}></div>
      <div className={classes.group12}>
        <Group12Icon className={classes.icon} />
      </div>
      {/* <div className={classes.cover}></div> */}

      <div className={classes.room}>
      <div className={classes.rO}>RO</div>
      <div className={classes.icon2}>
        <Tv1Icon className={classes.icon3} />
      </div>
      <div className={classes.oM}>OM</div>
      </div>
      <div className={classes.eSCAPEGAMBLE}>ESCAPE GAMBLE</div>
      <div className={classes.neon}>
      <div className={classes.group16}>
        <Group16Icon className={classes.icon4} />
      </div>
      </div>
      <div className={classes.backround}>
        <BackroundIcon className={classes.icon5} />
      </div>
      {/* <div className={classes.group13}>
        <Group13Icon className={classes.icon6} />
      </div> */}
      <div className={classes.surviveTheRoomChanceVsSkill}>
        <p className={classes.labelWrapper}>
          <span id = "main"className={classes.label}>survive the room: chance vs skill</span>
        </p>
      </div>
      <div className={classes.frame126605} onClick={handleButtonClick}>
        <div className={classes.playGame}>Play Game!</div>
      </div>
      <div className={classes.chel}>
      <div className={classes.autoLayoutHorizontal}>
        <div className={classes.chel007}>chel007</div>
      </div>
      <div className={classes.vector}>
        <VectorIcon className={classes.icon8} />
      </div>
      </div>
      <div className={classes.autoLayoutHorizontal2}>
        <div className={classes.revanth91}>revanth91</div>
      </div>
      <div className={classes.vector2}>
        <VectorIcon2 className={classes.icon9} />
      </div>
    </div>
  );
});
