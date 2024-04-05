import * as React from "react";
import styles from "./ManagerStyle.module.scss";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import Button from "@mui/material/Button";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import * as moment from "moment";
import MembersComponent from "./MembersComponent";

const ManagerComponent = (props: any) => {
  const [masterData, setmasterData] = useState([{}]);
  const [ismember, setisMember] = useState("ManagerComponent");
 
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
      <section>
        <div className={styles.container}>
          <Button
            size="small"
            onClick={() => setisMember("ManagerComponent")}
            // style={{
            //   display: ismember == "MembersComponent" ? "none" : "unset",
            // }}
          >
            AppraisalCycles
          </Button>
          <Button size="small" onClick={() => setisMember("MembersComponent")}>
            EmployeeList
          </Button>
        </div>
        <div>
          {ismember == "ManagerComponent" ? (
            <div>
              <DetailsList
                items={masterData}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </div>
          ) : ismember == "MembersComponent" ? (
            <MembersComponent currentUser = {props.ManageContext} />
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
};
export default ManagerComponent;
