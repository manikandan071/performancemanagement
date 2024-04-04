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
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/primereact.min.css";
import { HiPencil } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { VscAdd } from "react-icons/vsc";
import "./GoalsStyles.module.scss";
import styles from "./GoalsStyles.module.scss";
import "./goals.css";

const Goals = () => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([{ name: "", code: "" }]);
  const [assignLevelList, setAssignLevelList] = useState<any[]>([
    { name: "", code: "" },
  ]);
  const [isAddCategory, setIsAddCategory] = useState<Boolean>(false);
  console.log(
    categories,
    usersList,
    rolesList,
    newCategory,
    masterData,
    duplicateData
  );

  const getPreDefinedGoals = () => {
    sp.web.lists
      .getByTitle(`HrGoals`)
      .items.get()
      .then((res) => {
        let tempArr: any = [];
        let ID = 1;
        let groupedArray = res.reduce((acc, obj) => {
          let existingCategory = acc.find(
            (item: any) => item.GoalCategory === obj.GoalCategory
          );
          if (existingCategory) {
            existingCategory.values.push({
              GoalName: obj.GoalName,
              AssignLevel: { name: obj.AssignLevel, code: obj.AssignLevel },
              Role: { name: obj.Role, code: obj.Role },
              ID: obj.ID,
              isRowEdit: false,
            });
          } else {
            acc.push({
              GoalCategory: obj.GoalCategory,
              mainID: ID++,
              values: [
                {
                  GoalName: obj.GoalName,
                  AssignLevel: { name: obj.AssignLevel, code: obj.AssignLevel },
                  Role: { name: obj.Role, code: obj.Role },
                  ID: obj.ID,
                  isRowEdit: false,
                },
              ],
            });
          }
          return acc;
        }, []);
        console.log(groupedArray);
        res.forEach((obj) => {
          let json = {
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            AssignLevel: obj.AssignLevel
              ? { name: obj.AssignLevel, code: obj.AssignLevel }
              : { name: "", code: "" },
            Role: obj.Role
              ? { name: obj.Role, code: obj.Role }
              : { name: "", code: "" },
            isRowEdit: false,
          };
          tempArr.push(json);
        });
        let tempaArray = [...tempArr];
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
            { name: "Common", code: "Common" },
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
            },
          ],
        });
      }
      return acc;
    }, []);
    console.log(groupedArray);
    setCategories([...groupedArray]);
  };

  const addNewCategory = () => {
    // setCategories([...categories, ...newCategory]);
    duplicateData.push({
      ID: Math.max(...duplicateData.map((o) => o.ID)) + 1,
      GoalCategory: newCategory,
      GoalName: "",
      AssignLevel: { name: "", code: "" },
      Role: { name: "", code: "" },
      isRowEdit: false,
    });
    categoryHandleFun([...duplicateData]), setIsAddCategory(false);
    setNewCategory("");
  };

  const addGoalFunction = (ind: number) => {
    let tempArr = categories;
    let index = [...tempArr].findIndex((obj) => obj.mainID == ind + 1);
    let data = tempArr[index];
    // data.values.push({
    //   ID: Math.max(...masterData.map((o) => o.ID)) + 1,
    //   AssignLevel: { name: "", code: "" },
    //   Role: { name: "", code: "" },
    //   GoalName: "",
    //   isRowEdit: false,
    // });
    setDuplicateData([
      ...duplicateData,
      {
        ID: Math.max(...masterData.map((o) => o.ID)) + 1,
        AssignLevel: { name: "", code: "" },
        Role: { name: "", code: "" },
        GoalName: "",
        isRowEdit: true,
        GoalCategory: data.GoalCategory,
      },
    ]);
    // duplicateData.push({
    //   ID: Math.max(...masterData.map((o) => o.ID)) + 1,
    //   AssignLevel: { name: "", code: "" },
    //   Role: { name: "", code: "" },
    //   GoalName: "",
    //   isRowEdit: false,
    //   GoalCategory: data.GoalCategory,
    // });
    categoryHandleFun([
      ...duplicateData,
      {
        ID: Math.max(...masterData.map((o) => o.ID)) + 1,
        AssignLevel: { name: "", code: "" },
        Role: { name: "", code: "" },
        GoalName: "",
        isRowEdit: true,
        GoalCategory: data.GoalCategory,
      },
    ]);

    // data.values.push({
    //   ID: Math.max(...masterData.map((o) => o.ID)) + 1,
    //   AssignLevel: { name: "", code: "" },
    //   Role: { name: "", code: "" },
    //   GoalName: "",
    //   isRowEdit: false,
    // });
    console.log(data);
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
    categoryHandleFun([...duplicateArr]);
    setDuplicateData([...duplicateArr]);
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
          if (value.name == "Common") {
            obj.Role = [{ name: "", code: "" }];
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
      <div>{rowData.GoalName}</div>
    );
  };

  const AssignLevelBodyTemplate = (rowData: any) => {
    // return <div>{rowData.AssignLevel}</div>;
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
      <div>{rowData.AssignLevel.name}</div>
    );
  };

  const RoleBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      rowData.AssignLevel.name == "Role" ? (
        <Dropdown
          value={rowData.Role}
          onChange={(e) => onChangeHandleFun(e.value, "Role", rowData.ID)}
          options={rolesList}
          optionLabel="name"
          placeholder="Select a Role"
          className="w-full md:w-14rem"
        />
      ) : (
        <div></div>
      )
    ) : (
      <div>{rowData.Role.name}</div>
    );
  };
  const ActionBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <div>
        <IoMdCheckmark className={styles.submitIcon} />
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
      </div>
    );
  };

  useEffect(() => {
    getUsersRoles();
  }, []);

  return (
    <div className="">
      <div className={styles.addCategory}>
        {isAddCategory ? (
          <div>
            <InputText
              value={newCategory}
              id="category"
              type="text"
              placeholder="Category"
              onChange={(e) => {
                setNewCategory(e.target.value);
              }}
            />
            <Button label="Submit" onClick={(e) => addNewCategory()} />
          </div>
        ) : (
          <Button
            label="New Category"
            onClick={(e) => setIsAddCategory(true)}
          />
        )}
      </div>
      <Accordion>
        {categories.map((data, index) => {
          return (
            <AccordionTab
              className={styles.accordionMain}
              header={
                <span className="flex d-flex justify-content-between align-items-center gap-2 w-full">
                  {/* <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" /> */}
                  <span className="">{data.GoalCategory}</span>
                  <span className="font-bold addIconSec">
                    <VscAdd
                      className={styles.addIcon}
                      onClick={() => addGoalFunction(index)}
                    />
                    <HiPencil className={styles.editIcon} />
                  </span>
                  {/* <Badge value="3" className="ml-auto" /> */}
                </span>
              }
            >
              <div className="NestedTable22">
                <DataTable
                  value={data.values}
                  size="normal"
                  // stripedRows
                  tableStyle={{ minWidth: "30rem" }}
                >
                  <Column
                    field="GoalName"
                    header="Goal Name"
                    body={GoalnameBodyTemplate}
                  ></Column>
                  <Column
                    field="AssignLevel"
                    header="Assign Level"
                    body={AssignLevelBodyTemplate}
                  ></Column>
                  <Column
                    field="Role"
                    header="Role"
                    body={RoleBodyTemplate}
                  ></Column>
                  <Column header="Action" body={ActionBodyTemplate}></Column>
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
