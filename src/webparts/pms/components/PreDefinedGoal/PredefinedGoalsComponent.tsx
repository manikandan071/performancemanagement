import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { HiPencil } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import styles from "./PreDefinedGoalsStyle.module.scss";


const PredefinedGoals = (props: any) => {
  const [totalPDGoals, setTotalPDGoals] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });
  const [assignUserObj, setAssignUserObj] = useState<any>({
    userID: null,
    userName: "",
    userEmail: "",
  });
  console.log(masterData, duplicateData, categories, totalPDGoals);

  const getDetails = () => {
    sp.web.lists
      .getByTitle("PredefinedGoals")
      .items.select("*", "AssignTo/EMail", "AssignTo/Id", "AssignTo/Title")
      .expand("AssignTo")
      .get()
      .then((items: any) => {
        console.log(items);
        setTotalPDGoals([...items]);
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
    sp.web
      .siteUsers()
      .then((res) => {
        res.forEach((user) => {
          if (user.Email === props.userEmail) {
            console.log(user);
            setAssignUserObj({
              ...assignUserObj,
              userID: user.Id,
              userName: user.Title,
              userEmail: user.Email,
            });
          }
        });
      })
      .catch((err) => console.log(err));
    getDetails();
  };

  useEffect(() => {
    init();
  }, []);

  const goalSubmitFun = (data: any) => {
    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let tempObj = duplicateData[index];
    let addObj: any = {
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
    };
    console.log(data, addObj);
    if (data.isNew) {
      sp.web.lists
        .getByTitle(`PredefinedGoals`)
        .items.add({
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          AssignToId: assignUserObj.userID,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  };
  const editCancelFun = (data: any) => {
    console.log(data);
  };

  const categoryHandleFun = (data: any) => {
    let ID = 1;
    let groupedArray = data.reduce((acc: any, obj: any) => {
      let existingCategory = acc.find(
        (item: any) => item.GoalCategory === obj.GoalCategory
      );
      if (existingCategory) {
        existingCategory.values.push({
          GoalName: obj.GoalName,
          ID: obj.ID,
          isRowEdit: obj.isRowEdit,
          isNew: obj.isNew,
        });
      } else {
        acc.push({
          GoalCategory: obj.GoalCategory,
          mainID: ID++,
          values: [
            {
              GoalName: obj.GoalName,
              ID: obj.ID,
              isRowEdit: obj.isRowEdit,
              isNew: obj.isNew,
            },
          ],
        });
      }
      return acc;
    }, []);
    console.log(groupedArray);
    setCategories([...groupedArray]);
  };

  const addNewCategory = (condition: boolean) => {
    let tempArr = [...duplicateData];
    if (condition) {
      if (categoryHandleObj.newCategory !== "") {
        tempArr.push({
          ID: Math.max(...totalPDGoals.map((o) => o.ID)) + 1,
          GoalCategory: categoryHandleObj.newCategory,
          GoalName: "",
          AssignToId: props.userEmail,
          isRowEdit: true,
          isNew: true,
        });
        setDuplicateData([...tempArr]);
        categoryHandleFun([...tempArr]);
        setCategoryHandleObj({
          ...categoryHandleObj,
          newCategory: "",
          isNew: false,
          isUpdate: false,
        });
      }
    }
  };
  const onChangeHandleFun = (value: any, type: string, id: number) => {
    let tempArr = duplicateData.map((obj) => {
      if (obj.ID == id) {
        if (type === "GoalName") {
          obj.GoalName = value;
          return obj;
        }
        if (type === "Role") {
          obj.Role = value;
          return obj;
        }
        if (type === "AssignLevel") {
          obj.AssignLevel = value;
          if (value.name == "Organization") {
            obj.Role = [];
            return obj;
          } else {
            return obj;
          }
        }
      } else {
        return obj;
      }
    });
    categoryHandleFun([...tempArr]);
  };

  const GoalnameBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <InputText
        value={rowData.GoalName}
        type="text"
        onChange={(e) =>
          onChangeHandleFun(e.target.value, "GoalName", rowData.ID)
        }
      />
    ) : (
      <div style={{ padding: "8px 0px 8px 15px" }}>{rowData.GoalName}</div>
    );
  };
  const ActionBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <div>
        <IoMdCheckmark
          // className={styles.submitIcon}
          onClick={() => goalSubmitFun(rowData)}
        />
        <MdOutlineClose
          // className={styles.cancelIcon}
          onClick={() => editCancelFun(rowData)}
        />
      </div>
    ) : (
      <div>
        <HiPencil
        // className={styles.editIcon}
        // onClick={(e) => editRowFunction(rowData)}
        />
        <MdDelete
        // className={styles.cancelIcon}
        // onClick={() => goalDeleteFun(rowData)}
        />
      </div>
    );
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
                    <Column
                      className="col1"
                      field="GoalName"
                      header="Goal Name"
                      style={{ width: "35%" }}
                      body={GoalnameBodyTemplate}
                    ></Column>
                    <Column
                      className="col4"
                      header="Action"
                      style={{ width: "5%" }}
                      body={ActionBodyTemplate}
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
export default PredefinedGoals;
