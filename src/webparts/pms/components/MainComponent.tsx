/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import NavBar from "./NavBar/NavBar";
import { useState, useEffect } from "react";
import { RxCaretRight } from "react-icons/rx";
import Goals from "./Goals/GoalsComponent";
import ManagerComponent from "./Manager/ManagerComponent";
import EmployeeComponent from "./Employee/EmployeeComponent";
import AdminComponent from "./Admin/AdminComponent";
const logo: any = require("../assets/images/companyLogo.png");
import "./style.css";
import "./masterStyle.css";
import { useDispatch } from "react-redux";
import {
  getAppraisalCycles,
  getCurrentUserDetails,
  getUsersDetailsAndRoles,
} from "../../../Services/CommonServices/CommonServices";

const MainComponent = (props: any): any => {
  const UserEmail = props.context.pageContext.user.email;
  const dispatch = useDispatch();
  const [isNavBar, setIsNavBar] = useState(true);
  const [isNavOption, setNavOption] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  console.log(UserEmail, "currentUser");

  const handleCilck = (item: string): void => {
    setNavOption(item);
  };
  const getEmployeeEmail = (item: string): void => {
    setEmployeeEmail(item);
  };

  useEffect(() => {
    console.log("render");

    // getUsersRoles();
    getCurrentUserDetails(dispatch, props.context.pageContext.user.email);
    getUsersDetailsAndRoles(dispatch);
    getAppraisalCycles(dispatch);
    // getAppraisalCycles(setAppraisalCycleId, setCycleList, dispatch);
  }, []);

  return (
    <>
      <div className="mainWrapper">
        <div className="topBar">
          <img src={logo} alt="logo" />
        </div>
        <div className="contentWrapper">
          <div
            style={{
              width: isNavBar ? "20%" : "6%",
              position: "relative",
              transition: "all 0.3s",
              // marginTop: "15px",
            }}
          >
            {/* {!isNavBar ? ( */}
            <RxCaretRight
              className="bi bi-4-circle"
              style={{
                boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
                position: "absolute",
                right: "-13px",
                top: "2%",
                color: "#000",
                transition: "all .3s",
                transform: isNavBar ? "rotate(180deg)" : "",
                backgroundColor: "#fff",
                borderRadius: "50px",
                fontSize: "25px",
                cursor: "pointer",
                width: "30px",
                height: "30px",
              }}
              onClick={() => setIsNavBar(!isNavBar)}
            />
            {/* ) : (
            <IoIosClose
              className="bi bi-4-circle"
              style={{
                position: "absolute",
                right: "-13px",
                top: "2%",
                color: "#000",
                backgroundColor: "#fff",
                borderRadius: "50px",
                fontSize: "25px",
                cursor: "pointer",
                width: "30px",
                height: "30px",
              }}
              onClick={() => setIsNavBar(!isNavBar)}
            />
          )} */}
            <NavBar
              isNav={isNavBar}
              handleCilck={handleCilck}
              getEmployeeEmail={getEmployeeEmail}
              context={props}
              user={UserEmail}
            />
          </div>

          <div
            style={{
              width: isNavBar ? "85%" : "95%",
              // margin: "15px 0px 0px 0px",
              // height: "100%",
            }}
          >
            {isNavOption === "Goals" ? (
              <div className="RHSWrapper">
                <Goals />
              </div>
            ) : isNavOption === "Manager" ? (
              <div className="RHSWrapper">
                <ManagerComponent
                  EmployeeEmail={employeeEmail}
                  isManager={true}
                />
              </div>
            ) : isNavOption === "Admin" ? (
              <div className="adminDashboard">
                <AdminComponent />
              </div>
            ) : (
              <div className="RHSWrapper">
                <EmployeeComponent
                  EmployeeEmail={UserEmail}
                  isManager={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default MainComponent;
