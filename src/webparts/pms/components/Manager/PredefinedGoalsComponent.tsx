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
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });
  console.log(masterData, duplicateData, categories);

  const getDetails = () => {
    sp.web.lists
      .getByTitle("PredefinedGoals")
      .items.select("*", "AssignTo/EMail", "AssignTo/Id", "AssignTo/Title")
      .expand("AssignTo")
      .get()
      .then((items: any) => {
        console.log(items);
        const filterData = items.filter(
          (item: any) => props.userEmail == item.AssignTo.EMail
        );
        let tempArr: any = [];
        let ID = 0;
        const categorizedItems = filterData.reduce((acc: any, obj: any) => {
          let existingCategory = acc.find(
            (item: any) => item.GoalCategory === obj.GoalCategory
          );
          console.log(existingCategory, "existingCategory");
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
        filterData.forEach((obj: any) => {
          tempArr.push({
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            AssignToId: obj.AssignTo ? obj.AssignTo.Id : "",
            isRowEdit: false,
            isNew: false,
          });
        });
        setMasterData([...tempArr]);
        setDuplicateData([...tempArr]);
        console.log(categorizedItems);
        setCategories([...categorizedItems]);
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
    let tempArr = [...duplicateData];
    if (condition) {
      if (categoryHandleObj.newCategory !== "") {
        tempArr.push({
          GoalCategory: categoryHandleObj.newCategory,
          GoalName: "",
          AssignToId: props.userEmail,
          isRowEdit: true,
          isNew: true,
        });
        setDuplicateData((prevState) => [
          ...prevState,
          {
            GoalCategory: categoryHandleObj.newCategory,
            mainID: prevState.length,
            values: [],
          },
        ]);
      }
      setCategoryHandleObj({
        ...categoryHandleObj,
        newCategory: "",
        isNew: false,
        isUpdate: false,
      });
    }
  };

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
          {categories.map((items, index) => {
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
