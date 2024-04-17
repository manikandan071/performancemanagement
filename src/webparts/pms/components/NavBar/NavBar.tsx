import * as React from "react";
import { sp } from "@pnp/sp/presets/all";
import { useState, useEffect } from "react";
// import { TbTargetArrow } from "react-icons/tb";
// import { AiOutlineSolution } from "react-icons/ai";
// import { TbUserHexagon } from "react-icons/tb";
import styles from "./NavBarStyle.module.scss";

const NavBar = (props: any) => {
  console.log(props);
  const [currentUser, setCurrentUSer] = useState("");
  const [isShowEmployee, setIsShowEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [tapName, setTapName] = useState("");

  console.log(employeeList, currentUser);

  const getUserRole = (mail: string) => {
    sp.web.lists
      .getByTitle(`EmployeeList`)
      .items.select(
        "*,Employee/ID,Employee/Title,Employee/EMail,Members/ID,Members/Title,Members/EMail"
      )
      .expand("Employee,Members")
      .get()
      .then((res) => {
        console.log(res);
        if (res.length > 0) {
          let teamMembers: any = [];
          res.forEach((obj) => {
            if (obj.Employee.EMail == mail) {
              if (obj.Roles == "HR") {
                // setNavOptions([{ option: "Goals" }, { option: "Employee" }]);
                setTapName("Goals");
                props.handleCilck("Goals");
              } else if (obj.Roles == "Manager") {
                // setNavOptions([{ option: "Manager" }, { option: "Employee" }]);
                setTapName("Employee");
                props.handleCilck("Employee");
                obj.Members.forEach((user: any) => {
                  teamMembers.push({
                    userID: user.ID,
                    userEmail: user.EMail,
                    userName: user.Title,
                  });
                });
              } else {
                // setNavOptions([{ option: "Employee" }]);
                setTapName("Employee");
                props.handleCilck("Employee");
              }
            }
          });
          setEmployeeList([...teamMembers]);
          console.log(teamMembers);
        }
      })
      .catch((err) => {
        console.log(err, "getRoleFunction");
      });
  };

  useEffect(() => {
    sp.web
      .currentUser()
      .then((user) => {
        console.log(user);
        setCurrentUSer(user.Email);
        getUserRole(user.Email);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div
      style={{
        backgroundColor: "#61b061",
        height: "100vh",
        borderRadius: "0px 10px 10px 0px",
        paddingTop: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: props.isNav ? "15px" : "10px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "5px",
          }}
        >
          <img
            style={{
              width: "50%",
              borderRadius: "100%",
              border: props.isNav ? "3px solid #b3f1b9" : "2px solid #b3f1b9",
              padding: props.isNav ? "2px" : "1px",
            }}
            src={`${props.context.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${props.context.context.pageContext.user.email}&size=L`}
            draggable="false"
          />
        </div>
        {props.isNav ? (
          <span
            style={{
              display: "inline-block",
              color: "#04024a",
              fontSize: "17px",
              fontWeight: "600",
              marginTop: "5px",
            }}
          >
            {props.context.context.pageContext.user.displayName}
          </span>
        ) : null}
        {/* <span>{props.prop.context.pageContext.user.displayName}</span> */}
      </div>

      {/* <div>
        {navOptions.map((obj) => {
          return (
            <div>
              <span
                className={obj.option == tapName ? styles.sideBar : ""}
              ></span>
              <div
                onClick={() => {
                  setTapName(obj.option);
                  props.handleCilck(obj.option);
                }}
                className={
                  obj.option == tapName
                    ? styles.seletedOptionContainer
                    : styles.optionContainer
                }
                style={{
                  textAlign: props.isNav ? "left" : "center",
                  padding: props.isNav ? "" : "5px 0px 5px 0px",
                }}
              >
                {props.isNav ? (
                  obj.option
                ) : obj.option === "Goals" ? (
                  <TbTargetArrow />
                ) : obj.option === "Manager" ? (
                  <AiOutlineSolution />
                ) : obj.option === "Employee" ? (
                  <TbUserHexagon />
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
      </div> */}
      <div>
        <div
          className={
            "Goals" == tapName
              ? styles.seletedOptionContainer
              : styles.optionContainer
          }
          onClick={() => {
            setTapName("Goals");
            props.handleCilck("Goals");
          }}
        >
          Goals
        </div>
        <div
          className={styles.optionContainer}
          onClick={() => setIsShowEmployee(!isShowEmployee)}
        >
          Manager
        </div>
        {isShowEmployee ? (
          <ul>
            {employeeList.map((emp) => {
              return (
                <li
                  className={
                    emp.userName == tapName
                      ? styles.seletedOptionContainer
                      : styles.optionContainer
                  }
                  onClick={() => {
                    setTapName(emp.userName);
                    props.handleCilck("Manager");
                    props.getEmployeeEmail(emp.userEmail);
                  }}
                >
                  {emp.userName}
                </li>
              );
            })}
          </ul>
        ) : null}

        <div
          className={
            "Employee" == tapName
              ? styles.seletedOptionContainer
              : styles.optionContainer
          }
          onClick={() => {
            setTapName("Employee");
            props.handleCilck("Employee");
          }}
        >
          Employee
        </div>
      </div>
    </div>
  );
};
export default NavBar;
