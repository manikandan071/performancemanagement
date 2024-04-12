import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import styles from "./SelfGoalsStyle.module.scss";

const SelfGoals = (props :any) => {

  const [masterData, setMasterData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  
  const getDetails = () => {
    sp.web.lists
      .getByTitle("SelfGoals")
      .items.select("*", "Employee/Id", "Employee/EMail", "Employee/Title")
      .expand("Employee")
      .get()
      .then((items) => {
        const filterData = items.filter((item) => {
          return item.Employee.EMail == props.curUser
        })
        console.log("filterData", filterData);
        const tempArr: any = []
        items.forEach((item) => {
          tempArr.push(
            {
              GoalName: item.GoalName,
              GoalCategory: item.GoalCategory,
            },
          );
        });
        let ID = 0;
        const categorizedItems = filterData.reduce((acc: any, obj: any) => {
          let existingCategory = acc.find(
            (item: any) => item.GoalCategory === obj.GoalCategory
          );
          if (existingCategory) {
            existingCategory.values.push({
              GoalName: obj.GoalName,
              isRowEdit: false,
              isNew: false,
              ID: obj.ID,
            });
          } else {
            acc.push({
              GoalCategory: obj.GoalCategory,
              mainID: ID++,
              values: [
                {
                  GoalName: obj.GoalName,
                  isRowEdit: false,
                  isNew: false,
                  ID: obj.ID,
                },
              ],
            });
          }
          return acc;
        }, []);
        setMasterData([...tempArr])
        setDuplicateData([...tempArr])
        setCategories([...categorizedItems])
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

  console.log("selfMasterData", masterData);
  console.log("selfCategories", categories);
  console.log("selfDuplicateData", duplicateData)

  const addNewCategory = (condition: boolean) => {
    throw new Error("Function not implemented.");
  }

  return (
    <>
    <div className={styles.addCategory} >
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
          {categories.map((items, index) => {
            return (
              <AccordionTab header={items.GoalCategory}>
                <div>
                  <DataTable value={items.values} className="p-datatable-sm">
                    <Column
                      className="col1"
                      field="GoalName"
                      header="Goal Name"
                      style={{ width: "35%" }}
                    ></Column>
                    <Column
                      className="col4"
                      header="Action"
                      style={{ width: "5%" }}
                    ></Column>
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
export default SelfGoals;
