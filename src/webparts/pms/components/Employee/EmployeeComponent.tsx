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
import styles from "./EmployeeStyle.module.scss"
import GoalsComponent from "../Manager/GoalsComponent";

const EmployeeComponent = (props :any) => {
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
              Goals
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
      {show == "AppraisalCycles" ?  <div>
        <div className={styles.container}>
          <Button
            size="small"
            onClick={() => setShow("AppraisalCycles")}
            style={{
              color: show == "AppraisalCycles" ? "green" : "", 
            }}
          >
            AppraisalCycles
          </Button>
        </div>
        <DetailsList
          items={masterData}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </div> : (
        show == "GoalsComponent" ? <GoalsComponent memberEmail = {props.currentUserEmail}  curUser = {props.currentUserEmail}/> : ""
      )}
     
    </>
  );
};
export default EmployeeComponent;
