/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises*/
import { LISTNAMES } from "../../config/config";
import SpServices from "../SpServices/SpServices";

export const getAppraisalCycles = (setAppraisalCycleState: any): void => {
  SpServices.SPReadItems({
    Listname: LISTNAMES.AppraisalCycles,
    Select: "*",
  })
    .then((cycle) => {
      const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
      cycle.reverse();
      for (let i = 0; i < cycle.length; i++) {
        const sDate = new Date(cycle[i].startDate).setHours(0, 0, 0, 0);
        const eDate = new Date(cycle[i].endDate).setHours(0, 0, 0, 0);
        const goalsSDate = new Date(cycle[i].goalsSubmitSDate).setHours(
          0,
          0,
          0,
          0
        );
        const goalsEDate = new Date(cycle[i].goalsSubmitEDate).setHours(
          0,
          0,
          0,
          0
        );
        if (
          currentDate >= new Date(goalsSDate) &&
          currentDate <= new Date(goalsEDate)
        ) {
          setAppraisalCycleState((prev: any) => ({
            ...prev,
            currentCycleId: cycle[i].ID,
            goalSubmit: true,
          }));
          break;
        } else {
          if (
            currentDate >= new Date(sDate) &&
            currentDate <= new Date(eDate)
          ) {
            setAppraisalCycleState((prev: any) => ({
              ...prev,
              currentCycleId: cycle[i].ID,
              goalSubmit: false,
            }));
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAllHRGoals = (
  ACId: number,
  setDeletedGoals: any,
  setCategories: any,
  setDuplicateData: any,
  setMasterData: any
): any => {
  SpServices.SPReadItems({
    Listname: LISTNAMES.HrGoals,
    Select: "*",
    Filter: [
      {
        FilterKey: "AppraisalCycleLookupId",
        Operator: "eq",
        FilterValue: ACId,
      },
    ],
  })
    .then((res: any) => {
      const tempArr: any = [];
      let ID = 1;
      const deletedGoals = res.filter((del: any) => del.isDelete);
      const assignedGoals = res.filter((del: any) => !del.isDelete);
      const groupedArray = assignedGoals.reduce((acc: any, obj: any) => {
        const existingCategory = acc.find(
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
      assignedGoals.forEach((obj: any) => {
        const json = {
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
      const tempArray = [...tempArr];
      setDeletedGoals([...deletedGoals]);
      setCategories([...groupedArray]);
      setDuplicateData(tempArray);
      setMasterData(tempArray);
      //   getPredefinedGoals(ACId);
    })
    .catch((err) => console.log(err));
};

export const getAllPredefinedGoals = (
  ACId: number,
  setPredefinedGoals: any,
  setIsLoader: any
): any => {
  setIsLoader(true);
  SpServices.SPReadItems({
    Listname: LISTNAMES.PredefinedGoals,
    Select: "*,AssignTo/ID,AssignTo/Title,AssignTo/EMail,HRGoal/ID",
    Expand: "AssignTo,HRGoal",
    Filter: [
      {
        FilterKey: "AppraisalCycleLookupId",
        Operator: "eq",
        FilterValue: ACId,
      },
    ],
  })
    .then((res) => {
      const tempArr: any = [];
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
      setIsLoader(false);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const HRCategoryDelete = (
  duplicateData: any,
  categories: any,
  predefinedGoalsList: any,
  popupData: any,
  setIsPopup: any,
  setMasterData: any,
  setDuplicateData: any,
  categoryHandleFun: any,
  callBackDatas: any
): any => {
  const tempCategoryArr = [...categories];
  const index = tempCategoryArr.findIndex(
    (ind) => ind.mainID === popupData.delIndex + 1
  );
  const tempObj = tempCategoryArr[index];
  const categoryGoalsArr = tempObj.values;
  categoryGoalsArr.forEach((obj: any, index: number) => {
    setIsPopup((prev: any) => ({
      ...prev,
      delIndex: null,
      delPopup: false,
    }));
    SpServices.SPUpdateItem({
      Listname: LISTNAMES.HrGoals,
      ID: obj.ID,
      RequestJSON: { isDelete: true },
    });
  });
  const resultArray = predefinedGoalsList.filter((goal: any) =>
    categoryGoalsArr.some((category: any) => category.ID === goal.HRGoalId)
  );
  resultArray.forEach((goal: any, index: number) => {
    SpServices.SPUpdateItem({
      Listname: LISTNAMES.PredefinedGoals,
      ID: goal.ID,
      RequestJSON: { isDeleteHR: true },
    })
      .then((res: any) => {
        console.log(res);
        if (resultArray.length - 1 === index) {
          callBackDatas();
        }
      })
      .catch((err: any) => console.log(err));
  });
};

export const HRgoalsDelete = async (
  duplicateData: any[],
  predefinedGoalsList: any[],
  goalDelPopup: any,
  setDeletedGoals: any,
  setGoalDelPopup: any,
  callBackDatas: any
): Promise<any[]> => {
  const duplicateArr = [...duplicateData];
  const index = [...duplicateArr].findIndex(
    (obj) => obj.ID === goalDelPopup.delGoalId
  );
  const delObj = duplicateArr[index];
  setDeletedGoals((prev: any) => ({
    ...prev,
    delObj,
  }));
  // setDeletedGoals([...deletedGoals, delObj]);
  const delArray = duplicateArr.filter(
    (items) => items.ID !== goalDelPopup.delGoalId
  );
  await SpServices.SPUpdateItem({
    Listname: LISTNAMES.HrGoals,
    ID: delObj.ID,
    RequestJSON: { isDelete: true },
  })
    .then((res: any) => {
      setGoalDelPopup({
        ...goalDelPopup,
        delPopup: false,
        delGoalId: null,
      });
    })
    .catch((err: any) => console.log(err));

  predefinedGoalsList.forEach((goal: any, index: number) => {
    if (goal.HRGoalId === delObj.ID) {
      SpServices.SPUpdateItem({
        Listname: LISTNAMES.PredefinedGoals,
        ID: goal.ID,
        RequestJSON: { isDelete: true },
      });
    }
    if (predefinedGoalsList.length - 1 === index) {
      setTimeout(() => {
        callBackDatas();
      }, 3000);
    }
  });
  return delArray;
};
export const newHRCategoryAndGoalAdd = async (
  tempObj: any,
  usersList: any[],
  appraisalCycleId: any,
  callBackDatas: any,
  setToastMessage: any
) => {
  SpServices.SPAddItem({
    Listname: LISTNAMES.HrGoals,
    RequestJSON: {
      AssignLevel: tempObj.AssignLevel.name,
      Role: tempObj.Role
        ? { results: tempObj.Role.map((role: any) => role.name) }
        : { results: [""] },
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
      AppraisalCycleLookupId: appraisalCycleId.currentCycleId,
      isDelete: false,
    },
  })
    .then((res: any) => {
      if (tempObj.AssignLevel.name === "Organization") {
        usersList.forEach((user: any, index: number) => {
          SpServices.SPAddItem({
            Listname: LISTNAMES.PredefinedGoals,
            RequestJSON: {
              GoalName: tempObj.GoalName,
              GoalCategory: tempObj.GoalCategory,
              AssignToId: null,
              AssignToEmail: user.UserEmail,
              HRGoalId: res.data.ID,
              AppraisalCycleLookupId: appraisalCycleId.currentCycleId,
            },
          })
            .then((res: any) => {
              if (usersList.length - 1 === index) {
                setToastMessage({
                  isShow: true,
                  severity: "success",
                  title: "Success!",
                  message: "New category and goal added successfully.",
                  duration: 3000,
                });
                setTimeout(() => {
                  callBackDatas();
                }, 3000);
              }
            })
            .catch((err: any) => console.log(err));
        });
      } else {
        const selectedRoles = tempObj.Role.map((item: any) => item.name);
        const selectedUserListArray = usersList.filter((item) =>
          selectedRoles.includes(item.Role)
        );
        selectedUserListArray.forEach((user: any, index: number) => {
          debugger;
          SpServices.SPAddItem({
            Listname: LISTNAMES.PredefinedGoals,
            RequestJSON: {
              GoalName: tempObj.GoalName,
              GoalCategory: tempObj.GoalCategory,
              AssignToId: null,
              AssignToEmail: user.UserEmail,
              HRGoalId: res.data.ID,
              AppraisalCycleLookupId: appraisalCycleId.currentCycleId,
            },
          })
            .then((res: any) => {
              console.log(res);
              if (selectedUserListArray.length - 1 === index) {
                callBackDatas();
              }
            })
            .catch((err: any) => console.log(err));
        });
      }
    })
    .catch((err: any) => console.log(err));
};

export const updateGoalRolesToOrganization = async (
  tempObj: any,
  predefinedGoalsList: any,
  usersList: any[],
  appraisalCycleId: any,
  callBackDatas: any
) => {
  const allEmailIDs = new Set(
    predefinedGoalsList.map((item: any) => {
      if (item.HRGoalId === tempObj.ID) {
        // if (item.isDeleteHR) {
        //   permissionDeleted.push(`${item.AssignTo.EMail}`);
        // }
        return `${item.AssignTo.EMail}`;
      }
    })
  );
  const getUserDetails = usersList.filter(
    (item) => !allEmailIDs.has(`${item.UserEmail}`)
  );
  if (getUserDetails.length > 0) {
    getUserDetails.forEach((user: any) => {
      SpServices.SPAddItem({
        Listname: LISTNAMES.PredefinedGoals,
        RequestJSON: {
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          AssignToId: user.EmployeeID,
          HRGoalId: tempObj.ID,
          AppraisalCycleLookupId: appraisalCycleId.currentCycleId,
        },
      });
    });
    const givePermissionToUsers = predefinedGoalsList.filter((goal: any) =>
      usersList.some(
        (user: any) =>
          goal.HRGoalId === tempObj.ID &&
          goal.AssignTo.EMail === user.UserEmail &&
          goal.isDeleteHR
      )
    );
    if (givePermissionToUsers.length > 0) {
      givePermissionToUsers.forEach((goal: any, goalIdx: number) => {
        SpServices.SPUpdateItem({
          Listname: LISTNAMES.PredefinedGoals,
          ID: goal.ID,
          RequestJSON: { GoalName: tempObj.GoalName, isDeleteHR: false },
        })
          .then((res: any) => {
            console.log(res);
            if (givePermissionToUsers.length - 1 === goalIdx) {
              callBackDatas();
            }
          })
          .catch((err: any) => console.log(err));
      });
    } else {
      callBackDatas();
    }
  } else {
    predefinedGoalsList.forEach((goal: any, goalIdx: number) => {
      if (goal.HRGoalId === tempObj.ID) {
        SpServices.SPUpdateItem({
          Listname: LISTNAMES.PredefinedGoals,
          ID: goal.ID,
          RequestJSON: { GoalName: tempObj.GoalName, isDeleteHR: false },
        });
      }
      if (predefinedGoalsList.length - 1 === goalIdx) {
        setTimeout(() => {
          callBackDatas();
        }, 3000);
      }
    });
  }
};

export const updateGoalRoles = async (
  masterObj: any,
  tempObj: any,
  predefinedGoalsList: any,
  usersList: any[],
  appraisalCycleId: any,
  callBackDatas: any,
  setToastMessage: any
) => {
  let resultArray: any = [];
  const allEmailIDs = new Set(
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

  const commonRoles = tempObj.Role.filter((item1: any) =>
    resultArray.some(
      (item2: any) => item1.code === item2.code && item1.name === item2.name
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
    const selectedRoles = commonRoles.map((item: any) => item.name);
    const userListArray = usersList.filter((item) =>
      selectedRoles.includes(item.Role)
    );
    userListArray.forEach((user: any, userIdx: number) => {
      predefinedGoalsList.forEach((goal: any, goalIdx: number) => {
        if (
          goal.AssignTo.EMail === user.UserEmail &&
          goal.HRGoalId === tempObj.ID
        ) {
          SpServices.SPUpdateItem({
            Listname: LISTNAMES.PredefinedGoals,
            ID: goal.ID,
            RequestJSON: { GoalName: tempObj.GoalName, isDeleteHR: false },
          });
          //   sp.web.lists
          //     .getByTitle(`PredefinedGoals`)
          //     .items.getById(goal.ID)
          //     .update({ GoalName: tempObj.GoalName, isDeleteHR: false })
          //     .then((res) => console.log(res))
          //     .catch((err) => console.log(err));
        }
        if (
          userListArray.length - 1 === userIdx &&
          predefinedGoalsList.length - 1 === goalIdx &&
          removeUser.length === 0 &&
          updateUser.length === 0
        ) {
          setToastMessage({
            isShow: true,
            severity: "success",
            title: "Update goal!",
            message: "Category and goal updated successfully.",
            duration: 3000,
          });
          setTimeout(() => {
            callBackDatas();
          }, 3000);
        }
      });
    });
  }
  if (removeUser.length > 0) {
    const selectedRoles = removeUser.map((item: any) => item.name);
    const userListArray = usersList.filter((item) =>
      selectedRoles.includes(item.Role)
    );
    const lookUpGoalsList: any = [];
    predefinedGoalsList.filter((goals: any) => {
      userListArray.forEach((user) => {
        if (
          goals.AssignTo.EMail === user.UserEmail &&
          goals.HRGoalId === tempObj.ID
        ) {
          lookUpGoalsList.push(goals);
        }
      });
    });
    const givePermissionToUsers = predefinedGoalsList.filter((goal: any) =>
      userListArray.some(
        (user: any) =>
          goal.HRGoalId === tempObj.ID && goal.AssignTo.EMail === user.UserEmail
      )
    );
    console.log(lookUpGoalsList, givePermissionToUsers);

    lookUpGoalsList.forEach((goal: any, goalIdx: number) => {
      SpServices.SPUpdateItem({
        Listname: LISTNAMES.PredefinedGoals,
        ID: goal.ID,
        RequestJSON: { isDeleteHR: true },
      });
      if (lookUpGoalsList.length - 1 === goalIdx && updateUser.length === 0) {
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Update goal!",
          message: "Category and goal updated successfully.",
          duration: 3000,
        });
        setTimeout(() => {
          callBackDatas();
        }, 3000);
      }
      //   sp.web.lists
      //     .getByTitle(`PredefinedGoals`)
      //     .items.getById(goal.ID)
      //     .update({ isDeleteHR: true })
      //     .then((res) => console.log(res))
      //     .catch((err) => console.log(err));
    });
  }
  if (updateUser.length > 0 && masterObj.Role.length > 0) {
    const selectedRoles = updateUser.map((item: any) => item.name);
    const userListArray = usersList.filter((item) =>
      selectedRoles.includes(item.Role)
    );
    const array2Emails = new Set(
      predefinedGoalsList.map(
        (item: any) => `${item.AssignTo.EMail}-${item.HRGoalId}`
      )
    );

    const filteredArray1 = userListArray.filter(
      (item) => !array2Emails.has(`${item.UserEmail}-${tempObj.ID}`)
    );

    filteredArray1.forEach((filter: any, index: number) => {
      SpServices.SPAddItem({
        Listname: LISTNAMES.PredefinedGoals,
        RequestJSON: {
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          AssignToId: filter.EmployeeID,
          HRGoalId: tempObj.ID,
          AppraisalCycleLookupId: appraisalCycleId.currentCycleId,
        },
      });
      if (filteredArray1.length - 1 === index) {
        setToastMessage({
          isShow: true,
          severity: "success",
          title: "Update goal!",
          message: "Category and goal updated successfully.",
          duration: 3000,
        });
        setTimeout(() => {
          callBackDatas();
        }, 3000);
      }
    });
    userListArray.forEach((user: any, userIdx: number) => {
      predefinedGoalsList.forEach((goal: any, goalIdx: number) => {
        if (
          goal.AssignTo.EMail === user.UserEmail &&
          goal.HRGoalId === tempObj.ID
        ) {
          SpServices.SPUpdateItem({
            Listname: LISTNAMES.PredefinedGoals,
            ID: goal.ID,
            RequestJSON: { GoalName: tempObj.GoalName, isDeleteHR: false },
          });
        }
        if (
          userListArray.length - 1 === userIdx &&
          predefinedGoalsList.length - 1 === goalIdx
        ) {
          setToastMessage({
            isShow: true,
            severity: "success",
            title: "Update goal!",
            message: "Category and goal updated successfully.",
            duration: 3000,
          });
          setTimeout(() => {
            callBackDatas();
          }, 3000);
        }
      });
    });
  } else {
    const selectedRoles = updateUser.map((item: any) => item.name);
    const userListArray = usersList.filter((item) =>
      selectedRoles.includes(item.Role)
    );
    userListArray.forEach((user: any, userIdx: number) => {
      predefinedGoalsList.forEach((goal: any, goalIdx: number) => {
        if (
          goal.AssignTo.EMail === user.UserEmail &&
          goal.HRGoalId === tempObj.ID
        ) {
          SpServices.SPUpdateItem({
            Listname: LISTNAMES.PredefinedGoals,
            ID: goal.ID,
            RequestJSON: {
              GoalName: tempObj.GoalName,
              isDeleteHR: false,
            },
          });
        }
        if (
          userListArray.length - 1 === userIdx &&
          predefinedGoalsList.length - 1 === goalIdx
        ) {
          setTimeout(() => {
            setToastMessage({
              isShow: true,
              severity: "success",
              title: "Update goal!",
              message: "Category and goal updated successfully.",
              duration: 3000,
            });
            callBackDatas();
          }, 3000);
        }
      });
    });
  }
  //   callBackDatas();
};
