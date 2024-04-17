import * as React from "react";
import { sp } from "@pnp/sp/presets/all";
import { useState, useEffect } from "react";
import { TbTargetArrow } from "react-icons/tb";
import styles from "./NavBarStyle.module.scss";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { Persona, PersonaPresence, PersonaSize } from "@fluentui/react";
import { FaUsersGear } from "react-icons/fa6";
import { RiUserShared2Fill } from "react-icons/ri";

const NavBar = (props: any) => {
  console.log(props);
  const [currentUser, setCurrentUSer] = useState("");
  const [isShowEmployee, setIsShowEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [tapName, setTapName] = useState("");
  const [tapMembersList, setTabMembersList] = useState("");

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
                setTapName("Goals");
                props.handleCilck("Goals");
              } else if (obj.Roles == "Manager") {
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
      </div>
      <div>
        <div
          className={
            "Goals" == tapName
              ? styles.seletedOptionContainer
              : styles.optionContainer
          }
          onClick={() => {
            setIsShowEmployee(false);
            setTapName("Goals");
            props.handleCilck("Goals");
            setTabMembersList("");
          }}
        >
          {props.isNav ? <> <span className={styles.goalIcon}><TbTargetArrow /></span> Goals</> : <TbTargetArrow />}
        </div>
        <div
          className={
            "Manager" == tapName
              ? styles.seletedOptionContainer
              : styles.optionContainer
          }
          onClick={() => setIsShowEmployee(!isShowEmployee)}
        >
          {props.isNav ? (
            <>
             <span className={styles.goalIcon}><FaUsersGear /></span> Manager
              <span>
                {isShowEmployee ? (
                  <FaChevronDown className={styles.DrpIcons} />
                ) : (
                  <FaChevronRight className={styles.DrpIcons} />
                )}
              </span>
            </>
          ) : (
            <>
              <FaUsersGear />
              <span>
                {isShowEmployee ? (
                  <FaChevronDown className={styles.DrpIcons} />
                ) : (
                  <FaChevronRight className={styles.DrpIcons} />
                )}
              </span>
            </>
          )}
        </div>
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
                      emp.userName
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

        <div
          className={
            "Employee" == tapName
              ? styles.seletedOptionContainer
              : styles.optionContainer
          }
          onClick={() => {
            setTabMembersList("");
            setTapName("Employee");
            setIsShowEmployee(false);
            props.handleCilck("Employee");
          }}
        >
          {props.isNav ? <> <span className={styles.goalIcon}><RiUserShared2Fill /></span>  Employee</>: <RiUserShared2Fill />}
        </div>
      </div>
    </div>
  );
};
export default NavBar;
