import * as React from "react";
import styles from "./ManagerStyle.module.scss";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import Button from "@mui/material/Button";
import "../../components/style.css";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import * as moment from "moment";
import MembersComponent from "../EmployeeLists/MembersComponent";
import GoalsComponent from "./GoalsComponent";
import { PiUserListBold } from "react-icons/pi";

const ManagerComponent = (props: any) => {
  console.log("props",props)
  const [masterData, setmasterData] = useState([{}]);
  const [ismember, setisMember] = useState("ManagerComponent");
  const [memberEmail, setMemberEmail] = useState("");
  // const currentYear = moment().format("YYYY")
  const goalComponent = (arg: any, email: any) => {
    setisMember(arg);
    setMemberEmail(email);
  };

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
            <Button
              size="small"
              onClick={() => setisMember("MembersComponent")}
            >
              <PiUserListBold
                style={{ color: "#ff7b1d ", fontSize: "20px" }}
              />
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
        <div className={ ismember == "MembersComponent" || ismember == "GoalsComponent" ? styles.container : ""}>
          <div className={styles.sample}>
            <Button
              variant="text"
              onClick={() => setisMember("ManagerComponent")}
              style={{
                color: ismember == "ManagerComponent" ? "white" : "black",
                borderBottom:ismember == "ManagerComponent" ? "3px solid #303072" : "",
                backgroundColor:ismember == "ManagerComponent"? "#a6a2ce8f": "#f5f5f5",
                display:ismember == "MembersComponent" || ismember == "GoalsComponent" ? "flex": "none",
              }}
            >
              AppraisalCycles
            </Button>
          </div>
          <div className={styles.sample}>
            <Button
              variant="text"
              onClick={() => setisMember("MembersComponent")}
              style={{
                color: ismember == "MembersComponent" ? "white" : "black",
                borderBottom:ismember == "MembersComponent" ? "3px solid #303072" : "",
                backgroundColor:ismember == "MembersComponent" ? "#a6a2ce8f": "#f5f5f5",
                display:ismember == "MembersComponent" || ismember == "GoalsComponent" ? "flex": "none",
              }}
            >
              EmployeeList
            </Button>
          </div>
          <div className={styles.sample}>
            <Button
              variant="text"
              onClick={() => setisMember("GoalsComponent")}
              style={{
                color: ismember == "GoalsComponent" ? "white" : "black",
                borderBottom:ismember == "GoalsComponent" ? "3px solid #303072" : "",
                backgroundColor:ismember == "GoalsComponent"? "#a6a2ce8f": "#f5f5f5",
                display: ismember == "GoalsComponent" ? "" : "none",
              }}
            >
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
            <MembersComponent
              currentUser={props.ManageContext}
              CurrentUserName={props.UserName}
              state={goalComponent}
            />
          ) : ismember == "GoalsComponent" ? (
            <GoalsComponent
              memberEmail={memberEmail}
              curUser={props.ManageContext}
              isManager = {props.isManager}
            />
          ) : (
            ""
          )}
        </div>
      </section>
    </>
  );
};
export default ManagerComponent;
