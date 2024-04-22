import * as React from "react";
import styles from "./ManagerStyle.module.scss";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import "../../components/style.css";
// import * as moment from "moment";
import PredefinedGoals from "../PreDefinedGoal/PredefinedGoalsComponent";
import SelfGoals from "../SelfGoals/SelfGoalsComponent";
import { PiTargetBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import Button from "@mui/material/Button";
import { Dropdown } from "primereact/dropdown";
import "./Manager.css"

const ManagerComponent = (props: any) => {
  const [masterData, setmasterData] = useState<any[]>([]);
  const [cyclesList, setCycleList] = useState<any[]>([]);
  const [show, setShow] = useState("PredefinedGoals");
  const [appraisalCycle, setAppraisalCycle] = useState({
    isCurrentCycle: false,
    currentCycle: null,
  });
  const [selectCycle, setSelectCycle] = useState<any>([]);

  const getDetails = () => {
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.get()
      .then((items) => {
        let tempArr: any = [];
        let cycleYearList: any = [];
        items.forEach((res) => {
          tempArr.push({
            ID: res.ID,
            Year: res.Title,
            cycleCategory: res.cycleCategory,
            startDate: res.startDate,
            endDate: res.endDate,
          });
          cycleYearList.push({
            code: `${res.Title}` + "-" + `${res.cycleCategory}`,
            name: `${res.Title}` + "-" + `${res.cycleCategory}`,
          });
          if (
            new Date() >= new Date(res.startDate) &&
            new Date() <= new Date(res.endDate)
          ) {
            setAppraisalCycle({
              ...appraisalCycle,
              isCurrentCycle: true,
              currentCycle: res.ID,
            });
            setSelectCycle({
              code: `${res.Title}` + "-" + `${res.cycleCategory}`,
              name: `${res.Title}` + "-" + `${res.cycleCategory}`,
            });
          }
        });
        setmasterData([...tempArr]);
        setCycleList([...cycleYearList]);
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
  }, [props]);

  const onChangeHandleFun = (value: any) => {
    setSelectCycle(value);
    let splitCycle = value.name.split("-");
    masterData.forEach((data) => {
      if (data.Year == splitCycle[0] && data.cycleCategory == splitCycle[1]) {
        if (
          new Date() >= new Date(data.startDate) &&
          new Date() <= new Date(data.endDate)
        ) {
          setAppraisalCycle({
            ...appraisalCycle,
            isCurrentCycle: true,
            currentCycle: data.ID,
          });
        } else {
          setAppraisalCycle({
            ...appraisalCycle,
            isCurrentCycle: false,
            currentCycle: data.ID,
          });
        }
      }
    });
  };

  return (
    <>
      <div className={styles.background}>
        <div className={styles.container02}>
          <div className="Goals">
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
        <div>
          {show == "PredefinedGoals" ? (
            <PredefinedGoals
              EmployeeEmail={props.EmployeeEmail}
              isManager={props.isManager}
              appraisalCycle={appraisalCycle}
            />
          ) : show == "SelfGoals" ? (
            <SelfGoals
              EmployeeEmail={props.EmployeeEmail}
              isManager={!props.isManager}
              appraisalCycle={appraisalCycle}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default ManagerComponent;
