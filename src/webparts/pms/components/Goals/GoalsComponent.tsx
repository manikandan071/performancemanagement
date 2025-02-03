/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp/presets/all";
import * as moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
// import { Toast } from "primereact/toast";
// import { HiPencil } from "react-icons/hi2";
import { MdEditDocument } from "react-icons/md";
import { BiSolidEdit } from "react-icons/bi";
import { AddSquare28Regular } from "@fluentui/react-icons";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
// import { GrAdd } from "react-icons/gr";
// import { BiMessageSquareAdd } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { GiOrganigram } from "react-icons/gi";
import { PiUserFocusDuotone } from "react-icons/pi";
import "../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/primereact.min.css";
import styles from "./GoalsStyles.module.scss";
import "../masterStyle.css";
import Loader from "../Loader/Loader";
import {
  getAllHRGoals,
  getAllPredefinedGoals,
  getAppraisalCycles,
  HRCategoryDelete,
  HRgoalsDelete,
  newHRCategoryAndGoalAdd,
  updateGoalRoles,
  updateGoalRolesToOrganization,
} from "../../../../Services/HRGoalsServices/HRGoalServices";

import ToastMessage from "../CommonComponents/Toast/ToastMessage";

import { useSelector } from "react-redux";
import { arrangeWord } from "../../../../Services/CommonServices/CommonServices";

interface ICurrentCycle {
  currentCycleId: any;
  goalSubmit: boolean;
}

const Goals = (): any => {
  // const dispatch = useDispatch();

  // selectors
  const AllUserDetails: any = useSelector(
    (state: any) => state.HRServiceData.userDetails
  );
  const AllRoleList: any = useSelector(
    (state: any) => state.HRServiceData.rolesList
  );
  console.log("AllRoleList", AllRoleList);

  const appraisalCycleList: any = useSelector(
    (state: any) => state.HRServiceData.masterCycles
  );

  // const toast = useRef<Toast>(null);
  // const currentDate = new Date(new Date().setHours(0, 0, 0, 0));
  const [masterData, setMasterData] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(true);
  const [predefinedGoalsList, setPredefinedGoals] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [deletedGoals, setDeletedGoals] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [cyclesList, setCycleList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([]);
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
  const [appraisalCycleId, setAppraisalCycleId] = useState<ICurrentCycle>({
    currentCycleId: null,
    goalSubmit: false,
  });
  const [goalDelPopup, setGoalDelPopup] = useState<any>({
    delPopup: false,
    delGoalId: null,
  });
  const [toastMessage, setToastMessage] = useState<any>({
    isShow: false,
    severity: "",
    title: "",
    message: "",
    duration: "",
  });

  console.log(
    usersList,
    "userList",
    rolesList,
    "rolesList",
    cyclesList,
    categories,
    duplicateData,
    masterData,
    predefinedGoalsList
  );

  const categoryHandleFun = (data: any): any => {
    let ID = 1;
    const groupedArray = data.reduce((acc: any, obj: any) => {
      const existingCategory = acc.find(
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
    setCategories([...groupedArray]);
  };

  const addNewCategory = (condition: boolean): any => {
    const tempArr = [...duplicateData];
    const tempCategoryArr = [...categories];
    if (condition) {
      if (categoryHandleObj.newCategory !== "") {
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
      const index = tempCategoryArr.findIndex(
        (ind) => ind.mainID === categoryHandleObj.ID
      );
      const tempObj = tempCategoryArr[index];
      if (tempObj.GoalCategory !== categoryHandleObj.newCategory) {
        // tempObj.GoalCategory = categoryHandleObj.newCategory;
        const categoryGolasArr = tempObj.values;
        categoryGolasArr.forEach((obj: any) => {
          sp.web.lists
            .getByTitle(`HrGoals`)
            .items.getById(obj.ID)
            .update({ GoalCategory: categoryHandleObj.newCategory })
            .then((res) => {
              const duplicateindex = tempArr.findIndex(
                (temp) => temp.ID === obj.ID
              );
              const duplicateObj = tempArr[duplicateindex];
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
      callBackDatas();
    }
  };
  const addGoalFunction = (ind: number): any => {
    const duplicateArr = [...duplicateData];
    const tempArr = categories;
    const index = [...tempArr].findIndex((obj) => obj.mainID === ind + 1);
    const data = tempArr[index];
    const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
    if (isEdit.length > 0) {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Warning!",
        message:
          "Please save or cancel the current row before editing another row.",
        duration: 3000,
      });
      // toast.current?.show({
      //   severity: "warn",
      //   summary: "Warning",
      //   detail:
      //     "Please save or cancel the current row before editing another row",
      // });
    } else {
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
    }
  };

  const editCategoryFun = (ind: number): any => {
    setCategoryHandleObj({
      ...categoryHandleObj,
      ID: ind + 1,
      newCategory: categories[ind].GoalCategory,
      isUpdate: true,
    });
  };

  const deleteCategoryFun = async () => {
    await HRCategoryDelete(
      duplicateData,
      categories,
      predefinedGoalsList,
      isPopup,
      setIsPopup,
      setMasterData,
      setDuplicateData,
      categoryHandleFun,
      callBackDatas
    );
  };

  const editRowFunction = (data: any): any => {
    const duplicateArr = [...duplicateData];
    const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
    if (isEdit.length > 0) {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Warning!",
        message:
          "Please save or cancel the current row before editing another row.",
        duration: 3000,
      });
      // toast.current?.show({
      //   severity: "warn",
      //   summary: "Warning",
      //   detail:
      //     "Please save or cancel the current row before editing another row",
      // });
    } else {
      const index = [...duplicateArr].findIndex(
        (obj: any) => obj.ID === data.ID
      );
      const tempObj = duplicateArr[index];
      duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
      setDuplicateData([...duplicateArr]);
      categoryHandleFun([...duplicateArr]);
    }
  };
  const validationFun = (tempObj: any): any => {
    if (tempObj.GoalName !== "") {
      if (tempObj.AssignLevel.name !== "") {
        if (tempObj.AssignLevel.name === "Role") {
          if (tempObj.Role.length > 0) {
            return true;
          } else {
            setToastMessage({
              isShow: true,
              severity: "warn",
              title: "Warning!",
              message: "Please select Employee role.",
              duration: 3000,
            });
            // toast.current?.show({
            //   severity: "warn",
            //   summary: "Warning",
            //   detail: "Please select Employee role.",
            // });
            return false;
          }
        } else {
          return true;
        }
      } else {
        setToastMessage({
          isShow: true,
          severity: "warn",
          title: "Warning!",
          message: "Please select assign level.",
          duration: 3000,
        });
        // toast.current?.show({
        //   severity: "warn",
        //   summary: "Warning",
        //   detail: "Please select assign level ",
        // });
        return false;
      }
    } else {
      setToastMessage({
        isShow: true,
        severity: "warn",
        title: "Warning!",
        message: "Please enter goal name.",
        duration: 3000,
      });
      // toast.current?.show({
      //   severity: "warn",
      //   summary: "Warning",
      //   detail: "Please enter goal name",
      // });
      return false;
    }
  };

  const goalSubmitFun = (data: any): any => {
    const index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    const tempObj = duplicateData[index];
    const addObj: any = {
      AssignLevel: tempObj.AssignLevel.name,
      Role: tempObj.Role
        ? { results: tempObj.Role.map((role: any) => role.name) }
        : { results: [""] },
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
    };
    const validation = validationFun(tempObj);
    if (tempObj.isNew && validation) {
      setIsLoader(true);
      newHRCategoryAndGoalAdd(
        tempObj,
        usersList,
        appraisalCycleId,
        callBackDatas,
        setToastMessage
      );
    } else if (validation) {
      setIsLoader(true);
      const duplicateArr = [...duplicateData];
      const masterArr = [...masterData];
      const index = [...duplicateArr].findIndex(
        (obj: any) => obj.ID === data.ID
      );
      const tempObj = duplicateArr[index];
      const masterObj = masterArr[index];
      if (tempObj.AssignLevel.name === "Organization") {
        updateGoalRolesToOrganization(
          tempObj,
          predefinedGoalsList,
          usersList,
          appraisalCycleId,
          callBackDatas
        );
      } else {
        updateGoalRoles(
          masterObj,
          tempObj,
          predefinedGoalsList,
          usersList,
          appraisalCycleId,
          callBackDatas,
          setToastMessage
        );
      }
      sp.web.lists
        .getByTitle(`HrGoals`)
        .items.getById(tempObj.ID)
        .update(addObj)
        .then((res) => {
          const duplicateArr = [...duplicateData];
          const index = [...duplicateArr].findIndex(
            (obj: any) => obj.ID === data.ID
          );
          const tempObj = duplicateArr[index];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
          };
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);
        })
        .catch((err) => console.log(err));
    } else {
      // setToastMessage({
      //   isShow: true,
      //   severity: "warn",
      //   title: "Warning!",
      //   message: "Please enter mandatory fields.",
      //   duration: 3000,
      // });
      // toast.current?.show({
      //   severity: "warn",
      //   summary: "Warning",
      //   detail: "Please enter mandatory fields",
      // });
    }
  };

  const editCancelFun = (data: any): any => {
    let duplicateArr = [...duplicateData];
    const indexMain = [...masterData].findIndex(
      (obj: any) => obj.ID === data.ID
    );
    const tempObjMain = masterData[indexMain];
    if (tempObjMain) {
      const index = [...duplicateArr].findIndex(
        (obj: any) => obj.ID === data.ID
      );
      duplicateArr[index] = tempObjMain;
    } else {
      duplicateArr = duplicateArr.filter((obj) => obj.ID !== data.ID);
    }
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
  };

  const goalDeleteFun = async (): Promise<void> => {
    let updateArray = HRgoalsDelete(
      duplicateData,
      predefinedGoalsList,
      goalDelPopup,
      setDeletedGoals,
      setGoalDelPopup,
      callBackDatas
    );
    categoryHandleFun([...(await updateArray)]);
    setDuplicateData([...(await updateArray)]);
    setMasterData([...(await updateArray)]);
  };

  const onChangeHandleFun = (value: any, type: string, id: number): any => {
    const tempArr = duplicateData.map((obj) => {
      if (obj.ID === id) {
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
          if (value.name === "Organization") {
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
  const GoalnameBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
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
          {arrangeWord(rowData.GoalName)}
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
  const AssignLevelBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
        <Dropdown
          value={rowData.AssignLevel}
          style={{
            padding: "0",
          }}
          onChange={(e) => {
            if (rowData.GoalName !== "") {
              onChangeHandleFun(e.value, "AssignLevel", rowData.ID);
            } else {
              setToastMessage({
                isShow: true,
                severity: "warn",
                title: "Warning!",
                message: "Please add goalname first and then assign level.",
                duration: 3000,
              });
              // toast.current?.show({
              //   severity: "warn",
              //   summary: "Warning",
              //   detail: "Please add goalname first and then assign level.",
              // });
            }
          }}
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
  const RoleBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
    return 0 <= index ? (
      rowData.AssignLevel.name === "Role" && duplicateData[index].isRowEdit ? (
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
      ) : rowData.AssignLevel.name === "Role" ? (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "10px",
          }}
        >
          {rowData.Role.map((role: any, index: number) => (
            <p
              key={index}
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
        <div />
      )
    ) : (
      <div>
        {rowData.Role.map((role: any, index: number) => (
          <p
            key={index}
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
  const ActionBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
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
        appraisalCycleId.goalSubmit && (
          <div>
            <MdEditDocument
              className={styles.editIcon}
              onClick={(e) => {
                if (categoryHandleObj.isNew || categoryHandleObj.isUpdate) {
                  setToastMessage({
                    isShow: true,
                    severity: "warn",
                    title: "Warning!",
                    message:
                      "Please save or cancel the category before editing.",
                    duration: 3000,
                  });
                  // toast.current?.show({
                  //   severity: "warn",
                  //   summary: "Warning",
                  //   detail:
                  //     "Please save or cancel the category before editing.",
                  // });
                } else {
                  editRowFunction(rowData);
                }
              }}
            />
            <MdDelete
              className={styles.cancelIcon}
              onClick={() => {
                const duplicateArr = [...duplicateData];
                const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
                if (isEdit.length > 0) {
                  setToastMessage({
                    isShow: true,
                    severity: "warn",
                    title: "Warning!",
                    message:
                      "Please save or cancel the current row before editing another row.",
                    duration: 3000,
                  });
                  // toast.current?.show({
                  //   severity: "warn",
                  //   summary: "Warning",
                  //   detail:
                  //     "Please save or cancel the current row before editing another row",
                  // });
                } else {
                  setGoalDelPopup({
                    ...goalDelPopup,
                    delPopup: true,
                    delGoalId: rowData.ID,
                  });
                }
              }}
            />
          </div>
        )
      )
    ) : (
      <div>
        <MdEditDocument
          className={styles.editIcon}
          onClick={(e) => editRowFunction(rowData)}
        />
        <MdDelete
          className={styles.cancelIcon}
          onClick={() => goalDeleteFun()}
        />
      </div>
    );
  };

  const callBackDatas = () => {
    if (appraisalCycleId.currentCycleId) {
      getAllHRGoals(
        appraisalCycleId.currentCycleId,
        setDeletedGoals,
        setCategories,
        setDuplicateData,
        setMasterData
      );
      getAllPredefinedGoals(
        appraisalCycleId.currentCycleId,
        setPredefinedGoals,
        setIsLoader
      );
    }
  };

  useEffect(() => {
    // callBackDatas();
    // getUsersDetailsAndRoles(dispatch);
    // setUsersList([...AllUserDetails]);
    setCycleList([...appraisalCycleList]);
    setAssignLevelList([
      { name: "Organization", code: "Organization" },
      { name: "Role", code: "Role" },
    ]);
    getAppraisalCycles(setAppraisalCycleId);
  }, []);

  useEffect(() => {
    callBackDatas();
  }, [appraisalCycleId]);

  useEffect(() => {
    setRolesList([...AllRoleList]);
    setUsersList([...AllUserDetails]);
  }, [AllRoleList, AllUserDetails]);

  const resetToastMessage = (value: boolean) => {
    setToastMessage((prev: any) => ({
      ...prev,
      isShow: value,
    }));
  };

  return isLoader ? (
    <Loader />
  ) : (
    <>
      <div className={styles.background}>
        {/* <Toast ref={toast} /> */}
        <ToastMessage
          message={toastMessage.message}
          severity={toastMessage.severity}
          duration={toastMessage.duration}
          title={toastMessage.title}
          isShow={toastMessage.isShow}
          setToastMessage={resetToastMessage}
        />
        <Dialog
          header="Confirmation"
          visible={goalDelPopup.delPopup}
          style={{ width: "25%" }}
          onClick={(e) => e.stopPropagation()}
          onHide={() =>
            setGoalDelPopup({
              ...goalDelPopup,
              delPopup: false,
              delGoalId: null,
            })
          }
        >
          <div className="DeletePopup">
            <p>Do you want to delete this goal?</p>
            <div>
              <Button
                onClick={() => goalDeleteFun()}
                // icon="pi pi-check"
                label="confirm"
                className="mr-2 dltBtn"
              />
              <Button
                onClick={() =>
                  setGoalDelPopup({
                    ...goalDelPopup,
                    delPopup: false,
                    delGoalId: null,
                  })
                }
                text
                className="cancelBtn"
                // icon="pi pi-times"
                label="cancel"
              />
            </div>
          </div>
        </Dialog>
        <div className="appraisalTitle">
          {cyclesList.map((data) => {
            if (data.ID === appraisalCycleId.currentCycleId) {
              return (
                <span>
                  Appraisal {data.Year} - {data.cycleCategory}
                  {" ("}
                  {moment(data.startDate).format("DD/MMM")} to{" "}
                  {moment(data.endDate).format("DD/MMM")}
                  {")"}
                  <span className="appraisalLabel">
                    {appraisalCycleId.goalSubmit ? " - Goal Submission" : ""}
                  </span>
                </span>
              );
            }
          })}
        </div>
        <div className="addCategory">
          <div className="managerGoal">
            <span>PREDEFINE GOALS</span>
          </div>
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
          ) : appraisalCycleId.goalSubmit ? (
            <Button
              label="New Category"
              onClick={(e) => {
                const duplicateArr = [...duplicateData];
                const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
                if (isEdit.length > 0) {
                  setToastMessage({
                    isShow: true,
                    severity: "warn",
                    title: "Warning!",
                    message:
                      "Please save or cancel the current row before editing another row.",
                    duration: 3000,
                  });
                  // toast.current?.show({
                  //   severity: "warn",
                  //   summary: "Warning",
                  //   detail:
                  //     "Please save or cancel the current row before editing another row",
                  // });
                } else {
                  setCategoryHandleObj({ ...categoryHandleObj, isNew: true });
                }
              }}
            />
          ) : null}
        </div>
        <div
          className={`hrGoals ${
            appraisalCycleId.goalSubmit ? "" : "noGoalSubmit"
          }`}
        >
          <Accordion
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            {categories.map((data: any, index: number) => {
              return (
                <AccordionTab
                  className="accordionMain"
                  key={index}
                  header={
                    <span className="flex d-flex justify-content-between align-items-center gap-2 w-full category-sec">
                      <span className="CategoryTitle">
                        {arrangeWord(data.GoalCategory)}
                      </span>
                      {appraisalCycleId.goalSubmit && activeIndex === index ? (
                        <div className="font-bold iconSec">
                          {isPopup.delIndex === index && isPopup.delPopup && (
                            <Dialog
                              header="Confirmation"
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
                              <div className="DeletePopup">
                                <p>Do you want to delete this category?</p>
                                <div style={{ display: "flex" }}>
                                  <Button
                                    onClick={() => deleteCategoryFun()}
                                    // icon="pi pi-check"
                                    label="Confirm"
                                    className="mr-2 dltBtn"
                                  />
                                  <Button
                                    onClick={() =>
                                      setIsPopup({
                                        ...isPopup,
                                        delPopup: false,
                                      })
                                    }
                                    text
                                    // icon="pi pi-times"
                                    label="cancel"
                                    className="cancelBtn"
                                  />
                                </div>
                              </div>
                            </Dialog>
                          )}
                          {data.values.filter((val: any) => val.isNew)
                            .length === 0 ? (
                            <AddSquare28Regular
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
                          <BiSolidEdit
                            className="editIcon"
                            onClick={(event) => {
                              const duplicateArr = [...duplicateData];
                              const isEdit = duplicateArr.filter(
                                (edit) => edit.isRowEdit
                              );
                              if (isEdit.length > 0) {
                                event.preventDefault();
                                event.stopPropagation();
                                setToastMessage({
                                  isShow: true,
                                  severity: "warn",
                                  title: "Warning!",
                                  message:
                                    "Please save or cancel the current row before editing another row.",
                                  duration: 3000,
                                });
                                // toast.current?.show({
                                //   severity: "warn",
                                //   summary: "Warning",
                                //   detail:
                                //     "Please save or cancel the current row before editing another row",
                                // });
                              } else {
                                event.preventDefault(),
                                  event.stopPropagation(),
                                  editCategoryFun(index);
                              }
                            }}
                          />
                          <MdDelete
                            className="deleteIcon"
                            onClick={(event) => {
                              const duplicateArr = [...duplicateData];
                              const isEdit = duplicateArr.filter(
                                (edit) => edit.isRowEdit
                              );
                              if (isEdit.length > 0) {
                                event.preventDefault(),
                                  event.stopPropagation(),
                                  setToastMessage({
                                    isShow: true,
                                    severity: "warn",
                                    title: "Warning!",
                                    message:
                                      "Please save or cancel the current row before editing another row.",
                                    duration: 3000,
                                  });
                                // toast.current?.show({
                                //   severity: "warn",
                                //   summary: "Warning",
                                //   detail:
                                //     "Please save or cancel the current row before editing another row",
                                // });
                              } else {
                                event.preventDefault(),
                                  event.stopPropagation(),
                                  setIsPopup({
                                    ...isPopup,
                                    delPopup: true,
                                    delIndex: index,
                                  });
                              }
                            }}
                          />
                        </div>
                      ) : null}
                    </span>
                  }
                >
                  <div className="goalsTable">
                    <DataTable
                      value={data.values}
                      size="normal"
                      tableStyle={{ minWidth: "30rem" }}
                    >
                      <Column
                        className="col1"
                        field="GoalName"
                        header="Goal Name *"
                        style={{
                          width: "35%",
                        }}
                        body={GoalnameBodyTemplate}
                      />
                      <Column
                        className="col2"
                        field="AssignLevel"
                        header="Assign Level *"
                        style={{ width: "20%" }}
                        body={AssignLevelBodyTemplate}
                      />
                      <Column
                        className="col3"
                        field="Role"
                        header="Role *"
                        style={{ width: "35%" }}
                        body={RoleBodyTemplate}
                      />
                      {appraisalCycleId.goalSubmit ? (
                        <Column
                          className="col4"
                          header="Action"
                          style={{ width: "10%" }}
                          body={ActionBodyTemplate}
                        />
                      ) : null}
                    </DataTable>
                  </div>
                </AccordionTab>
              );
            })}
          </Accordion>
          {categories.length > 0 ? (
            <div />
          ) : (
            <div>
              <div className="noDataMsg">
                there are no predefined goals set at the moment
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Goals;
