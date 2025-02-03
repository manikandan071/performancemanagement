/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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
import { setAssignToUserDetails } from "../../../../redux/slices/CommonSlice";
import { useDispatch } from "react-redux";
import { graph } from "@pnp/graph/presets/all";
const Manager: any = [];
const Reportees: any = [];
const tempReportees: any[] = [];

const NavBar = (props: any): any => {
  console.log(props, "props");
  const dispatch = useDispatch();
  const [currentUser, setCurrentUSer] = useState("");
  const [isShowEmployee, setIsShowEmployee] = useState(false);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [Role, setRole] = useState("");
  const [tapName, setTapName] = useState("");
  const [tapMembersList, setTabMembersList] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [topUser, setTopUser] = useState([]);
  const [ManagerList, setManagerList] = useState(Manager);
  const [ReporteeList, setReporteeList] = useState(Reportees);
  const [tempReporteesList, setTempReportees] = useState(tempReportees);

  // console.log(employeeList, currentUser, Role);
  console.log(
    currentUser,
    "currentUser",
    topUser,
    "topUser",
    ManagerList,
    "ManagerList",
    ReporteeList,
    "ReporteeList",
    users,
    "users",
    tempReporteesList,
    "tempReporteesList"
  );

  //Get Azure Users , Managers and directRepotees..........................................................................................
  async function getAllUsers(mail: string) {
    graph.users
      .top(999)
      .select("*,Sponsors")
      .expand("Sponsors")
      .filter("accountEnabled eq true")
      .get()
      .then((data) => {
        const tempUsers: any[] = [];
        data.forEach((user: any) => {
          tempUsers.push({
            id: user.id,
            displayName: user.displayName ? user.displayName : "",
            mail: user.mail ? user.mail : "",
            jobTitle: user.jobTitle ? user.jobTitle : "",
          });
          if (user.sponsors[0]?.mail === mail) {
            tempReportees.push({
              id: user.id,
              displayName: user.displayName ? user.displayName : "",
              mail: user.mail ? user.mail : "",
              jobTitle: user.jobTitle ? user.jobTitle : "",
            });
          }
        });
        setUsers(tempUsers);
        setTempReportees(tempReportees);
        getCurrentUser(tempUsers);
      })
      .catch(function (error) {
        console.log(error, "-Error in getting current user");
      });
  }

  const getCurrentUser = (allUsers: any) => {
    graph.me
      .get()
      .then(function (user) {
        const crntUserDetails = [];
        crntUserDetails.push({
          id: user.id,
          displayName: user.displayName ? user.displayName : "",
          mail: user.mail ? user.mail : "",
          jobTitle: user.jobTitle ? user.jobTitle : "",
        });
        setManagerList([...crntUserDetails]);
        getManager(user.id, allUsers);
      })
      .catch(function (error) {
        console.log(error, "Get current user error");
      });
  };

  async function getManager(userID: any, allUsers: any) {
    await graph.users
      // .getById("effd0552-a3bb-4b19-88ae-eba3e59f297f")
      .getById(userID)
      .manager()
      .then(function (user: any) {
        const userdetails: any = [];
        if (user) {
          userdetails.push({
            id: user.id,
            displayName: user.displayName ? user.displayName : "",
            mail: user.mail ? user.mail : "",
            jobTitle: user.jobTitle ? user.jobTitle : "",
          });
        }
        setTopUser(userdetails);
        getDirectreports(userID, allUsers);
      })
      .catch(function (error) {
        setTopUser([]);
        getDirectreports(userID, allUsers);
        console.log(error, "Get manager error");
      });
  }

  async function getDirectreports(userID: any, allUsers: any) {
    await graph.users
      // .getById("763b431f-aa6e-4dc6-bb85-5acf6cd1f9e5")
      .getById(userID)
      .directReports()
      .then(function (user: any) {
        const directreports: any = [];
        for (let i = 0; i < user.length; i++) {
          if (allUsers?.some((val: any) => val?.id == user[i].id)) {
            directreports.push({
              id: user[i].id,
              displayName: user[i].displayName ? user[i].displayName : "",
              mail: user[i].mail ? user[i].mail : "",
              jobTitle: user[i].jobTitle ? user[i].jobTitle : "",
            });
          }
        }
        setReporteeList([...directreports]);
      })
      .catch(function (error) {
        setReporteeList([]);
        console.log(error, "Get direct reports error");
      });
  }
  //...............................................................................................................................................

  const getUserRole = (mail: string) => {
    // sp.web.lists
    //   .getByTitle(`EmployeeList`)
    //   .items.select(
    //     "*,Employee/ID,Employee/Title,Employee/EMail,Members/ID,Members/Title,Members/EMail"
    //   )
    //   .expand("Employee,Members")
    //   .get()
    //   .then((res) => {
    //     if (res.length > 0) {
    //       const teamMembers: any = [];
    //       res.forEach((obj) => {
    //         if (obj.Employee.EMail === mail) {
    //           if (obj.Roles === "HR") {
    //             setTapName("Goals");
    //             setRole("HR");
    //             props.handleCilck("Goals");
    //           } else if (obj.Roles === "Manager") {
    //             setRole("Manager");
    //             setTapName("Employee");
    //             props.handleCilck("Employee");
    //             obj.Members.forEach((user: any) => {
    //               teamMembers.push({
    //                 userID: user.ID,
    //                 userEmail: user.EMail,
    //                 userName: user.Title,
    //               });
    //             });
    //           } else if (obj.Roles === "Admin") {
    //             setRole("Admin");
    //             setTapName("Admin");
    //             props.handleCilck("Admin");
    //             obj.Members.forEach((user: any) => {
    //               teamMembers.push({
    //                 userID: user.ID,
    //                 userEmail: user.EMail,
    //                 userName: user.Title,
    //               });
    //             });
    //           } else {
    //             setTapName("Employee");
    //             props.handleCilck("Employee");
    //           }
    //         }
    //       });
    //       const teamEmployees = teamMembers.sort((a: any, b: any) =>
    //         a.userName.localeCompare(b.userName)
    //       );
    //       setEmployeeList([...teamEmployees]);
    //       console.log(teamEmployees);
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err, "getRoleFunction");
    //   });

    graph.users
      .top(999)
      .select("*,Sponsors")
      .expand("Sponsors")
      .filter("accountEnabled eq true")
      .get()
      .then((res: any) => {
        console.log(res, "aari's Users");
        if (res.length > 0) {
          const teamMembers: any = [];
          res.forEach((obj: any) => {
            if (obj.mail === mail) {
              if (obj.jobTitle === "HR") {
                setTapName("Goals");
                setRole("HR");
                props.handleCilck("Goals");
              } else if (obj.jobTitle === "Manager") {
                setRole("Manager");
                setTapName("Employee");
                props.handleCilck("Employee");
                const mergedArray = [...ReporteeList, ...tempReporteesList];
                mergedArray?.forEach((user: any) => {
                  teamMembers.push({
                    userID: user.id,
                    userEmail: user.mail,
                    userName: user.displayName,
                  });
                });
              }
              // else if (obj.jobTitle === "Senior Software Developer") {
              //   setRole("Manager");
              //   setTapName("Employee");
              //   props.handleCilck("Employee");
              //   ReporteeList?.forEach((user: any) => {
              //     teamMembers.push({
              //       userID: user.id,
              //       userEmail: user.mail,
              //       userName: user.displayName,
              //     });
              //   });
              // }
              else if (obj.jobTitle === "Admin") {
                setRole("Admin");
                setTapName("Admin");
                props.handleCilck("Admin");
                ReporteeList?.forEach((user: any) => {
                  teamMembers.push({
                    userID: user.id,
                    userEmail: user.mail,
                    userName: user.displayName,
                  });
                });
              } else {
                setTapName("Employee");
                props.handleCilck("Employee");
              }
            }
          });
          const teamEmployees = teamMembers.sort((a: any, b: any) =>
            a.userName.localeCompare(b.userName)
          );
          setEmployeeList([...teamEmployees]);
          console.log(teamEmployees);
        }
      })
      .catch((err) => {
        console.log(err, "getRoleFunctionAzureSetUp");
      });
  };

  useEffect(() => {
    sp.web
      .currentUser()
      .then((user) => {
        console.log(user);
        setCurrentUSer(user.Email);
        // getUserRole(user.Email);
        getAllUsers(user.Email);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    sp.web
      .currentUser()
      .then((user) => {
        getUserRole(user.Email);
      })
      .catch((err) => console.log(err));
  }, [ReporteeList?.length !== 0]);

  return (
    <div
      className=""
      style={{
        background: `linear-gradient(130deg, rgb(97 186 114), rgb(1 68 63))`,
        boxShadow: `0px 0px 10px rgba(0,0,0,0.1)`,
        height: "84vh",
        borderRadius: "0px 10px 10px 0px",
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
              "Goals" === tapName
                ? styles.seletedOptionContainer
                : styles.optionContainer
            }
            style={{
              // padding: props.isNav ? "3px 15px" : "0 15px",
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
                <span style={{ margin: "5px 0px 5px 10px" }}>Goals</span>
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
              "Manager" === tapName
                ? styles.seletedOptionContainer
                : styles.optionContainer
            }
            style={{
              display: props.isNav ? "" : "flex",
              justifyContent: props.isNav ? "flex-start" : "center",
              // padding: props.isNav ? "" : "0px",
            }}
            onClick={() => setIsShowEmployee(!isShowEmployee)}
          >
            {props.isNav ? (
              <div className={styles.optionIcon}>
                <HiUserGroup />
                <span style={{ margin: "5px 0px 5px 10px" }}>Manager</span>
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
                      emp.userName === tapMembersList
                        ? styles.seletedMembersContainer
                        : styles.optionMembersContainer
                    }
                    onClick={() => {
                      setTabMembersList(emp.userName);
                      setTapName("Manager");
                      props.handleCilck("Manager");
                      props.getEmployeeEmail(emp.userEmail);
                      dispatch(setAssignToUserDetails(emp));
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
              "Admin" === tapName
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
                <span style={{ margin: "5px 0px 5px 10px" }}>Admin</span>
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
              "Employee" === tapName
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
                <span style={{ margin: "5px 0px 5px 10px" }}>Employee</span>
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
