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
import { InputTextarea } from "primereact/inputtextarea";
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
  const [predefinedGoalsList, setPredefinedGoals] = useState<any[]>([]);
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
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [appraisalCycleId, setAppraisalCycleId] = useState(null);

  console.log(
    usersList,
    categories,
    masterData,
    duplicateData,
    predefinedGoalsList,
    appraisalCycleId
  );

  const getPredefinedGoals = (ACId: number) => {
    sp.web.lists
      .getByTitle(`PredefinedGoals`)
      .items.select("*,AssignTo/ID,AssignTo/Title,AssignTo/EMail,HRGoal/ID")
      .expand("AssignTo,HRGoal")
      .filter(`AppraisalCycleLookupId eq '${ACId}'`)
      .get()
      .then((res) => {
        console.log(res);
        let tempArr: any = [];
        res.forEach((obj) => {
          tempArr.push({
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            AssignTo: obj.AssignTo ? obj.AssignTo : {},
            isDeleteHR: obj.isDeleteHR ? obj.isDeleteHR : false,
            HRGoalId: obj.HRGoal ? obj.HRGoal.ID : "",
          });
        });
        setPredefinedGoals([...tempArr]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHRGoals = (ACId: number) => {
    sp.web.lists
      .getByTitle(`HrGoals`)
      .items.filter(`AppraisalCycleLookupId eq '${ACId}'`)
      .get()
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
        getPredefinedGoals(ACId);
      })
      .catch((err) => console.log(err));
  };

  const getCycleYear = () => {
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.get()
      .then((res) => {
        console.log(res);
        res.forEach((obj) => {
          if (
            new Date() >= new Date(obj.startDate) &&
            new Date() <= new Date(obj.endDate)
          ) {
            setAppraisalCycleId(obj.ID);
            getHRGoals(obj.ID);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
            if (!rolesSet.has(data.Roles) && data.Roles !== "Admin") {
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
            EmployeeID: number;
          }[] = [];
          res.forEach((obj) => {
            console.log(obj);

            userArr.push({
              EmployeeName: obj.Employee.Title,
              UserEmail: obj.Employee.EMail,
              Role: obj.Roles,
              EmployeeID: obj.Employee.ID,
            });
          });
          setUsersList([...userArr]);
          getCycleYear();

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
        setActiveIndex(categories.length);
      } else {
        alert("please enter category");
      }
    } else {
      let index = tempCategoryArr.findIndex(
        (ind) => ind.mainID === categoryHandleObj.ID
      );
      let tempObj = tempCategoryArr[index];
      if (tempObj.GoalCategory != categoryHandleObj.newCategory) {
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
        categoryGolasArr.forEach((cat: any) => {
          predefinedGoalsList.forEach((goal) => {
            if (cat.ID === goal.HRGoalId) {
              sp.web.lists
                .getByTitle(`PredefinedGoals`)
                .items.getById(goal.ID)
                .update({ GoalCategory: categoryHandleObj.newCategory })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            }
          });
        });
      }
      console.log(tempObj);
      getUsersRoles();
    }
  };

  const addGoalFunction = (ind: number) => {
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
  };

  const editCategoryFun = (ind: number) => {
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
    let categoryGoalsArr = tempObj.values;
    categoryGoalsArr.forEach((obj: any) => {
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
    categoryGoalsArr.forEach((cat: any) => {
      predefinedGoalsList.forEach((goal) => {
        if (cat.ID === goal.HRGoalId) {
          sp.web.lists
            .getByTitle(`PredefinedGoals`)
            .items.getById(goal.ID)
            .update({ isDeleteHR: true })
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
        }
      });
    });
    getUsersRoles();
  };

  const editRowFunction = (data: any) => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
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
          AppraisalCycleLookupId: appraisalCycleId,
          isDelete: false,
        })
        .then((res) => {
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
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);

          if (tempObj.AssignLevel.name === "Organization") {
            usersList.forEach((user) => {
              sp.web.lists
                .getByTitle(`PredefinedGoals`)
                .items.add({
                  GoalName: tempObj.GoalName,
                  GoalCategory: tempObj.GoalCategory,
                  AssignToId: user.EmployeeID,
                  HRGoalId: res.data.ID,
                  AppraisalCycleLookupId: appraisalCycleId,
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            });
            getUsersRoles();
          } else {
            let selectedRoles = tempObj.Role.map((item: any) => item.name);
            const userListArray = usersList.filter((item) =>
              selectedRoles.includes(item.Role)
            );
            userListArray.forEach((user) => {
              sp.web.lists
                .getByTitle(`PredefinedGoals`)
                .items.add({
                  GoalName: tempObj.GoalName,
                  GoalCategory: tempObj.GoalCategory,
                  AssignToId: user.EmployeeID,
                  HRGoalId: res.data.ID,
                  AppraisalCycleLookupId: appraisalCycleId,
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            });
            getUsersRoles();
          }
        })
        .catch((err) => console.log(err));
    } else {
      let duplicateArr = [...duplicateData];
      let masterArr = [...masterData];
      let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
      let tempObj = duplicateArr[index];
      let masterObj = masterArr[index];
      let permissionDeleted: any = [];
      if (tempObj.AssignLevel.name === "Organization") {
        const allEmailIDs = new Set(
          predefinedGoalsList.map((item) => {
            if (item.HRGoalId === tempObj.ID) {
              item.isDeleteHR
                ? permissionDeleted.push(`${item.AssignTo.EMail}`)
                : "";
              return `${item.AssignTo.EMail}`;
            }
          })
        );
        console.log(permissionDeleted);

        const getUserDetails = usersList.filter(
          (item) => !allEmailIDs.has(`${item.UserEmail}`)
        );
        if (getUserDetails.length > 0) {
          getUserDetails.forEach((user) => {
            sp.web.lists
              .getByTitle(`PredefinedGoals`)
              .items.add({
                GoalName: tempObj.GoalName,
                GoalCategory: tempObj.GoalCategory,
                AssignToId: user.EmployeeID,
                HRGoalId: tempObj.ID,
                AppraisalCycleLookupId: appraisalCycleId,
              })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
          });
          usersList.forEach((user) => {
            predefinedGoalsList.forEach((goal) => {
              if (
                goal.HRGoalId === tempObj.ID &&
                goal.AssignTo.EMail === user.UserEmail
              ) {
                sp.web.lists
                  .getByTitle(`PredefinedGoals`)
                  .items.getById(goal.ID)
                  .update({ GoalName: tempObj.GoalName, isDeleteHR: false })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
              }
            });
          });
          getUsersRoles();
        } else {
          predefinedGoalsList.forEach((goal: any) => {
            if (goal.HRGoalId === tempObj.ID) {
              sp.web.lists
                .getByTitle(`PredefinedGoals`)
                .items.getById(goal.ID)
                .update({ GoalName: tempObj.GoalName, isDeleteHR: false })
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
            }
          });
          getUsersRoles();
        }
      } else {
        let resultArray: any = [];
        let allEmailIDs = new Set(
          predefinedGoalsList.map((item: any) => {
            if (item.HRGoalId === tempObj.ID && item.isDeleteHR !== true) {
              return item.AssignTo.EMail;
            }
          })
        );
        const getUserEmailIDs = usersList.filter((item) =>
          allEmailIDs.has(item.mailID)
        );
        const uniqueRoles = Array.from(
          new Set(getUserEmailIDs.map((item) => item.Role))
        );
        if (masterObj.Role.length > 0) {
          resultArray = masterObj.Role;
        } else {
          resultArray = uniqueRoles.map((role) => ({
            name: role,
            code: role,
          }));
        }

        let commonRoles = tempObj.Role.filter((item1: any) =>
          resultArray.some(
            (item2: any) =>
              item1.code === item2.code && item1.name === item2.name
          )
        );
        const updateUser: any = tempObj.Role.filter(
          (item: any) =>
            !commonRoles.some(
              (commonItem: any) =>
                item.code === commonItem.code && item.name === commonItem.name
            )
        );
        const removeUser: any = resultArray.filter(
          (item: any) =>
            !commonRoles.some(
              (commonItem: any) =>
                item.code === commonItem.code && item.name === commonItem.name
            )
        );
        if (commonRoles.length > 0 && tempObj.GoalName !== masterObj.GoalName) {
          let selectedRoles = commonRoles.map((item: any) => item.name);
          const userListArray = usersList.filter((item) =>
            selectedRoles.includes(item.Role)
          );
          userListArray.forEach((user) => {
            predefinedGoalsList.forEach((goal: any) => {
              if (
                goal.AssignTo.EMail === user.UserEmail &&
                goal.HRGoalId === tempObj.ID
              ) {
                sp.web.lists
                  .getByTitle(`PredefinedGoals`)
                  .items.getById(goal.ID)
                  .update({ GoalName: tempObj.GoalName, isDeleteHR: false })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
              }
            });
          });
        }
        if (removeUser.length > 0) {
          let selectedRoles = removeUser.map((item: any) => item.name);
          const userListArray = usersList.filter((item) =>
            selectedRoles.includes(item.Role)
          );
          let lookUpGoalsList: any = [];
          predefinedGoalsList.filter((goals) => {
            userListArray.forEach((user) => {
              if (
                goals.AssignTo.EMail === user.UserEmail &&
                goals.HRGoalId === tempObj.ID
              ) {
                lookUpGoalsList.push(goals);
              }
            });
          });
          lookUpGoalsList.forEach((goal: any) => {
            sp.web.lists
              .getByTitle(`PredefinedGoals`)
              .items.getById(goal.ID)
              .update({ isDeleteHR: true })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
          });
        }
        if (updateUser.length > 0 && masterObj.Role.length > 0) {
          let selectedRoles = updateUser.map((item: any) => item.name);
          const userListArray = usersList.filter((item) =>
            selectedRoles.includes(item.Role)
          );
          const array2Emails = new Set(
            predefinedGoalsList.map(
              (item) => `${item.AssignTo.EMail}-${item.HRGoalId}`
            )
          );

          const filteredArray1 = userListArray.filter(
            (item) => !array2Emails.has(`${item.UserEmail}-${tempObj.ID}`)
          );

          filteredArray1.forEach((filter) => {
            sp.web.lists
              .getByTitle(`PredefinedGoals`)
              .items.add({
                GoalName: tempObj.GoalName,
                GoalCategory: tempObj.GoalCategory,
                AssignToId: filter.EmployeeID,
                HRGoalId: tempObj.ID,
                AppraisalCycleLookupId: appraisalCycleId,
              })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
          });
          userListArray.forEach((user) => {
            predefinedGoalsList.forEach((goal: any) => {
              if (
                goal.AssignTo.EMail === user.UserEmail &&
                goal.HRGoalId === tempObj.ID
              ) {
                sp.web.lists
                  .getByTitle(`PredefinedGoals`)
                  .items.getById(goal.ID)
                  .update({ GoalName: tempObj.GoalName, isDeleteHR: false })
                  .then((res) => console.log(res))
                  .catch((err) => console.log(err));
              }
            });
          });
        }
        getUsersRoles;
      }
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

  const goalDeleteFun = (data: any) => {
    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let delObj = duplicateData[index];
    setDeletedGoals([...deletedGoals, delObj]);
    let delArray = duplicateData.filter((items) => items.ID != data.ID);
    sp.web.lists
      .getByTitle(`HrGoals`)
      .items.getById(delObj.ID)
      .update({ isDelete: true })
      .then((res) => {
        categoryHandleFun([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
      })
      .catch((err) => console.log(err));

    predefinedGoalsList.forEach((goal) => {
      if (goal.HRGoalId === delObj.ID) {
        sp.web.lists
          .getByTitle(`PredefinedGoals`)
          .items.getById(goal.ID)
          .update({ isDeleteHR: true })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
    });
    getUsersRoles();
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
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
        <InputTextarea
          value={rowData.GoalName}
          rows={2}
          cols={30}
          onChange={(e) =>
            onChangeHandleFun(e.target.value, "GoalName", rowData.ID)
          }
        />
      ) : (
        <div
          style={{
            fontFamily: "Roboto, Arial, Helvetica, sans-serif",
            color: "#64728c",
            fontSize: "13px",
            width: "100%",
          }}
        >
          {rowData.GoalName}
        </div>
      )
    ) : (
      <div
        style={{
          fontFamily: "Roboto, Arial, Helvetica, sans-serif",
          color: "#64728c",
          fontSize: "13px",
          width: "100%",
        }}
      >
        {rowData.GoalName}
      </div>
    );
  };

  const AssignLevelBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
        <Dropdown
          value={rowData.AssignLevel}
          style={{
            padding: "0",
          }}
          onChange={(e) =>
            onChangeHandleFun(e.value, "AssignLevel", rowData.ID)
          }
          options={assignLevelList}
          optionLabel="name"
          placeholder="Select a Role"
          className="w-full md:w-14rem tblMultiSelect"
        />
      ) : (
        <div
          style={{
            fontFamily: "Roboto, Arial, Helvetica, sans-serif",
            color: "#64728c",
            fontSize: "13px",
            width: "100%",
          }}
        >
          {rowData.AssignLevel.name === "Organization" ? (
            <GiOrganigram className="roleIcon" />
          ) : (
            <PiUserFocusDuotone className="roleIcon" />
          )}
          {rowData.AssignLevel.name}
        </div>
      )
    ) : (
      <div
        style={{
          fontFamily: "Roboto, Arial, Helvetica, sans-serif",
          color: "#64728c",
          fontSize: "13px",
          width: "100%",
        }}
      >
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
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      rowData.AssignLevel.name == "Role" && duplicateData[index].isRowEdit ? (
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
      ) : rowData.AssignLevel.name == "Role" ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "10px",
          }}
        >
          {rowData.Role.map((role: any) => (
            <p
              style={{
                fontFamily: `Roboto, Arial, Helvetica, sans-serif`,
                color: `rgb(100, 114, 140)`,
                fontSize: ` 12px`,
                background: `#eee`,
                margin: `0px`,
                padding: `2px 10px`,
                borderRadius: ` 30px`,
                textAlign: `center`,
              }}
            >
              {role.name}
            </p>
          ))}
        </div>
      ) : (
        <div></div>
      )
    ) : (
      <div>
        {rowData.Role.map((role: any) => (
          <p
            style={{
              fontFamily: "Roboto, Arial, Helvetica, sans-serif",
              color: "#64728c",
              fontSize: "13px",
              width: "100%",
              margin: "0px",
            }}
          >
            {role.name}
          </p>
        ))}
      </div>
    );
  };
  const ActionBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
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
      )
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
    <div className={styles.background}>
      <div className="addCategory">
        <span className="span">Goals</span>
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
                // className="addCategory"
                label="Add"
                severity="success"
                onClick={(e) => addNewCategory(true)}
              />
            )}

            <Button
              label="Cancel"
              severity="danger"
              text
              className="cancelBtn"
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
      <div className="hrGoals">
        <Accordion
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
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
                              onClick={() =>
                                setIsPopup({
                                  ...isPopup,
                                  delPopup: false,
                                })
                              }
                              text
                              icon="pi pi-times"
                              label="cancel"
                            ></Button>
                          </div>
                        </Dialog>
                      )}
                      {data.values.filter((val: any) => val.isNew).length ===
                      0 ? (
                        <GrAdd
                          className="addIcon"
                          onClick={(event) => {
                            if (activeIndex === index) {
                              event.stopPropagation();
                            } else {
                              setActiveIndex(index);
                            }
                            addGoalFunction(index);
                          }}
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
                        className="deleteIcon"
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
                      style={{ width: "35%" }}
                      body={RoleBodyTemplate}
                    ></Column>
                    <Column
                      className="col4"
                      header="Action"
                      style={{ width: "10%" }}
                      body={ActionBodyTemplate}
                    ></Column>
                  </DataTable>
                </div>
              </AccordionTab>
            );
          })}
        </Accordion>
      </div>
      {categories.length > 0 ? (
        <div></div>
      ) : (
        <div>
          <div className="noDataMsg">No Data Found</div>
        </div>
      )}

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
