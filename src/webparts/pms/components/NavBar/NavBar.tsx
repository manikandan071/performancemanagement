import * as React from "react";
import { sp } from "@pnp/sp/presets/all";
import { useState, useEffect } from "react";
import styles from "./NavBarStyle.module.scss";

const NavBar = (props: any) => {
  console.log(props);
  //   let navOptions = [
  //     { option: "Goals" },
  //     { option: "Manager" },
  //     { option: "Employee" },
  //   ];
  const [currentUser, setCurrentUSer] = useState("");
  const [tapName, setTapName] = useState("");
  const [navOptions, setNavOptions] = useState<any[]>([]);
  console.log(currentUser);

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
          res.forEach((obj) => {
            if (obj.Employee.EMail == mail) {
              if (obj.Roles == "HR") {
                setNavOptions([{ option: "Goals" }, { option: "Employee" }]);
                setTapName("Goals");
                props.handleCilck("Goals");
              } else if (obj.Roles == "Manager") {
                setNavOptions([{ option: "Manager" }, { option: "Employee" }]);
                setTapName("Manager");
                props.handleCilck("Manager");
              } else {
                setNavOptions([{ option: "Employee" }]);
                setTapName("Employee");
                props.handleCilck("Employee");
              }
            }
            // if (obj.Roles === "Hr") {
            //   let navArr = [{ option: "Goals" }, { option: "Employee" }];
            //   setNavOptions([...navArr]);
            // } else if (obj.Roles === "Manager") {
            //   let navArr = [{ option: "Goals" }, { option: "Employee" }];
            //   setNavOptions([...navArr]);
            // }
          });
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

      <div>
        {navOptions.map((obj) => {
          return (
            <div
              onClick={() => {
                setTapName(obj.option);
                props.handleCilck(obj.option);
                // const urlParams = new URLSearchParams(window.location.search);

                // // Update or add a parameter
                // urlParams.set("Page", obj.option);
                // const newUrl = `${
                //   window.location.pathname
                // }?${urlParams.toString()}${window.location.hash}`;
                // history.pushState(null, "", newUrl);
              }}
              className={
                obj.option == tapName
                  ? styles.seletedOptionContainer
                  : styles.optionContainer
              }
            >
              {obj.option}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default NavBar;
