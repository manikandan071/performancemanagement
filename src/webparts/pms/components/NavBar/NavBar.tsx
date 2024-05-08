import * as React from "react";
import { sp } from "@pnp/sp/presets/all";
import { useState, useEffect } from "react";
import { TbTargetArrow } from "react-icons/tb";
import styles from "./NavBarStyle.module.scss";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Persona, PersonaPresence, PersonaSize } from "@fluentui/react";
import { PiUserCircleGearDuotone } from "react-icons/pi";
import { PiUserCircleDuotone } from "react-icons/pi";
import { HiUserGroup } from "react-icons/hi2";

const NavBar = (props: any) => {
  console.log(props, "props");
  const [currentUser, setCurrentUSer] = useState("");
  const [isShowEmployee, setIsShowEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [Role, setRole] = useState("");
  const [tapName, setTapName] = useState("");
  const [tapMembersList, setTabMembersList] = useState("");

  console.log(employeeList, currentUser, Role);

  const getUserRole = (mail: string) => {
    sp.web.lists
      .getByTitle(`EmployeeList`)
      .items.select(
        "*,Employee/ID,Employee/Title,Employee/EMail,Members/ID,Members/Title,Members/EMail"
      )
      .expand("Employee,Members")
      .get()
      .then((res) => {
        console.log(res, "navbarResponse");
        if (res.length > 0) {
          let teamMembers: any = [];
          res.forEach((obj) => {
            if (obj.Employee.EMail == mail) {
              if (obj.Roles == "HR") {
                setTapName("Goals");
                setRole("HR");
                props.handleCilck("Goals");
              } else if (obj.Roles == "Manager") {
                setRole("Manager");
                setTapName("Employee");
                props.handleCilck("Employee");
                obj.Members.forEach((user: any) => {
                  teamMembers.push({
                    userID: user.ID,
                    userEmail: user.EMail,
                    userName: user.Title,
                  });
                });
              } else if (obj.Roles == "Admin") {
                setRole("Admin");
                setTapName("Admin");
                props.handleCilck("Admin");
                obj.Members.forEach((user: any) => {
                  teamMembers.push({
                    userID: user.ID,
                    userEmail: user.EMail,
                    userName: user.Title,
                  });
                });
              } else {
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
      className=""
      style={{
        background: `linear-gradient(130deg, rgb(97 186 114), rgb(1 68 63))`,
        boxShadow: `0px 0px 10px rgba(0,0,0,0.1)`,
        height: "84vh",
        borderRadius: "10px",
        padding: props.isNav ? "15px 15px" : "15px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginBottom: props.isNav ? "15px" : "10px",
          padding: "15px",
          borderBottom: "2px solid #02230020",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: props.isNav ? "100px" : "40px",
            height: props.isNav ? "100px" : "40px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "5px",
          }}
        >
          <img
            style={{
              width: "100%",
              borderRadius: "100%",
              border: props.isNav ? "2px solid #007e0c" : "2px solid #007e0c",
              padding: props.isNav ? "2px" : "1px",
              objectFit: "cover",
            }}
            src={`${props.context.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?UserName=${props.context.context.pageContext.user.email}&size=L`}
            draggable="false"
          />
        </div>
        {props.isNav ? (
          <div style={{ textAlign: "center" }}>
            <p className={styles.employeeName}>
              {props.context.context.pageContext.user.displayName}
            </p>
            {Role && <span className={styles.employeeRole}>{Role}</span>}
          </div>
        ) : null}
      </div>
      <div>
        {Role === "HR" ? (
          <div
            className={
              "Goals" == tapName
                ? styles.seletedOptionContainer
                : styles.optionContainer
            }
            style={{
              padding: props.isNav ? "3px 15px" : "0 15px",
              justifyContent: props.isNav ? "flex-start" : "center",
            }}
            onClick={() => {
              setIsShowEmployee(false);
              setTapName("Goals");
              props.handleCilck("Goals");
              setTabMembersList("");
            }}
          >
            {props.isNav ? (
              <div className={styles.optionIcon}>
                <TbTargetArrow />
                <span style={{ margin: "8px 0px 5px 10px" }}>Goals</span>
              </div>
            ) : (
              <div className={styles.onlyIcon}>
                <TbTargetArrow />
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        {Role === "Manager" || Role === "Admin" ? (
          <div
            className={
              "Manager" == tapName 
                ? styles.seletedOptionContainer
                : styles.optionContainer
            }
            style={{
              display: props.isNav ? "" : "flex",
              justifyContent: props.isNav ? "flex-start" : "center",
              padding: props.isNav ? "" : "0px",
            }}
            onClick={() => setIsShowEmployee(!isShowEmployee)}
          >
            {props.isNav ? (
              <div className={styles.optionIcon}>
                <HiUserGroup />
                <span style={{ margin: "8px 0px 5px 10px" }}>Manager</span>
                {isShowEmployee ? (
                  <FaChevronDown className={styles.DrpIcons} />
                ) : (
                  <FaChevronRight className={styles.DrpIcons} />
                )}
              </div>
            ) : (
              <div className={styles.onlyIcon}>
                <HiUserGroup />
                {isShowEmployee ? (
                  <FaChevronDown className={styles.DrpIcons} />
                ) : (
                  <FaChevronRight className={styles.DrpIcons} />
                )}
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
        {isShowEmployee ? (
          <ul className={props.isNav ? styles.ul : styles.ul02}>
            {employeeList.map((emp) => {
              return (
                <>
                  <li
                    className={
                      emp.userName == tapMembersList
                        ? styles.seletedMembersContainer
                        : styles.optionMembersContainer
                    }
                    onClick={() => {
                      setTabMembersList(emp.userName);
                      setTapName("Manager");
                      props.handleCilck("Manager");
                      props.getEmployeeEmail(emp.userEmail);
                    }}
                  >
                    {props.isNav ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: props?.isNav
                            ? "flex-start"
                            : "stretch",
                        }}
                      >
                        <Persona
                          showOverflowTooltip
                          size={PersonaSize.size24}
                          presence={PersonaPresence.none}
                          showInitialsUntilImageLoads={true}
                          imageUrl={`/_layouts/15/userphoto.aspx?size=S&username=${emp.userEmail}`}
                        />
                        <span>{emp.userName}</span>
                      </div>
                    ) : (
                      <Persona
                        showOverflowTooltip
                        size={PersonaSize.size24}
                        presence={PersonaPresence.none}
                        showInitialsUntilImageLoads={true}
                        imageUrl={`/_layouts/15/userphoto.aspx?size=S&username=${emp.userEmail}`}
                      />
                    )}
                  </li>
                </>
              );
            })}
          </ul>
        ) : null}
        {Role === "Admin" ? (
          <div
            className={
              "Admin" == tapName
                ? styles.seletedOptionContainer
                : styles.optionContainer
            }
            style={{
              justifyContent: props?.isNav ? "flex-start" : "center",
            }}
            onClick={() => {
              setTabMembersList("");
              setTapName("Admin");
              setIsShowEmployee(false);
              props.handleCilck("Admin");
            }}
          >
            {props.isNav ? (
              <div className={styles.optionIcon}>
                <PiUserCircleGearDuotone />
                <span style={{ margin: "8px 0px 5px 10px" }}>Admin</span>
              </div>
            ) : (
              <div className={styles.onlyIcon}>
                <PiUserCircleGearDuotone />
              </div>
            )}
          </div>
        ) : (
          <div
            className={
              "Employee" == tapName
                ? styles.seletedOptionContainer
                : styles.optionContainer
            }
            style={{
              justifyContent: props?.isNav ? "flex-start" : "center",
            }}
            onClick={() => {
              setTabMembersList("");
              setTapName("Employee");
              setIsShowEmployee(false);
              props.handleCilck("Employee");
            }}
          >
            {props.isNav ? (
              <div className={styles.optionIcon}>
                <PiUserCircleDuotone />
                <span style={{ margin: "8px 0px 5px 10px" }}>Employee</span>
              </div>
            ) : (
              <div className={styles.onlyIcon}>
                <PiUserCircleDuotone />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default NavBar;
