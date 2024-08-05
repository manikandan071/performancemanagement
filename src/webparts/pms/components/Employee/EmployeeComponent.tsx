/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */

import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import * as moment from "moment";
import styles from "./EmployeeStyle.module.scss";
import PredefinedGoals from "../PreDefinedGoal/PredefinedGoalsComponent";
import SelfGoals from "../SelfGoals/SelfGoalsComponent";
import { PiTargetBold } from "react-icons/pi";
import { BiTargetLock } from "react-icons/bi";
import Button from "@mui/material/Button";
import { Dropdown } from "primereact/dropdown";
import "../masterStyle.css";

const EmployeeComponent = (props: any): any => {
  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [masterData, setmasterData] = useState<any[]>([]);
  const [cyclesList, setCycleList] = useState<any[]>([]);
  const [show, setShow] = useState("PredefinedGoals");
  const [appraisalCycle, setAppraisalCycle] = useState({
    isCurrentCycle: false,
    currentCycle: null,
    submitComments: false,
    goalSubmit: false,
  });
  const [selectCycle, setSelectCycle] = useState<any>([]);

  const getDetails = (): any => {
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.get()
      .then((items) => {
        const tempArr: any = [];
        const cycleYearList: any = [];
        items.forEach((res: any) => {
          tempArr.push({
            ID: res.ID,
            Year: res.Title,
            cycleCategory: res.cycleCategory,
            startDate: res.startDate,
            endDate: res.endDate,
            commentsSubmitSDate: res.commentsSubmitSDate,
            commentsSubmitEDate: res.commentsSubmitEDate,
            goalsSubmitSDate: res.goalsSubmitSDate,
            goalsSubmitEDate: res.goalsSubmitEDate,
          });
          cycleYearList.push({
            code: res.Title + "-" + res.cycleCategory,
            name: res.Title + "-" + res.cycleCategory,
            // code: `${res.Title}` + "-" + `${res.cycleCategory}`,
            // name: `${res.Title}` + "-" + `${res.cycleCategory}`,
          });
          const sDate = new Date(res.startDate).setHours(0, 0, 0, 0);
          const eDate = new Date(res.endDate).setHours(0, 0, 0, 0);
          const commentsSDate = new Date(res.commentsSubmitSDate).setHours(
            0,
            0,
            0,
            0
          );
          const commentsEDate = new Date(res.commentsSubmitEDate).setHours(
            0,
            0,
            0,
            0
          );
          const goalsSDate = new Date(res.goalsSubmitSDate).setHours(
            0,
            0,
            0,
            0
          );
          const goalsEDate = new Date(res.goalsSubmitEDate).setHours(
            0,
            0,
            0,
            0
          );
          if (
            currentDate >= new Date(goalsSDate) &&
            currentDate <= new Date(goalsEDate)
          ) {
            setAppraisalCycle({
              ...appraisalCycle,
              currentCycle: res.ID,
              submitComments: false,
              goalSubmit: true,
            });
            setSelectCycle({
              code: res.Title + "-" + res.cycleCategory,
              name: res.Title + "-" + res.cycleCategory,
              // code: `${res.Title}` + "-" + `${res.cycleCategory}`,
              // name: `${res.Title}` + "-" + `${res.cycleCategory}`,
            });
          } else if (
            currentDate >= new Date(commentsSDate) &&
            currentDate <= new Date(commentsEDate)
          ) {
            setAppraisalCycle({
              ...appraisalCycle,
              currentCycle: res.ID,
              submitComments: true,
              goalSubmit: false,
            });
            setSelectCycle({
              code: res.Title + "-" + res.cycleCategory,
              name: res.Title + "-" + res.cycleCategory,
              // code: `${res.Title}` + "-" + `${res.cycleCategory}`,
              // name: `${res.Title}` + "-" + `${res.cycleCategory}`,
            });
          } else {
            if (
              currentDate >= new Date(sDate) &&
              currentDate <= new Date(eDate)
            ) {
              setAppraisalCycle({
                ...appraisalCycle,
                currentCycle: res.ID,
                submitComments: false,
                goalSubmit: false,
              });
              setSelectCycle({
                code: res.Title + "-" + res.cycleCategory,
                name: res.Title + "-" + res.cycleCategory,
                // code: `${res.Title}` + "-" + `${res.cycleCategory}`,
                // name: `${res.Title}` + "-" + `${res.cycleCategory}`,
              });
            }
          }
        });
        setmasterData([...tempArr]);
        setCycleList([...cycleYearList]);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const init = (): any => {
    getDetails();
  };

  useEffect(() => {
    init();
  }, []);

  const onChangeHandleFun = (value: any): any => {
    setSelectCycle(value);
    const splitCycle = value.name.split("-");
    masterData.forEach((data) => {
      if (data.Year === splitCycle[0] && data.cycleCategory === splitCycle[1]) {
        const sDate = new Date(data.startDate).setHours(0, 0, 0, 0);
        const eDate = new Date(data.endDate).setHours(0, 0, 0, 0);
        const commentsSDate = new Date(data.commentsSubmitSDate).setHours(
          0,
          0,
          0,
          0
        );
        const commentsEDate = new Date(data.commentsSubmitEDate).setHours(
          0,
          0,
          0,
          0
        );
        const goalsSDate = new Date(data.goalsSubmitSDate).setHours(0, 0, 0, 0);
        const goalsEDate = new Date(data.goalsSubmitEDate).setHours(0, 0, 0, 0);
        if (
          currentDate >= new Date(goalsSDate) &&
          currentDate <= new Date(goalsEDate)
        ) {
          setAppraisalCycle({
            ...appraisalCycle,
            currentCycle: data.ID,
            submitComments: false,
            goalSubmit: true,
          });
        } else if (
          currentDate >= new Date(commentsSDate) &&
          currentDate <= new Date(commentsEDate)
        ) {
          setAppraisalCycle({
            ...appraisalCycle,
            currentCycle: data.ID,
            submitComments: true,
            goalSubmit: false,
          });
        } else {
          if (
            currentDate >= new Date(sDate) &&
            currentDate <= new Date(eDate)
          ) {
            setAppraisalCycle({
              ...appraisalCycle,
              currentCycle: data.ID,
              submitComments: false,
              goalSubmit: false,
            });
          } else {
            setAppraisalCycle({
              ...appraisalCycle,
              currentCycle: data.ID,
              submitComments: false,
              goalSubmit: false,
            });
          }
        }
      }
    });
  };

  return (
    <>
      <div className={styles.background}>
        <div className={styles.container}>
          <div className="appraisalTitle">
            {masterData.map((data) => {
              if (data.ID === appraisalCycle.currentCycle) {
                return (
                  <span>
                    Appraisal {data.Year} - {data.cycleCategory}
                    {" ("}
                    {moment(data.startDate).format("DD/MMM")} to{" "}
                    {moment(data.endDate).format("DD/MMM")}
                    {")"}{" "}
                    <span className="appraisalLabel">
                      {appraisalCycle.goalSubmit ? " - Goals Submission" : ""}
                    </span>
                    <span className="appraisalLabel">
                      {appraisalCycle.submitComments ? " - Goals Review" : ""}
                    </span>
                  </span>
                );
              }
            })}
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
        <div
          className={show === "PredefinedGoals" ? "predefinedGoal" : "selfGoal"}
        >
          <div
            className={styles.AppraisalCycles}
            style={{ paddingBottom: "10px" }}
          >
            <Button
              onClick={() => setShow("PredefinedGoals")}
              size="small"
              style={{
                color: show === "PredefinedGoals" ? "#496969" : "#a5c0c0",
                borderBottom:
                  show === "PredefinedGoals" ? "2px solid #1cbf1c" : "",
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
              onClick={() => setShow("SelfGoals")}
              size="small"
              style={{
                color: show === "SelfGoals" ? "#496969" : "#a5c0c0",
                borderBottom: show === "SelfGoals" ? "2px solid #1cbf1c" : "",
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
        <div
          style={{
            height: "80%",
            overflow: "auto",
            // marginTop: show == "PredefinedGoals" ? "20px" : "0px",
          }}
        >
          {show === "PredefinedGoals" ? (
            <PredefinedGoals
              EmployeeEmail={props.EmployeeEmail}
              isManager={props.isManager}
              appraisalCycle={appraisalCycle}
            />
          ) : show === "SelfGoals" ? (
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
export default EmployeeComponent;
