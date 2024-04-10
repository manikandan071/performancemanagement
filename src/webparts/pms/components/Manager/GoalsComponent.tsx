import * as React from "react";
import Button from "@mui/material/Button";
import styles from "./ManagerStyle.module.scss";
import {useState } from "react";
import PredefinedGoals from "./PredefinedGoalsComponent";
import SelfGoals from "./SelfGoalsComponent";
const GoalsComponent = (props: any) => {
  console.log(props,"propsGoal")
    const[show,setShow] = useState("PredefinedGoals");
    
  return (
    <>
      <div className={styles.container}>
        <div className={styles.AppraisalCycles}>
          <Button onClick={() => setShow("PredefinedGoals")} size="small" style={{color : show == "PredefinedGoals" ? "green" : ""}}>
            PREDEFINEDGOALS
          </Button>
        </div>
        <div>
          <Button onClick={() => setShow("SelfGoals")} size="small" style={{color : show == "SelfGoals" ? "green" : ""}}>
            SELFGOALS
          </Button>
        </div>
      </div>
      <div>
        {show == "PredefinedGoals" ? <PredefinedGoals userEmail = {props.memberEmail} curUser = {props.curUser} /> : show == "SelfGoals" ? <SelfGoals/> : ""}
      </div>
    </>
  );
};
export default GoalsComponent;
