import * as React from "react";
import Button from "@mui/material/Button";
import styles from "./ManagerStyle.module.scss";
import {useState } from "react";
import PredefinedGoals from "./PredefinedGoalsComponent";
import SelfGoals from "./SelfGoalsComponent";
import { PiTargetBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
const GoalsComponent = (props: any) => {
  console.log(props,"propsGoal")
    const[show,setShow] = useState("PredefinedGoals");
    
  return (
    <>
      <div className={styles.background}>
      <div className={styles.container02}>
        <div className={styles.AppraisalCycles} style={{paddingBottom : "10px"}}>
          <Button onClick={() => setShow("PredefinedGoals")} size="small" style={{color : show == "PredefinedGoals" ? "#496969" : "#a5c0c0",borderBottom : show == "PredefinedGoals" ?"2px solid green" : ""}}>
          <PiTargetBold style={{paddingRight : "5px", fontSize : "22px" ,color : show == "PredefinedGoals" ? "#496969" : "#a5c0c0"}} />PREDEFINEDGOALS
          </Button>
        </div>
        <div>
          <Button onClick={() => setShow("SelfGoals")} size="small" style={{color : show == "SelfGoals" ? "#496969" : "#a5c0c0",borderBottom : show == "SelfGoals" ?"2px solid green" : ""}}>
          <BiTargetLock style={{paddingRight : "5px", fontSize : "22px" ,color : show == "SelfGoals" ? "#496969" : "#a5c0c0"}}/>SELFGOALS
          </Button>
        </div>
      </div>
      <div>
        {show == "PredefinedGoals" ? <PredefinedGoals userEmail = {props.memberEmail} curUser = {props.curUser} /> : show == "SelfGoals" ? <SelfGoals/> : ""}
      </div>
      </div>
    </>
  );
};
export default GoalsComponent;
