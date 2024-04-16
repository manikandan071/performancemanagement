import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import * as moment from "moment";
import "../../components/style.css";
import styles from "./EmployeeStyle.module.scss";
import PredefinedGoals from "../PreDefinedGoal/PredefinedGoalsComponent";
import SelfGoals from "../SelfGoals/SelfGoalsComponent";
import { PiTargetBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import Button from "@mui/material/Button";
// import GoalsComponent from "../Manager/GoalsComponent";
// import PredefinedGoals from "../PreDefinedGoal/PredefinedGoalsComponent";

const EmployeeComponent = (props: any) => {
  console.log(props);

  const [masterData, setmasterData] = useState([{}]);
  const [show, setShow] = useState("PredefinedGoals");
  const getDetails = () => {
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.get()
      .then((items) => {
        items.forEach((AppraisalCyclesValues) => {
          setmasterData([
            {
              ID: AppraisalCyclesValues.ID,
              Year: AppraisalCyclesValues.Title,
              cycleCategory: AppraisalCyclesValues.cycleCategory,
              startDate: moment(AppraisalCyclesValues.startDate).format(
                "DD/MM/YYYY"
              ),
              endDate: moment(AppraisalCyclesValues.endDate).format(
                "DD/MM/YYYY"
              ),
            },
          ]);
        });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const init = () => {
    getDetails();
  };

  useEffect(() => {
    init();
  }, []);
  console.log(masterData);

  return (
    <>
      <div className={styles.background}>
        <div className={styles.container02}>
          <div
            className={styles.AppraisalCycles}
            style={{ paddingBottom: "10px" }}
          >
            <Button
              onClick={() => setShow("PredefinedGoals")}
              size="small"
              style={{
                color: show == "PredefinedGoals" ? "#496969" : "#a5c0c0",
                borderBottom:
                  show == "PredefinedGoals" ? "2px solid green" : "",
              }}
            >
              <PiTargetBold
                style={{
                  paddingRight: "5px",
                  fontSize: "22px",
                  color: show == "PredefinedGoals" ? "#496969" : "#a5c0c0",
                }}
              />
              PREDEFINEDGOALS
            </Button>
          </div>
          <div>
            <Button
              onClick={() => setShow("SelfGoals")}
              size="small"
              style={{
                color: show == "SelfGoals" ? "#496969" : "#a5c0c0",
                borderBottom: show == "SelfGoals" ? "2px solid green" : "",
              }}
            >
              <BiTargetLock
                style={{
                  paddingRight: "5px",
                  fontSize: "22px",
                  color: show == "SelfGoals" ? "#496969" : "#a5c0c0",
                }}
              />
              SELFGOALS
            </Button>
          </div>
        </div>
        <div>
          {show == "PredefinedGoals" ? (
            <PredefinedGoals
              userEmail={props.currentUserEmail}
              curUser={props.currentUserEmail}
              isManager={props.isManager}
            />
          ) : show == "SelfGoals" ? (
            <SelfGoals curUser={props.curUser} isManager={props.isManager} />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default EmployeeComponent;
