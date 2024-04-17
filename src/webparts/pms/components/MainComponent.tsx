import * as React from "react";
import NavBar from "./NavBar/NavBar";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { RxCaretRight } from "react-icons/rx";
import Goals from "./Goals/GoalsComponent";
import ManagerComponent from "./Manager/ManagerComponent";
import EmployeeComponent from "./Employee/EmployeeComponent";
// import image from "../components/Employee/welcomeDark.png";
// let logo = require("../assets/images/welcome-dark.png")

const MainComponent = (props: any) => {
  let UserEmail = props.context.pageContext.user.email;

  const [isNavBar, setIsNavBar] = useState(true);
  const [isNavOption, setNavOption] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");

  console.log(UserEmail, isNavOption);

  const handleCilck = (item: string) => {
    setNavOption(item);
  };
  const getEmployeeEmail = (item: string) => {
    setEmployeeEmail(item);
  };

  return (
    <>
      {/* <img src={image} alt="React Logo"></img>  */}
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            width: isNavBar ? "15%" : "5%",
            height: "100vh",
            position: "relative",
            transition: "all 0.5s",
            marginTop: "20px",
          }}
        >
          {!isNavBar ? (
            <RxCaretRight
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
          ) : (
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
          )}
          <NavBar
            isNav={isNavBar}
            //   tab={isNavOption}
            handleCilck={handleCilck}
            getEmployeeEmail={getEmployeeEmail}
            context={props}
          />
        </div>

        <div
          style={{
            width: isNavBar ? "85%" : "95%",
            margin: "20px 0px 0px 20px",
          }}
        >
          {isNavOption === "Goals" ? (
            <div>
              <Goals />
            </div>
          ) : isNavOption === "Manager" ? (
            <div>
              <ManagerComponent
                EmployeeEmail={employeeEmail}
                isManager={true}
              />
            </div>
          ) : (
            <div>
              <EmployeeComponent EmployeeEmail={UserEmail} isManager={false} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default MainComponent;
