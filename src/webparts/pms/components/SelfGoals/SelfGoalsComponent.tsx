import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { HiPencil } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import styles from "./SelfGoalsStyle.module.scss";

const SelfGoals = (props :any) => {
  console.log("SelfGoalsProps",props);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [totalSFGoals, setTotalSFGoals] = useState<any[]>([]);
  const [isPopup, setIsPopup] = useState<any>({
    delPopup: false,
    delIndex: null,
  });
  const [assignUserObj, setAssignUserObj] = useState<any>({
    userID: null,
    userName: "",
    userEmail: "",
  });

  console.log(masterData,duplicateData,categories);
  
  
  const getDetails = () => {
    sp.web.lists
      .getByTitle("SelfGoals")
      .items.select("*", "Employee/Id", "Employee/EMail", "Employee/Title")
      .expand("Employee")
      .get()
      .then((items) => {
        setTotalSFGoals([...items]);
        const filterData = items.filter((item) => {
          return item.Employee.EMail == props.curUser
        })
        const tempArr: any = [];
        // items.forEach((item) => {
        //   tempArr.push(
        //     {
        //       GoalName: item.GoalName,
        //       GoalCategory: item.GoalCategory,
        //     },
        //   );
        // });
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
        filterData.forEach((obj: any) => {
          tempArr.push({
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            EmployeeId: obj.Employee ? obj.Employee.Id : "",
            isRowEdit: false,
            isNew: false,
          });
        });
        setMasterData([...tempArr])
        setDuplicateData([...tempArr])
        setCategories([...categorizedItems])
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
        if (user.Email === props.curUser) {
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
    setCategories([...groupedArray]);
  };

  const addNewCategory = (condition: boolean) => {
    let tempArray = [...duplicateData];
    let tempCategoryArr = [...categories];
    if (condition) {
      if (categoryHandleObj.newCategory !== "") {
        tempArray.push({
          ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
          GoalCategory: categoryHandleObj.newCategory,
          GoalName: "",
          EmployeeId: props.curUser,
          isRowEdit: true,
          isNew: true,
        });
        setDuplicateData([...tempArray]);
        categoryHandleFun([...tempArray]);
        setCategoryHandleObj({
          ...categoryHandleObj,
          newCategory: "",
          isNew: false,
          isUpdate: false,
        });
      }
    }
    else {
      let index = tempCategoryArr.findIndex(
        (inx) => inx.mainID === categoryHandleObj.ID
      );
      let tempObj = tempCategoryArr[index];
      let categoryGolasArr = tempObj.values;
      if (tempObj.GoalCategory != categoryHandleObj.newCategory) {
        categoryGolasArr.forEach((obj: any) => {
          sp.web.lists
            .getByTitle("SelfGoals")
            .items.getById(obj.ID)
            .update({ GoalCategory: categoryHandleObj.newCategory })
            .then((res) => {
              let duplicateindex = tempArray.findIndex(
                (temp) => temp.ID === obj.ID
              );
              let duplicateObj = tempArray[duplicateindex];
              tempArray[duplicateindex] = {
                ...duplicateObj,
                [`${"GoalCategory"}`]: categoryHandleObj.newCategory,
              };
              setCategoryHandleObj({
                ...categoryHandleObj,
                newCategory: "",
                isNew: false,
                isUpdate: false,
                ID: null,
              });
              setMasterData([...tempArray]);
              setDuplicateData([...tempArray]);
              categoryHandleFun([...tempArray]);
            })
            .catch((err) => console.log(err));
        });
      }
    }
  };

  const deleteCategoryFun = () => {
    let duplicateArray = [...duplicateData];
    let tempCategoryArr = [...categories];
    let index = tempCategoryArr.findIndex(
      (ind) => ind.mainID === isPopup.delIndex + 1
    );
    let tempObj = tempCategoryArr[index];
    let categoryGoalsArr = tempObj.values;
    categoryGoalsArr.forEach((obj: any) => {
      duplicateArray = duplicateArray.filter((fill) => fill.ID !== obj.ID);
      setDuplicateData([...duplicateArray]);
      setIsPopup({ ...isPopup, delIndex: null, delPopup: false });
      setMasterData([...duplicateArray]);
      categoryHandleFun([...duplicateArray]);
      sp.web.lists
        .getByTitle("SelfGoals")
        .items.getById(obj.ID)
        .update({ isDelete: true })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    });
  };

  const addGoalFunction = (ind: number) => {
    let tempArrVal = categories;
    let index = [...tempArrVal].findIndex((obj) => obj.mainID == ind + 1);
    let data = tempArrVal[index];
    setDuplicateData([
      ...duplicateData,
      {
        ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        GoalCategory: data.GoalCategory,
      },
    ]);
    categoryHandleFun([
      ...duplicateData,
      {
        ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        GoalCategory: data.GoalCategory,
      },
    ]);
  };

  const editCategoryFun = (ind: number) => {
    setCategoryHandleObj({
      ...categoryHandleObj,
      ID: ind + 1,
      newCategory: categories[ind].GoalCategory,
      isUpdate: true,
    });
  };
  
  const onChangeHandleFun = (value: any, type: string, id: number) => {
    let tempArrvalues = duplicateData.map((obj) => {
      if (obj.ID == id) {
        if (type === "GoalName") {
          obj.GoalName = value;
          return obj;
        }
      } else {
        return obj;
      }
    });
    categoryHandleFun([...tempArrvalues]);
  };
  
  const GoalnameBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <InputTextarea
        value={rowData.GoalName}
        rows={2}
        cols={30}
        onChange={(e) =>
          onChangeHandleFun(e.target.value, "GoalName", rowData.ID)
        }
      />
    ) : (
      <div style={{ padding: "8px 0px 8px 15px" }}>{rowData.GoalName}</div>
    );
  };
  
  const goalSubmitFun = (data: any) => {
    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let tempObj = duplicateData[index];
    let addObj: any = {
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
    };
    if (data.isNew) {
      sp.web.lists
        .getByTitle("SelfGoals")
        .items.add({
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          EmployeeId: assignUserObj.userID,
        })
        .then((res) => {
          let duplicateArr = [...duplicateData];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
            [`${"isNew"}`]: false,
          };
          setTotalSFGoals([...totalSFGoals, tempObj]);
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);
        })
        .catch((err) => console.log(err));
    } else {
      sp.web.lists
        .getByTitle("SelfGoals")
        .items.getById(tempObj.ID)
        .update(addObj)
        .then((res) => {
          let duplicateArr = [...duplicateData];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
          };
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);
        })
        .catch((err) => console.log(err));
    }
  };


  const editCancelFun = (data: any) => {
    let duplicateArr = [...duplicateData];
    let indexMain = [...masterData].findIndex((obj: any) => obj.ID === data.ID);
    let tempObjMain = masterData[indexMain];
    if (tempObjMain) {
      let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
      duplicateArr[index] = tempObjMain;
    } else {
      duplicateArr = duplicateArr.filter((obj) => obj.ID !== data.ID);
    }
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
  };

  const editRowFunction = (data: any) => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
  };

  const goalDeleteFun = (data: any) => {
    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let delObj = duplicateData[index];
    // setDeletedGoals([...deletedGoals, delObj]);
    let delArray = duplicateData.filter((items) => items.ID != data.ID);
    sp.web.lists
      .getByTitle("SelfGoals")
      .items.getById(delObj.ID)
      .update({ isDelete: true })
      .then((res) => {
        categoryHandleFun([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
      })
      .catch((err) => console.log(err));
  };

  const ActionBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <div>
        <IoMdCheckmark
          className={styles.submitIcon}
          onClick={() => goalSubmitFun(rowData)}
        />
        <MdOutlineClose
          className={styles.cancelIcon}
          onClick={() => editCancelFun(rowData)}
        />
      </div>
    ) : (
      <div>
        <HiPencil
          className={styles.editIcon}
          onClick={(e) => editRowFunction(rowData)}
        />
        <MdDelete
          className={styles.cancelIcon}
          onClick={() => goalDeleteFun(rowData)}
        />
      </div>
    );
  };

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
              <AccordionTab header={<span className="flex d-flex justify-content-between align-items-center gap-2 w-full category-sec">
              <span className="CategoryTitle">{items.GoalCategory}</span>
              <div className="font-bold iconSec">
                {isPopup.delIndex === index && isPopup.delPopup && (
                  <Dialog
                    header="Header"
                    visible={isPopup.delPopup}
                    style={{ width: "25%" }}
                    onClick={(e) => e.stopPropagation()}
                    onHide={() =>
                      setIsPopup({
                        ...isPopup,
                        delPopup: false,
                        delIndex: null,
                      })
                    }
                  >
                    <div>
                      <p>Do you want to delete this category?</p>
                      <Button
                        onClick={() => deleteCategoryFun()}
                        icon="pi pi-check"
                        label="Confirm"
                        className="mr-2"
                      ></Button>
                      <Button
                        // onClick={confirm2}
                        text
                        icon="pi pi-times"
                        label="Cancel"
                      ></Button>
                    </div>
                  </Dialog>
                )}
                {items.values.filter((val: any) => val.isNew).length ===
                0 ? (
                  <GrAdd
                    className={styles.addIcon}
                    onClick={() => addGoalFunction(index)}
                  />
                ) : null}
                <HiPencil
                  className={styles.editIcon}
                  onClick={(event) => {
                    event.preventDefault(),
                      event.stopPropagation(),
                      editCategoryFun(index);
                  }}
                />
                <MdDelete
                  className={styles.cancelIcon}
                  onClick={(event) => {
                    event.preventDefault(),
                      event.stopPropagation(),
                      setIsPopup({
                        ...isPopup,
                        delPopup: true,
                        delIndex: index,
                      });
                  }}
                />
              </div>
            </span>}>
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
export default SelfGoals;
