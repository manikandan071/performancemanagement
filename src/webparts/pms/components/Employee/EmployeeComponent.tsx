/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */

import * as React from "react";
import { useEffect, useState } from "react";
// import { sp } from "@pnp/sp";
import * as moment from "moment";
import styles from "./EmployeeStyle.module.scss";
import PredefinedGoals from "../PreDefinedGoal/PredefinedGoalsComponent";
import SelfGoals from "../SelfGoals/SelfGoalsComponent";
// import { PiTargetBold } from "react-icons/pi";
// import { BiTargetLock } from "react-icons/bi";
// import Button from "@mui/material/Button";
// import { Dropdown } from "primereact/dropdown";
import "../masterStyle.css";
import GoalScreenHeader from "../CommonComponents/Header/goalScreenHeader";
import { useSelector } from "react-redux";

const EmployeeComponent = (props: any): any => {
  const appraisalCycleList: any = useSelector(
    (state: any) => state.HRServiceData.masterCycles
  );

  const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [masterData, setmasterData] = useState<any[]>([]);
  const [cyclesList, setCycleList] = useState<any[]>([]);
  const [navigateTab, setNavigateTab] = useState<string>("PredefinedGoals");
  const [appraisalCycle, setAppraisalCycle] = useState({
    isCurrentCycle: false,
    currentCycle: null,
    submitComments: false,
    goalSubmit: false,
  });
  const [selectCycle, setSelectCycle] = useState<any>([]);

  const getDetails = (): any => {
    // sp.web.lists
    //   .getByTitle("AppraisalCycles")
    //   .items.get()
    //   .then((items) => {
    // const tempArr: any = [];
    const cycleYearList: any = [];
    appraisalCycleList?.forEach((res: any) => {
      // tempArr.push({
      //   ID: res.ID,
      //   Year: res.Title,
      //   cycleCategory: res.cycleCategory,
      //   startDate: res.startDate,
      //   endDate: res.endDate,
      //   commentsSubmitSDate: res.commentsSubmitSDate,
      //   commentsSubmitEDate: res.commentsSubmitEDate,
      //   goalsSubmitSDate: res.goalsSubmitSDate,
      //   goalsSubmitEDate: res.goalsSubmitEDate,
      // });
      cycleYearList.push({
        code: res.Year + "-" + res.cycleCategory,
        name: res.Year + "-" + res.cycleCategory,
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
      const goalsSDate = new Date(res.goalsSubmitSDate).setHours(0, 0, 0, 0);
      const goalsEDate = new Date(res.goalsSubmitEDate).setHours(0, 0, 0, 0);
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
          code: res.Year + "-" + res.cycleCategory,
          name: res.Year + "-" + res.cycleCategory,
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
          code: res.Year + "-" + res.cycleCategory,
          name: res.Year + "-" + res.cycleCategory,
          // code: `${res.Title}` + "-" + `${res.cycleCategory}`,
          // name: `${res.Title}` + "-" + `${res.cycleCategory}`,
        });
      } else {
        if (currentDate >= new Date(sDate) && currentDate <= new Date(eDate)) {
          setAppraisalCycle({
            ...appraisalCycle,
            currentCycle: res.ID,
            submitComments: false,
            goalSubmit: false,
          });
          setSelectCycle({
            code: res.Year + "-" + res.cycleCategory,
            name: res.Year + "-" + res.cycleCategory,
            // code: `${res.Title}` + "-" + `${res.cycleCategory}`,
            // name: `${res.Title}` + "-" + `${res.cycleCategory}`,
          });
        }
      }
    });
    setmasterData([...appraisalCycleList]);
    setCycleList([...cycleYearList]);
    // })
    // .catch((err: any) => {
    //   console.log(err);
    // });
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
        {/* <div className={styles.container}> */}
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
        <div>
          <GoalScreenHeader
            cyclesList={cyclesList}
            selectCycle={selectCycle}
            navigateTab={setNavigateTab}
            onChangeHandleFun={onChangeHandleFun}
          />
        </div>
        <div
          style={{
            height: "80%",
            overflow: "auto",
            // marginTop: navigateTab == "PredefinedGoals" ? "20px" : "0px",
          }}
        >
          {navigateTab === "PredefinedGoals" ? (
            <PredefinedGoals
              EmployeeEmail={props.EmployeeEmail}
              isManager={props.isManager}
              appraisalCycle={appraisalCycle}
            />
          ) : navigateTab === "SelfGoals" ? (
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
