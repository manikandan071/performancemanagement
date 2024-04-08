import * as React from "react";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp/presets/all";
import { Column } from "primereact/column";
import {
  DataTable,
  //   DataTableExpandedRows,
  //   DataTableValueArray,
} from "primereact/datatable";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/primereact.min.css";
import { Dialog } from "primereact/dialog";
// import { Toast } from "primereact/toast";
import { HiPencil } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { GiOrganigram } from "react-icons/gi";
import { PiUserFocusDuotone } from "react-icons/pi";
import "./GoalsStyles.module.scss";
import styles from "./GoalsStyles.module.scss";
import "./goals.css";

const Goals = () => {
  // const toast = useRef("");
  const [masterData, setMasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [deletedGoals, setDeletedGoals] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([{ name: "", code: "" }]);
  const [assignLevelList, setAssignLevelList] = useState<any[]>([
    { name: "", code: "" },
  ]);
  const [isPopup, setIsPopup] = useState<any>({
    delPopup: false,
    delIndex: null,
  });
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });

  console.log(
    usersList,
    deletedGoals,
    categories,
    masterData,
    duplicateData,
    categoryHandleObj,
    isPopup
  );

  const getPreDefinedGoals = () => {
    sp.web.lists
      .getByTitle(`HrGoals`)
      .items.get()
      .then((res) => {
        let tempArr: any = [];
        let ID = 1;
        let deletedGoals = res.filter((del) => del.isDelete);
        let assignedGoals = res.filter((del) => !del.isDelete);
        let groupedArray = assignedGoals.reduce((acc, obj) => {
          let existingCategory = acc.find(
            (item: any) => item.GoalCategory === obj.GoalCategory
          );
          if (existingCategory) {
            existingCategory.values.push({
              GoalName: obj.GoalName,
              AssignLevel: { name: obj.AssignLevel, code: obj.AssignLevel },
              Role: obj.Role
                ? obj.Role.map((role: any) => ({
                    name: role,
                    code: role,
                  }))
                : [],
              ID: obj.ID,
              isRowEdit: false,
              isNew: false,
            });
          } else {
            acc.push({
              GoalCategory: obj.GoalCategory,
              mainID: ID++,
              values: [
                {
                  GoalName: obj.GoalName,
                  AssignLevel: { name: obj.AssignLevel, code: obj.AssignLevel },
                  Role: obj.Role
                    ? obj.Role.map((role: any) => ({
                        name: role,
                        code: role,
                      }))
                    : [],
                  ID: obj.ID,
                  isRowEdit: false,
                  isNew: false,
                },
              ],
            });
          }
          return acc;
        }, []);
        console.log(groupedArray);
        assignedGoals.forEach((obj) => {
          let json = {
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            AssignLevel: obj.AssignLevel
              ? { name: obj.AssignLevel, code: obj.AssignLevel }
              : { name: "", code: "" },
            Role: obj.Role
              ? obj.Role.map((role: any) => ({ name: role, code: role }))
              : [],
            isRowEdit: false,
            isNew: false,
          };
          tempArr.push(json);
        });
        let tempaArray = [...tempArr];
        setDeletedGoals([...deletedGoals]);
        setCategories([...groupedArray]);
        setDuplicateData(tempaArray);
        setMasterData(tempaArray);
        console.log(tempArr, tempaArray);
      })
      .catch((err) => console.log(err));
  };

  const getUsersRoles = () => {
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
          let rolesSet = new Set();
          let uniqueArray = res.filter((data) => {
            if (!rolesSet.has(data.Roles)) {
              rolesSet.add(data.Roles);
              return true;
            }
            return false;
          });
          let rolesArr: any = uniqueArray.map((role) => {
            return { name: role.Roles, code: role.Roles };
          });
          setRolesList([...rolesArr]);
          setAssignLevelList([
            { name: "Organization", code: "Organization" },
            { name: "Role", code: "Role" },
          ]);
          let userArr: {
            EmployeeName: string;
            UserEmail: string;
            Role: string;
          }[] = [];
          res.forEach((obj) => {
            userArr.push({
              EmployeeName: obj.Employee.Title,
              UserEmail: obj.Employee.EMail,
              Role: obj.Roles,
            });
          });
          setUsersList([...userArr]);
          getPreDefinedGoals();
          //   res.filter((val,index)=>res.indexOf(val.Roles) === index)
        }
      })
      .catch((err) => console.log(err));
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
          AssignLevel: obj.AssignLevel,
          Role: obj.Role,
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
              AssignLevel: obj.AssignLevel,
              Role: obj.Role,
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
    let tempCategoryArr = [...categories];
    if (condition) {
      if (categoryHandleObj.newCategory != "") {
        tempArr.push({
          ID:
            Math.max(
              ...duplicateData.concat([...deletedGoals]).map((o) => o.ID)
            ) + 1,
          GoalCategory: categoryHandleObj.newCategory,
          GoalName: "",
          AssignLevel: { name: "", code: "" },
          Role: [],
          isRowEdit: true,
          isNew: true,
        });
        console.log(tempArr, duplicateData);
        setDuplicateData([...tempArr]);
        categoryHandleFun([...tempArr]);
        setCategoryHandleObj({
          ...categoryHandleObj,
          newCategory: "",
          isNew: false,
        });
      } else {
        alert("please enter category");
      }
    } else {
      let index = tempCategoryArr.findIndex(
        (ind) => ind.mainID === categoryHandleObj.ID
      );
      let tempObj = tempCategoryArr[index];
      if (tempObj.GoalCategory != categoryHandleObj.newCategory) {
        console.log("changed");
        // tempObj.GoalCategory = categoryHandleObj.newCategory;
        let categoryGolasArr = tempObj.values;
        categoryGolasArr.forEach((obj: any) => {
          sp.web.lists
            .getByTitle(`HrGoals`)
            .items.getById(obj.ID)
            .update({ GoalCategory: categoryHandleObj.newCategory })
            .then((res) => {
              let duplicateindex = tempArr.findIndex(
                (temp) => temp.ID === obj.ID
              );
              let duplicateObj = tempArr[duplicateindex];
              tempArr[duplicateindex] = {
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
              setMasterData([...tempArr]);
              setDuplicateData([...tempArr]);
              categoryHandleFun([...tempArr]);
            })
            .catch((err) => console.log(err));
        });
      }
      console.log(tempObj);
    }
  };

  const addGoalFunction = (ind: number) => {
    let result = duplicateData.filter(
      (o) => !masterData.some((v) => v.ID === o.ID)
    );
    console.log(result);

    let tempArr = categories;
    let index = [...tempArr].findIndex((obj) => obj.mainID == ind + 1);
    let data = tempArr[index];
    setDuplicateData([
      ...duplicateData,
      {
        ID:
          Math.max(
            ...duplicateData.concat([...deletedGoals]).map((o) => o.ID)
          ) + 1,
        AssignLevel: { name: "", code: "" },
        Role: [],
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        GoalCategory: data.GoalCategory,
      },
    ]);
    categoryHandleFun([
      ...duplicateData,
      {
        ID:
          Math.max(
            ...duplicateData.concat([...deletedGoals]).map((o) => o.ID)
          ) + 1,
        AssignLevel: { name: "", code: "" },
        Role: [],
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        GoalCategory: data.GoalCategory,
      },
    ]);
    console.log(data);
  };

  const editCategoryFun = (ind: number) => {
    console.log(ind);
    setCategoryHandleObj({
      ...categoryHandleObj,
      ID: ind + 1,
      newCategory: categories[ind].GoalCategory,
      isUpdate: true,
    });
  };

  const deleteCategoryFun = () => {
    let duplicateArray = [...duplicateData];
    let tempCategoryArr = [...categories];
    let index = tempCategoryArr.findIndex(
      (ind) => ind.mainID === isPopup.delIndex + 1
    );
    let tempObj = tempCategoryArr[index];
    let categoryGolasArr = tempObj.values;
    categoryGolasArr.forEach((obj: any) => {
      duplicateArray = duplicateArray.filter((fill) => fill.ID !== obj.ID);
      setDuplicateData([...duplicateArray]);
      setIsPopup({ ...isPopup, delIndex: null, delPopup: false });
      setMasterData([...duplicateArray]);
      categoryHandleFun([...duplicateArray]);
      sp.web.lists
        .getByTitle(`HrGoals`)
        .items.getById(obj.ID)
        .update({ isDelete: true })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    });

    console.log(isPopup);
  };

  const editRowFunction = (data: any) => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
    console.log(duplicateArr);
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
  };

  const goalSubmitFun = (data: any) => {
    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let tempObj = duplicateData[index];
    let addObj: any = {
      AssignLevel: tempObj.AssignLevel.name,
      Role: tempObj.Role
        ? { results: tempObj.Role.map((role: any) => role.name) }
        : { results: [""] },
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
    };
    console.log(tempObj, addObj);
    if (tempObj.isNew) {
      sp.web.lists
        .getByTitle(`HrGoals`)
        .items.add({
          AssignLevel: tempObj.AssignLevel.name,
          Role: tempObj.Role
            ? { results: tempObj.Role.map((role: any) => role.name) }
            : { results: [""] },
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          isDelete: false,
        })
        .then((res) => {
          console.log(res);
          let duplicateArr = [...duplicateData];
          let index = [...duplicateArr].findIndex(
            (obj: any) => obj.ID === data.ID
          );
          let tempObj = duplicateArr[index];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
            [`${"isNew"}`]: false,
          };
          console.log(duplicateArr);
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);
        })
        .catch((err) => console.log(err));
    } else {
      sp.web.lists
        .getByTitle(`HrGoals`)
        .items.getById(tempObj.ID)
        .update(addObj)
        .then((res) => {
          console.log(res);
          let duplicateArr = [...duplicateData];
          let index = [...duplicateArr].findIndex(
            (obj: any) => obj.ID === data.ID
          );
          let tempObj = duplicateArr[index];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
          };
          console.log(duplicateArr);
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
    // let tempObj = duplicateArr[index];
    console.log(tempObjMain, duplicateArr);
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
  };

  const goalDeleteFun = (data: any) => {
    console.log(data);

    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let delObj = duplicateData[index];
    setDeletedGoals([...deletedGoals, delObj]);
    console.log(duplicateData);
    let delArray = duplicateData.filter((items) => items.ID != data.ID);
    sp.web.lists
      .getByTitle(`HrGoals`)
      .items.getById(delObj.ID)
      .update({ isDelete: true })
      .then((res) => {
        console.log(res);
        categoryHandleFun([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
      })
      .catch((err) => console.log(err));
  };

  const onChangeHandleFun = (value: any, type: string, id: number) => {
    console.log(value, type, id);
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

  const AssignLevelBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <Dropdown
        value={rowData.AssignLevel}
        onChange={(e) => onChangeHandleFun(e.value, "AssignLevel", rowData.ID)}
        options={assignLevelList}
        optionLabel="name"
        placeholder="Select a Role"
        className="w-full md:w-14rem"
      />
    ) : (
      <div style={{ paddingLeft: "15px" }}>
        {rowData.AssignLevel.name === "Organization" ? (
          <GiOrganigram className="roleIcon" />
        ) : (
          <PiUserFocusDuotone className="roleIcon" />
        )}
        {rowData.AssignLevel.name}
      </div>
    );
  };

  const RoleBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      rowData.AssignLevel.name == "Role" ? (
        // <Dropdown
        //   value={rowData.Role}
        //   onChange={(e) => onChangeHandleFun(e.value, "Role", rowData.ID)}
        //   options={rolesList}
        //   optionLabel="name"
        //   placeholder="Select a Role"
        //   className="w-full md:w-14rem"
        // />

        <MultiSelect
          value={rowData.Role}
          onChange={(e) => onChangeHandleFun(e.value, "Role", rowData.ID)}
          options={rolesList}
          optionLabel="name"
          display="chip"
          placeholder="Select Roles"
          maxSelectedLabels={3}
          className="w-full md:w-20rem"
        />
      ) : (
        <div></div>
      )
    ) : (
      <div style={{ paddingLeft: "15px" }}>
        {rowData.Role.map((role: any) => (
          <p style={{ margin: "0px" }}>{role.name}</p>
        ))}
      </div>
    );
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

  useEffect(() => {
    getUsersRoles();
  }, []);

  return (
    <div className="">
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
      <Accordion>
        {categories.map((data, index) => {
          return (
            <AccordionTab
              className="accordionMain"
              header={
                <span className="flex d-flex justify-content-between align-items-center gap-2 w-full category-sec">
                  {/* <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" /> */}
                  <span className="CategoryTitle">{data.GoalCategory}</span>
                  <div className="font-bold iconSec">
                    {/* <Toast ref={toast} /> */}
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
                            label="Delete"
                          ></Button>
                        </div>
                      </Dialog>
                    )}
                    {data.values.filter((val: any) => val.isNew).length ===
                    0 ? (
                      <GrAdd
                        className="addIcon"
                        onClick={() => addGoalFunction(index)}
                      />
                    ) : null}
                    <HiPencil
                      className="editIcon"
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
                  {/* <Badge value="3" className="ml-auto" /> */}
                </span>
              }
            >
              <div className="goalsTable">
                <DataTable
                  value={data.values}
                  size="normal"
                  // stripedRows
                  tableStyle={{ minWidth: "30rem" }}
                >
                  <Column
                    className="col1"
                    field="GoalName"
                    header="Goal Name"
                    style={{ width: "35%" }}
                    body={GoalnameBodyTemplate}
                  ></Column>
                  <Column
                    className="col2"
                    field="AssignLevel"
                    header="Assign Level"
                    style={{ width: "20%" }}
                    body={AssignLevelBodyTemplate}
                  ></Column>
                  <Column
                    className="col3"
                    field="Role"
                    header="Role"
                    style={{ width: "40%" }}
                    body={RoleBodyTemplate}
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

      {/* <DataTable
        value={newData}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="name"
      >
        <Column expander={true} style={{ width: "2rem" }} />
        <Column
          field="name"
          header="Name"
          style={{ fontWeight: 500, fontSize: "16px" }}
        />
      </DataTable> */}
    </div>
  );
};
export default Goals;
