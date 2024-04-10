import * as React from "react";
import styles from "./ManagerStyle.module.scss";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import Button from "@mui/material/Button";
import "../../components/style.css"
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import * as moment from "moment";
import MembersComponent from "./MembersComponent";
import GoalsComponent from "./GoalsComponent";


const ManagerComponent = (props: any) => {
  const [masterData, setmasterData] = useState([{}]);
  const [ismember, setisMember] = useState("ManagerComponent");
  const[memberEmail,setMemberEmail] = useState("");
  // const currentYear = moment().format("YYYY")
  const goalComponent = (arg :any,email :any) => {
    setisMember(arg);
    setMemberEmail(email);
  }
 
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
            <Button size="small" onClick={() => setisMember("MembersComponent")}>
              UserList
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
 
  return (
    <>
      <section>
        <div className={styles.container}>
          <div className={styles.AppraisalCycles}>
          <Button
            size="small"
            onClick={() => setisMember("ManagerComponent")}
            style={{
              color: ismember == "ManagerComponent" ? "green" : ""
            }}
          >
           AppraisalCycles
          </Button>
          </div>
          <div className={styles.AppraisalCycles}>
          <Button size="small" onClick={() => setisMember("MembersComponent")} style={{color : ismember == "MembersComponent" ? "green" : "", display : ismember == "MembersComponent" || ismember == "GoalsComponent" ? "flex" : "none"}}>
              EmployeeList
          </Button>
          </div>
          <div className={styles.AppraisalCycles}>
          <Button size="small" onClick={() => setisMember("GoalsComponent")} style={{color : ismember == "GoalsComponent" ? "green" : "" , display : ismember == "GoalsComponent" ? "" : "none" }}>
              GoalsComponent
          </Button>
          </div>
         
          
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
            <MembersComponent currentUser = {props.ManageContext} CurrentUserName = {props.UserName} state = {goalComponent}/>
          ) : (
            ismember == "GoalsComponent" ? <GoalsComponent memberEmail = {memberEmail} curUser = {props.ManageContext}/> : ""
          )}
        </div>
      </section>
    </>
  );
};
export default ManagerComponent;
