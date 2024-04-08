import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "@fluentui/react";
import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

const PredefinedGoals = (props: any) => {
  const [masterData, setMasterData] = useState<any[]>([]);
  console.log(props.curUser, "preDefinedGoalsUserEmail");

  const columns = [
    {
      key: "columns1",
      name: "GoalName",
      fieldName: "GoalName",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.GoalName}</div>
        </>
      ),
    },
    {
      key: "columns2",
      name: "GoalCategory",
      fieldName: "GoalCategory",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.GoalCategory}</div>
        </>
      ),
    },
    {
      key: "columns3",
      name: "EmployeeName",
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
  ];
  const getDetails = () => {
    sp.web.lists
      .getByTitle("PredefinedGoals")
      .items.select("*", "AssignTo/EMail", "AssignTo/Id", "AssignTo/Title")
      .expand("AssignTo")
      .get()
      .then((items: any) => {
        console.log(items);
        let details: any = [];
        items.filter((item: any) => {
          if (props.userEmail == item.AssignTo.EMail) {
            details.push({
              GoalName: item.GoalName,
              GoalCategory: item.GoalCategory,
              EmployeeName: item.AssignTo.Title,
            });
          } else if (props.curUser == item.AssignTo.EMail) {
            details.push({
              GoalName: item.GoalName,
              GoalCategory: item.GoalCategory,
              EmployeeName: item.AssignTo.Title,
            });
          }
        });
        setMasterData([...details]);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const init = () => {
    getDetails();
  };

  useEffect(() => {
    init();
  }, []);
  console.log(masterData);
  return (
    <>
      <div className="card">
        <Accordion activeIndex={0}>
          <AccordionTab header="Header I">
            <div>
              <DetailsList
                items={masterData}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
            </div>
          </AccordionTab>
        </Accordion>
      </div>
    </>
  );
};
export default PredefinedGoals;
