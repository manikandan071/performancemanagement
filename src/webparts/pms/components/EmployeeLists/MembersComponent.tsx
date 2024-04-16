import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IDetailsListStyles,
} from "@fluentui/react";
import Button from "@mui/material/Button";
import { TbTargetArrow } from "react-icons/tb";
import styles from "./MembersStyle.module.scss";

const MembersComponent = (props: any) => {
  const gridStyles: Partial<IDetailsListStyles> = {
    root: {
      selectors: {
        "& [role=grid]": {
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          ".ms-DetailsRow-cell": {
            display: "flex",
            alignItems: "center",
            height: 50,
            minHeight: 50,
            padding: "5px 10px",
            margin: "auto",
          },
          ".ms-DetailsHeader-cell": {
            color: "#fff",
            backgroundColor: "#61b061",
            hover: {
              backgroundColor: "#61b061",
            },
          },
          ".ms-DetailsHeader-cellTitle": {
            padding: "0px 8px 0px 10px",
          },
        },
        ".ms-FocusZone": {
          padding: "0px",
        },
      },
    },
    headerWrapper: {
      flex: "0 0 auto",
    },
    contentWrapper: {
      flex: "1 1 auto",
      overflowY: "auto",
      overflowX: "hidden",
    },
  };

  const currentUser = props.currentUser;
  const currentUserName = props.CurrentUserName;
  const [membersList, setMembersList] = useState<any[]>([]);

  const columns = [
    {
      key: "columns1",
      name: "MembersName",
      fieldName: "EmployeeName",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.EmployeeName}</div>
        </>
      ),
    },
    {
      key: "columns2",
      name: "MembersEmail",
      fieldName: "Email",
      minWidth: 150,
      maxWidth: 230,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.Email}</div>
        </>
      ),
    },
    {
      key: "columns3",
      name: "Roles",
      fieldName: "Role",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.Role}</div>
        </>
      ),
    },
    {
      key: "columns4",
      name: "Manager",
      fieldName: "Manager",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.Manager}</div>
        </>
      ),
    },
    {
      key: "columns5",
      name: "Action",
      fieldName: "Action",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>
            <Button
              onClick={() => {
                props.state("GoalsComponent", item.Email);
              }}
              size="small"
            >
              <TbTargetArrow className={styles.goalIcon} />
            </Button>
          </div>
        </>
      ),
    },
  ];

  const getDetails = () => {
    sp.web.lists
      .getByTitle("EmployeeList")
      .items.select(
        "*",
        "Employee/EMail",
        "Employee/Id",
        "Employee/Title",
        "Members/Title",
        "Members/Id",
        "Members/EMail"
      )
      .expand("Employee,Members")
      .get()
      .then((response: any) => {
        response.forEach((items: any) => {
          if (
            items.Employee?.EMail === currentUser &&
            items.Roles === "Manager"
          ) {
            if (items.Members) {
              items.Members?.forEach((member: any) => {
                response.forEach((items: any) => {
                  if (items.Employee.Title == member.Title) {
                    let obj = {
                      EmployeeName: member.Title,
                      Role: items.Roles,
                      Manager: currentUserName,
                      Email: member.EMail,
                    };
                    membersList.push(obj);
                  }
                });
              });
            }
          }
        });
        setMembersList([...membersList]);
      })
      .catch((err) => {
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
      <div>
        <DetailsList
          items={membersList}
          columns={columns}
          styles={gridStyles}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
        />
      </div>
    </>
  );
};
export default MembersComponent;
