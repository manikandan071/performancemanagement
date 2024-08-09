/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { memo, useState } from "react";

import { PiTargetBold } from "react-icons/pi";
import Button from "@mui/material/Button";
import styles from "./goalScreenHeader.module.scss";
import { BiTargetLock } from "react-icons/bi";
import { Dropdown } from "primereact/dropdown";

interface Iprops {
  cyclesList: any;
  selectCycle: any;
  navigateTab: (value: string) => void;
  onChangeHandleFun: (value: string) => void;
}

const goalScreenHeader = ({
  cyclesList,
  selectCycle,
  navigateTab,
  onChangeHandleFun,
}: Iprops) => {
  const [show, setShow] = useState("PredefinedGoals");
  return (
    <div className={styles.sectionHeaderWrapper}>
      <div
        className={show === "PredefinedGoals" ? "predefinedGoal" : "selfGoal"}
      >
        <div
          className={styles.AppraisalCycles}
          //   style={{ paddingBottom: "10px" }}
        >
          <Button
            onClick={() => {
              setShow("PredefinedGoals");
              navigateTab("PredefinedGoals");
            }}
            size="small"
            style={{
              color: show === "PredefinedGoals" ? "#ae9447" : "#a5c0c0",
              // borderBottom:
              //   show === "PredefinedGoals" ? "2px solid #1cbf1c" : "",
              border: "1px solid #00ff3921",
              backgroundColor: show === "PredefinedGoals" ? "#00ff3921" : "",
              borderRadius: "0px",
            }}
          >
            <PiTargetBold
              style={{
                paddingRight: "5px",
                fontSize: "22px",
                color: show === "PredefinedGoals" ? "#ae9447" : "#a5c0c0",
                // backgroundColor: show == "PredefinedGoals" ? "#35803510" : "",
              }}
            />
            PREDEFINEDGOALS
          </Button>
        </div>
        <div className={styles.AppraisalCycles}>
          <Button
            onClick={() => {
              setShow("SelfGoals");
              navigateTab("SelfGoals");
            }}
            size="small"
            style={{
              color: show === "SelfGoals" ? "#ae9447" : "#a5c0c0",
              // borderBottom: show === "SelfGoals" ? "2px solid #1cbf1c" : "",
              border: "1px solid #00ff3921",
              backgroundColor: show === "SelfGoals" ? "#00ff3921" : "",
              borderRadius: "0px",
            }}
          >
            <BiTargetLock
              style={{
                paddingRight: "5px",
                fontSize: "22px",
                color: show === "SelfGoals" ? "#ae9447" : "#a5c0c0",
              }}
            />
            SELFGOALS
          </Button>
        </div>
      </div>
      <div className="DrpYear">
        <Dropdown
          value={selectCycle}
          onChange={(e) => onChangeHandleFun(e.value)}
          options={cyclesList}
          optionLabel="name"
          placeholder="Select appraisal Cycle"
          className="w-full md:w-20rem"
        />
      </div>
    </div>
  );
};
export default memo(goalScreenHeader);
