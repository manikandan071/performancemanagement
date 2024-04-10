import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import styles from "./ManagerStyle.module.scss";
// import { HiPencil } from "react-icons/hi2";
// import { GrAdd } from "react-icons/gr";
// import { MdDelete } from "react-icons/md";

const PredefinedGoals = (props: any) => {
  const [masterData, setMasterData] = useState<any[]>([]);
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });
 

  const getDetails = () => {
    sp.web.lists
      .getByTitle("PredefinedGoals")
      .items.select("*", "AssignTo/EMail", "AssignTo/Id", "AssignTo/Title")
      .expand("AssignTo")
      .get()
      .then((items: any) => {
        console.log(items);

        const filter = items.filter(
          (item: any) => props.userEmail == item.AssignTo.EMail
        );
        let ID = 0;
        const categorizedItems = filter.reduce((acc: any, obj: any) => {
          let existingCategory = acc.find(
            (item: any) => item.GoalCategory === obj.GoalCategory
          );
          console.log(existingCategory, "existingCategory");
          if (existingCategory) {
            existingCategory.values.push({
              GoalName: obj.GoalName,
              GoalCategory: obj.GoalCategory,
              // AssignLevel: { name: obj.AssignLevel, code: obj.AssignLevel },
              // Role: obj.Role
              //   ? obj.Role.map((role: any) => ({
              //       name: role,
              //       code: role,
              //     }))
              //   : [{ name: "", code: "" }],
              // ID: obj.ID,
              // isRowEdit: false,
              // isNew: false,
            });
          } else {
            acc.push({
              GoalCategory: obj.GoalCategory,
              mainID: ID++,
              values: [
                {
                  GoalName: obj.GoalName,

                  // AssignLevel: { name: obj.AssignLevel, code: obj.AssignLevel },
                  // Role: obj.Role
                  //   ? obj.Role.map((role: any) => ({
                  //       name: role,
                  //       code: role,
                  //     }))
                  //   : [{ name: "", code: "" }],
                  // ID: obj.ID,
                  // isRowEdit: false,
                  // isNew: false,
                },
              ],
            });
          }
          return acc;
        }, []);
        console.log(categorizedItems);
        setMasterData([...categorizedItems]);
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
 

  const addNewCategory = (condition: boolean) => {
    if (categoryHandleObj.isNew) {
      const newCategory = categoryHandleObj.newCategory;
      if (newCategory) {
        setMasterData(prevState => [
          ...prevState,
          {
            GoalCategory: newCategory,
            mainID: prevState.length,
            values :[]
          }
        ]);
      }
      setCategoryHandleObj({
        ...categoryHandleObj,
        newCategory: "",
        isNew: false,
        isUpdate: false,
      });
    }
  }
  console.log(masterData,"masterData PreDefinedGoals"); 

 
  return (
    <>
      <div className={styles.addCategory}>
        {categoryHandleObj.isNew || categoryHandleObj.isUpdate ? (
          <div style={{ display: "flex", gap: 5 }}>
            <InputText
              value={categoryHandleObj.newCategory}
              id="category"
              type="text"
              placeholder="Category"
              onChange={(e) => {
                setCategoryHandleObj({
                  ...categoryHandleObj,
                  newCategory: e.target.value,
                });
              }}
            />
            {categoryHandleObj.isUpdate ? (
              <Button
                label="Submit"
                severity="success"
                onClick={(e) => addNewCategory(false)}
              />
            ) : (
              <Button
                label="Add"
                severity="success"
                onClick={(e) => addNewCategory(true)}
              />
            )}

            <Button
              label="Cancel"
              severity="danger"
              text
              onClick={(e) => {
                // setNewCategory("");
                setCategoryHandleObj({
                  ...categoryHandleObj,
                  newCategory: "",
                  isNew: false,
                  isUpdate: false,
                });
              }}
            />
          </div>
        ) : (
          <Button
            label="New Category"
            onClick={(e) =>
              setCategoryHandleObj({ ...categoryHandleObj, isNew: true })
            }
          />
        )}
      </div>
      <div className="card">
        <Accordion activeIndex={0}>
          {masterData.map((items, index) => {
            console.log(items);
            return (
              <AccordionTab header={items.GoalCategory}>
                <div>
                  <DataTable value={items.values} className="p-datatable-sm">
                    <Column field="GoalName" header="Goal Name" />
                  </DataTable>
                </div>
              </AccordionTab>
            );
          })}
        </Accordion>
      </div>
    </>
  );
};
export default PredefinedGoals;
