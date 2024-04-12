import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import * as moment from "moment";
import "../../components/style.css";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import Button from "@mui/material/Button";
import styles from "./EmployeeStyle.module.scss";
import GoalsComponent from "../Manager/GoalsComponent";
import { TbTargetArrow } from "react-icons/tb";

const EmployeeComponent = (props: any) => {
  const [masterData, setmasterData] = useState([{}]);
  const [show, setShow] = useState("AppraisalCycles");

  const columns = [
    {
      key: "columns1",
      name: "Year",
      fieldName: "Year",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.Year}</div>
        </>
      ),
    },
    {
      key: "columns2",
      name: "CycleCategory",
      fieldName: "cycleCategory",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.cycleCategory}</div>
        </>
      ),
    },
    {
      key: "columns3",
      name: "StartDate",
      fieldName: "startDate",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.startDate}</div>
        </>
      ),
    },
    {
      key: "columns4",
      name: "EndDate",
      fieldName: "endDate",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.endDate}</div>
        </>
      ),
    },
    {
      key: "columns4",
      name: "Action",
      fieldName: "Action",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>
            <Button size="small" onClick={() => setShow("GoalsComponent")}>
              <TbTargetArrow className={styles.goalIcon} />
            </Button>
          </div>
        </>
      ),
    },
  ];
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
      <div className={show == "GoalsComponent" ? styles.container : ""} >
        <div className={styles.sample}>
          <Button
            variant="text"
            onClick={() => setShow("AppraisalCycles")}
            style={{
              color: show == "AppraisalCycles" ? "white" : "black",
              borderBottom:show == "AppraisalCycles" ? "3px solid #303072" : "",
              backgroundColor:show == "AppraisalCycles" ? "rgba(0, 128, 0, 0.379)": "#f5f5f5",
              display: show == "GoalsComponent" ? "flex": "none"
            }}
          >
            AppraisalCycles
          </Button>
        </div>
        <div className={styles.sample} style={{
               display: show == "GoalsComponent" ? "flex": "none",
            }}>
          <Button
            variant="text"
            onClick={() => setShow("GoalsComponent")}
            style={{
              color: show == "GoalsComponent" ? "white" : "black",
              borderBottom:show == "GoalsComponent" ? "3px solid #303072" : "",
              backgroundColor:show == "GoalsComponent" ? "rgba(0, 128, 0, 0.379)": "#f5f5f5",
            }}
          >
            Goals
          </Button>
        </div>
      </div>
      {show == "AppraisalCycles" ? (
        <div>
          <DetailsList
            items={masterData}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
          />
        </div>
      ) : show == "GoalsComponent" ? (
        <GoalsComponent
          memberEmail={props.currentUserEmail}
          curUser={props.currentUserEmail}
          isManager = {props.isManager}
        />
      ) : (
        ""
      )}
    </>
  );
};
export default EmployeeComponent;
