import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { MdEditDocument } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FaCommentDots } from "react-icons/fa6";
import { FileUpload } from "primereact/fileupload";
import styles from "./PreDefinedGoalsStyle.module.scss";
import "../masterStyle.css";
import Loader from "../Loader/Loader";

const PredefinedGoals = (props: any) => {
  const toast = useRef<Toast>(null);
  let appraisalCycleID = props.appraisalCycle.currentCycle;
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [managerGoals, setManagerGoals] = useState<any[]>([]);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [rowHandleObj, setRowHandleObj] = useState<any>({
    ID: null,
    commentType: "",
    comment: "",
    isPopup: false,
    isEdit: false,
    files: [],
  });
  const [assignUserObj, setAssignUserObj] = useState<any>({
    userID: null,
    userName: "",
    userEmail: "",
  });
  const [goalDelPopup, setGoalDelPopup] = useState<any>({
    delPopup: false,
    delGoalId: null,
  });
  const [rating, setRating] = useState({ MangerRating: 0, EmployeeRating: 0 });

  const getDetails = () => {
    sp.web.lists
      .getByTitle("PredefinedGoals")
      .items.select(
        "*",
        "AssignTo/EMail",
        "AssignTo/Id",
        "AssignTo/Title",
        "Attachments",
        "AttachmentFiles"
      )
      .expand("AssignTo,AttachmentFiles")
      .filter(`AppraisalCycleLookupId eq '${appraisalCycleID}'`)
      .get()
      .then((items: any) => {
        const filterData = items.filter(
          (item: any) =>
            props.EmployeeEmail == item.AssignTo.EMail &&
            !item.isDelete &&
            !item.isDeleteHR
        );
        let managerGoals: any = [];
        let preDefinedGoals = filterData.filter((pre: any) => {
          if (pre.GoalCategory === "ManagerGoal") {
            managerGoals.push({
              ID: pre.ID ? pre.ID : null,
              GoalCategory: pre.GoalCategory ? pre.GoalCategory : "",
              GoalName: pre.GoalName ? pre.GoalName : "",
              AssignToId: pre.AssignTo ? pre.AssignTo.Id : "",
              ManagerComments: pre.ManagerComments ? pre.ManagerComments : "",
              EmployeeComments: pre.EmployeeComments
                ? pre.EmployeeComments
                : "",
              ManagerRating: pre.ManagerRating ? pre.ManagerRating : 0,
              EmployeeRating: pre.EmployeeRating ? pre.EmployeeRating : 0,
              AttachmentFiles: pre.AttachmentFiles
                ? pre.AttachmentFiles.map((file: any) => {
                    return {
                      FileName: file.FileName,
                      ServerRelativeUrl: file.ServerRelativeUrl,
                      isStatus: "uploaded",
                    };
                  })
                : [],
              isRowEdit: false,
              isNew: false,
            });
            return false;
          } else {
            return true;
          }
        });
        let tempArr: any = [];
        let ID = 1;
        const categorizedItems = preDefinedGoals.reduce(
          (acc: any, obj: any) => {
            let existingCategory = acc.find(
              (item: any) => item.GoalCategory === obj.GoalCategory
            );
            if (existingCategory) {
              existingCategory.values.push({
                GoalName: obj.GoalName,
                isRowEdit: false,
                isNew: false,
                ID: obj.ID,
                ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
                EmployeeComments: obj.EmployeeComments
                  ? obj.EmployeeComments
                  : "",
                ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
                EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
                AttachmentFiles: obj.AttachmentFiles
                  ? obj.AttachmentFiles.map((file: any) => {
                      return {
                        FileName: file.FileName,
                        ServerRelativeUrl: file.ServerRelativeUrl,
                        isStatus: "uploaded",
                      };
                    })
                  : [],
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
                    ManagerComments: obj.ManagerComments
                      ? obj.ManagerComments
                      : "",
                    EmployeeComments: obj.EmployeeComments
                      ? obj.EmployeeComments
                      : "",
                    ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
                    EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
                    AttachmentFiles: obj.AttachmentFiles
                      ? obj.AttachmentFiles.map((file: any) => {
                          return {
                            FileName: file.FileName,
                            ServerRelativeUrl: file.ServerRelativeUrl,
                            isStatus: "uploaded",
                          };
                        })
                      : [],
                  },
                ],
              });
            }
            return acc;
          },
          []
        );
        filterData.forEach((obj: any) => {
          tempArr.push({
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            AssignToId: obj.AssignTo ? obj.AssignTo.Id : "",
            ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
            EmployeeComments: obj.EmployeeComments ? obj.EmployeeComments : "",
            ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
            EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
            AttachmentFiles: obj.AttachmentFiles
              ? obj.AttachmentFiles.map((file: any) => {
                  return {
                    FileName: file.FileName,
                    ServerRelativeUrl: file.ServerRelativeUrl,
                    isStatus: "uploaded",
                  };
                })
              : [],
            isRowEdit: false,
            isNew: false,
          });
        });
        setDuplicateData([...tempArr]);
        setManagerGoals([...managerGoals]);
        setCategories([...categorizedItems]);
        setMasterData([...tempArr]);
        setIsLoader(false);
      })
      .catch((err) => {
        console.log("get Data function error", err);
      });
  };
  const init = () => {
    sp.web
      .siteUsers()
      .then((res) => {
        res.forEach((user) => {
          if (user.Email === props.EmployeeEmail) {
            setAssignUserObj({
              ...assignUserObj,
              userID: user.Id,
              userName: user.Title,
              userEmail: user.Email,
            });
          }
        });
      })
      .catch((err) => console.log("get user function error", err));
    getDetails();
  };
  useEffect(() => {
    setIsLoader(true);
    init();
  }, [props]);

  const categoryHandleFun = (data: any) => {
    let managerGoals: any = [];
    let preDefinedGoals = data.filter((pre: any) => {
      if (pre.GoalCategory === "ManagerGoal") {
        managerGoals.push({
          ID: pre.ID ? pre.ID : null,
          GoalCategory: pre.GoalCategory ? pre.GoalCategory : "",
          GoalName: pre.GoalName ? pre.GoalName : "",
          AssignToId: pre.AssignTo ? pre.AssignTo.Id : "",
          ManagerComments: pre.ManagerComments ? pre.ManagerComments : "",
          EmployeeComments: pre.EmployeeComments ? pre.EmployeeComments : "",
          ManagerRating: pre.ManagerRating ? pre.ManagerRating : 0,
          EmployeeRating: pre.EmployeeRating ? pre.EmployeeRating : 0,
          AttachmentFiles: pre.AttachmentFiles ? pre.AttachmentFiles : [],
          isRowEdit: pre.isRowEdit,
          isNew: pre.isNew,
        });
        return false;
      } else {
        return true;
      }
    });
    let ID = 1;
    let groupedArray = preDefinedGoals.reduce((acc: any, obj: any) => {
      let existingCategory = acc.find(
        (item: any) => item.GoalCategory === obj.GoalCategory
      );
      if (existingCategory) {
        existingCategory.values.push({
          GoalName: obj.GoalName,
          ID: obj.ID,
          isRowEdit: obj.isRowEdit,
          isNew: obj.isNew,
          ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
          EmployeeComments: obj.EmployeeComments ? obj.EmployeeComments : "",
          ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
          EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
          AttachmentFiles: obj.AttachmentFiles,
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
              ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
              EmployeeComments: obj.EmployeeComments
                ? obj.EmployeeComments
                : "",
              ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
              EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
              AttachmentFiles: obj.AttachmentFiles,
            },
          ],
        });
      }
      return acc;
    }, []);
    setManagerGoals([...managerGoals]);
    setCategories([...groupedArray]);
  };
  const addGoalFunction = (ind: number) => {
    let duplicateArr = [...duplicateData];
    let tempArr = categories;
    let index = [...tempArr].findIndex((obj) => obj.mainID == ind + 1);
    let data = tempArr[index];
    let isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
    if (isEdit.length > 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail:
          "Please save or cancel the current row before editing another row",
      });
    } else {
      setDuplicateData([
        ...duplicateData,
        {
          ID: Math.max(...duplicateData.map((o) => o.ID)) + 1,
          GoalName: "",
          isRowEdit: true,
          isNew: true,
          GoalCategory: data ? data.GoalCategory : "ManagerGoal",
          AssignToId: "",
          ManagerComments: "",
          EmployeeComments: "",
          ManagerRating: 0,
          EmployeeRating: 0,
          AttachmentFiles: [],
        },
      ]);
      categoryHandleFun([
        ...duplicateData,
        {
          ID: Math.max(...duplicateData.map((o) => o.ID)) + 1,
          GoalName: "",
          isRowEdit: true,
          isNew: true,
          GoalCategory: data ? data.GoalCategory : "ManagerGoal",
          AssignToId: "",
          ManagerComments: "",
          EmployeeComments: "",
          ManagerRating: 0,
          EmployeeRating: 0,
          AttachmentFiles: [],
        },
      ]);
    }
  };
  const goalSubmitFun = async (data: any) => {
    setRating({ ...rating, MangerRating: 0, EmployeeRating: 0 });
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    let updateObj: any = {
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
      ManagerComments: tempObj.ManagerComments,
      EmployeeComments: tempObj.EmployeeComments,
      ManagerRating: tempObj.ManagerRating,
      EmployeeRating: tempObj.EmployeeRating,
    };
    if (data.isNew && tempObj.GoalName !== "") {
      await sp.web.lists
        .getByTitle(`PredefinedGoals`)
        .items.add({
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          AssignToId: assignUserObj.userID,
          ManagerComments: tempObj.ManagerComments,
          EmployeeComments: tempObj.EmployeeComments,
          ManagerRating: tempObj.ManagerRating,
          EmployeeRating: tempObj.EmployeeRating,
          AppraisalCycleLookupId: appraisalCycleID,
        })
        .then(async (res) => {
          let managerGoalArr = [...managerGoals];
          setManagerGoals(
            [...managerGoalArr].map((manager) => {
              if (manager.ID === data.ID) {
                manager.ID = res.data.ID;
                return manager;
              } else {
                return manager;
              }
            })
          );
          duplicateArr.splice(index, 1);
          duplicateArr.push({
            ...tempObj,
            [`${"ID"}`]: res.data.ID,
            [`${"isRowEdit"}`]: false,
            [`${"isNew"}`]: false,
          });
          await categoryHandleFun([...duplicateArr]);
          await setDuplicateData([...duplicateArr]);
          await setMasterData([...duplicateArr]);
        })
        .catch((err) => console.log("PredefinedGoals submit error", err));
    } else if (tempObj.GoalName !== "") {
      sp.web.lists
        .getByTitle(`PredefinedGoals`)
        .items.getById(tempObj.ID)
        .update(updateObj)
        .then((res) => {
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
          };
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);

          let newFiles = tempObj.AttachmentFiles.filter(
            (fill: any) => fill.isStatus === "new"
          ).map((file: any) => {
            return {
              name: file.FileName,
              content: file.content,
            };
          });

          let deleteFiles = tempObj.AttachmentFiles.filter(
            (fill: any) => fill.isStatus === "delete"
          ).map((file: any) => {
            return {
              name: file.FileName,
              content: file.content,
            };
          });

          if (deleteFiles.length > 0) {
            deleteFiles.forEach((del: any, ind: number) => {
              res.item.attachmentFiles
                .getByName(deleteFiles[ind].name)
                .delete()
                .then((delRes) => {
                  let duplicateArr = [...duplicateData];
                  tempObj.AttachmentFiles = tempObj.AttachmentFiles.filter(
                    (file: any) => file.isStatus !== "delete"
                  );
                  duplicateArr[index] = {
                    ...tempObj,
                    [`${"isRowEdit"}`]: false,
                  };
                  setDuplicateData([...duplicateArr]);
                  setMasterData([...duplicateArr]);
                  categoryHandleFun([...duplicateArr]);
                  if (ind === deleteFiles.length - 1 && newFiles.length > 0) {
                    res.item.attachmentFiles
                      .addMultiple(newFiles)
                      .then((res) => {
                        tempObj.AttachmentFiles = tempObj.AttachmentFiles.map(
                          (file: any) => {
                            if (file.isStatus === "new") {
                              file.isStatus = "existing";
                              return file;
                            }
                          }
                        );
                        setDuplicateData([...duplicateArr]);
                        setMasterData([...duplicateArr]);
                        categoryHandleFun([...duplicateArr]);
                      })
                      .catch((err) => {
                        console.log("Attachment add error", err);
                      });
                  }
                })
                .catch((err) => console.log("Attachment add error", err));
            });
          } else if (newFiles.length > 0) {
            res.item.attachmentFiles
              .addMultiple(newFiles)
              .then((res) => {
                let duplicateArr = [...duplicateData];
                tempObj.AttachmentFiles = tempObj.AttachmentFiles.map(
                  (file: any) => {
                    if (file.isStatus === "new") {
                      file.isStatus = "existing";
                      return file;
                    } else {
                      return file;
                    }
                  }
                );
                duplicateArr[index] = {
                  ...tempObj,
                  [`${"isRowEdit"}`]: false,
                };
                setDuplicateData([...duplicateArr]);
                setMasterData([...duplicateArr]);
                categoryHandleFun([...duplicateArr]);
              })
              .catch((err) => {
                console.log("Attachment add error", err);
              });
          }
        })
        .catch((err) => console.log("Attachment add error", err));
    } else {
      // alert("please enter Goal name");
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter goal name",
      });
    }
  };
  const goalDeleteFun = () => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex(
      (obj) => obj.ID === goalDelPopup.delGoalId
    );
    let delObj = duplicateArr[index];
    let delArray = duplicateArr.filter(
      (items) => items.ID != goalDelPopup.delGoalId
    );
    sp.web.lists
      .getByTitle(`PredefinedGoals`)
      .items.getById(delObj.ID)
      .update({ isDelete: true })
      .then((res) => {
        categoryHandleFun([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
        setGoalDelPopup({
          ...goalDelPopup,
          delPopup: false,
          delGoalId: null,
        });
      })
      .catch((err) => console.log("goal delete function error", err));
  };
  const editCancelFun = (data: any) => {
    setRating({ ...rating, MangerRating: 0, EmployeeRating: 0 });
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
    let isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
    if (isEdit.length > 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail:
          "Please save or cancel the current row before editing another row",
      });
    } else {
      let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
      let tempObj = duplicateArr[index];
      duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
      setDuplicateData([...duplicateArr]);
      categoryHandleFun([...duplicateArr]);
    }
  };
  // const addNewCategory = (condition: boolean) => {
  //   let tempArr = [...duplicateData];
  //   let tempCategoryArr = [...categories];
  //   if (condition) {
  //     if (categoryHandleObj.newCategory !== "") {
  //       tempArr.push({
  //         ID: Math.max(...duplicateData.map((o) => o.ID)) + 1,
  //         GoalCategory: categoryHandleObj.newCategory,
  //         GoalName: "",
  //         AssignToId: "",
  //         ManagerComments: "",
  //         EmployeeComments: "",
  //         ManagerRating: 0,
  //         EmployeeRating: 0,
  //         AttachmentFiles: [],
  //         isRowEdit: true,
  //         isNew: true,
  //       });
  //       setDuplicateData([...tempArr]);
  //       categoryHandleFun([...tempArr]);
  //       setCategoryHandleObj({
  //         ...categoryHandleObj,
  //         newCategory: "",
  //         isNew: false,
  //         isUpdate: false,
  //       });
  //     }
  //   } else {
  //     let index = tempCategoryArr.findIndex(
  //       (ind) => ind.mainID === categoryHandleObj.ID
  //     );
  //     let tempObj = tempCategoryArr[index];
  //     let categoryGolasArr = tempObj.values;
  //     if (tempObj.GoalCategory != categoryHandleObj.newCategory) {
  //       categoryGolasArr.forEach((obj: any) => {
  //         sp.web.lists
  //           .getByTitle(`PredefinedGoals`)
  //           .items.getById(obj.ID)
  //           .update({ GoalCategory: categoryHandleObj.newCategory })
  //           .then((res) => {
  //             let duplicateindex = tempArr.findIndex(
  //               (temp) => temp.ID === obj.ID
  //             );
  //             let duplicateObj = tempArr[duplicateindex];
  //             tempArr[duplicateindex] = {
  //               ...duplicateObj,
  //               [`${"GoalCategory"}`]: categoryHandleObj.newCategory,
  //             };
  //             setCategoryHandleObj({
  //               ...categoryHandleObj,
  //               newCategory: "",
  //               isNew: false,
  //               isUpdate: false,
  //               ID: null,
  //             });
  //             setMasterData([...tempArr]);
  //             setDuplicateData([...tempArr]);
  //             categoryHandleFun([...tempArr]);
  //           })
  //           .catch((err) => console.log(err));
  //       });
  //     }
  //   }
  // };
  // const editCategoryFun = (ind: number) => {
  //   setCategoryHandleObj({
  //     ...categoryHandleObj,
  //     ID: ind + 1,
  //     newCategory: categories[ind].GoalCategory,
  //     isUpdate: true,
  //   });
  // };
  // const deleteCategoryFun = () => {
  //   let duplicateArray = [...duplicateData];
  //   let tempCategoryArr = [...categories];
  //   let index = tempCategoryArr.findIndex(
  //     (ind) => ind.mainID === isPopup.delIndex + 1
  //   );
  //   let tempObj = tempCategoryArr[index];
  //   let categoryGoalsArr = tempObj.values;
  //   categoryGoalsArr.forEach((obj: any) => {
  //     duplicateArray = duplicateArray.filter((fill) => fill.ID !== obj.ID);
  //     setDuplicateData([...duplicateArray]);
  //     setIsPopup({ ...isPopup, delIndex: null, delPopup: false });
  //     setMasterData([...duplicateArray]);
  //     categoryHandleFun([...duplicateArray]);
  //     sp.web.lists
  //       .getByTitle(`PredefinedGoals`)
  //       .items.getById(obj.ID)
  //       .update({ isDelete: true })
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => console.log(err));
  //   });
  // };
  const onChangeHandleFun = (value: any, type: string, id: number) => {
    let duplicateArr = duplicateData;
    let index = duplicateArr.findIndex((obj: any) => obj.ID === id);
    let orignalObj = duplicateArr[index];
    let temp: any = [...orignalObj.AttachmentFiles];

    let editObj = {
      ID: orignalObj.ID,
      GoalCategory: orignalObj.GoalCategory,
      AssignToId: orignalObj.AssignToId,
      isNew: orignalObj.isNew,
      isRowEdit: orignalObj.isRowEdit,
      GoalName: type === "GoalName" ? value : orignalObj.GoalName,
      ManagerComments: type === "Manager" ? value : orignalObj.ManagerComments,
      EmployeeComments:
        type === "Employee" ? value : orignalObj.EmployeeComments,
      EmployeeRating:
        type === "EmployeeRating" ? (value + 1) / 2 : orignalObj.EmployeeRating,
      ManagerRating:
        type === "ManagerRating" ? (value + 1) / 2 : orignalObj.ManagerRating,
      AttachmentFiles:
        type === "Attachments"
          ? value.forEach((file: any) => {
              temp.push({
                FileName: file.name,
                content: file,
                ServerRelativeUrl: file.objectURL,
                isStatus: "new",
              });
            })
          : "",
    };
    if (type === "Manager") {
      setRowHandleObj({
        ...rowHandleObj,
        comment: value,
      });
    }
    if (type === "Employee") {
      setRowHandleObj({
        ...rowHandleObj,
        comment: value,
      });
    }
    if (type === "Attachments") {
      setRowHandleObj({
        ...rowHandleObj,
        files: temp,
      });
    }
    editObj.AttachmentFiles = temp;
    duplicateArr[index] = editObj;
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
  };
  const handleMouseOver = (value: any, type: string) => {
    if (type === "manger") {
      setRating({ ...rating, MangerRating: value });
    } else {
      setRating({ ...rating, EmployeeRating: value });
    }
  };
  const GoalnameBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
        <InputTextarea
          value={rowData.GoalName}
          rows={2}
          cols={30}
          disabled={!props.isManager || !props.appraisalCycle.goalSubmit}
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
  const EmployeeRatingBodyTemplate = (rowData: any) => {
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
        <div className=" d-flex">
          <div
            onMouseOut={() =>
              setRating({ ...rating, EmployeeRating: rowData.EmployeeRating })
            }
          >
            <div className="rating-container">
              {ratingValues.map((value: any, index) => (
                <a
                  key={index}
                  href="#"
                  className={`rating-star ${
                    value <= rowData.EmployeeRating ? "active" : ""
                  } ${value <= rating.EmployeeRating ? "active" : ""} ${
                    ![1, 2, 3, 4, 5].includes(value) ? "noPadding" : ""
                  } ${
                    !props.isManager && props.appraisalCycle.submitComments
                      ? "show"
                      : "disabled"
                  }`}
                  onMouseOver={() => handleMouseOver(value, "Employee")}
                  onClick={() => {
                    onChangeHandleFun(index, "EmployeeRating", rowData.ID);
                  }}
                >
                  <span></span>
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.EmployeeRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.EmployeeComments == ""
                ? "commentIcon"
                : "filledCommentIcon"
            }
            onClick={() =>
              setRowHandleObj({
                ...rowHandleObj,
                ID: rowData.ID,
                commentType: "Employee",
                comment: rowData.EmployeeComments,
                isPopup: true,
                isEdit: rowData.isRowEdit,
                files: rowData.AttachmentFiles,
              })
            }
          />
        </div>
      ) : (
        <div className=" d-flex">
          <div>
            <div className="rating-container">
              {ratingValues.map((value, index) => (
                <a
                  key={index}
                  href="#"
                  className={`rating-star ${
                    value <= rowData.EmployeeRating ? "active" : ""
                  } ${![1, 2, 3, 4, 5].includes(value) ? "noPadding" : ""}`}
                >
                  <span></span>
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.EmployeeRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.EmployeeComments == ""
                ? "commentIcon"
                : "filledCommentIcon"
            }
            onClick={() =>
              setRowHandleObj({
                ...rowHandleObj,
                ID: rowData.ID,
                commentType: "Employee",
                comment: rowData.EmployeeComments,
                isPopup: true,
                isEdit: rowData.isRowEdit,
                files: rowData.AttachmentFiles,
              })
            }
          />
        </div>
      )
    ) : (
      <div className=" d-flex">
        <div>
          <div className="rating-container">
            {ratingValues.map((value, index) => (
              <a
                key={index}
                href="#"
                className={`rating-star ${
                  value <= rowData.EmployeeRating ? "active" : ""
                } ${![1, 2, 3, 4, 5].includes(value) ? "noPadding" : ""}`}
              >
                <span></span>
              </a>
            ))}
          </div>
          <span className="rating-value">{rowData.EmployeeRating}</span>
        </div>
        <FaCommentDots
          className={
            rowData.EmployeeComments == "" ? "commentIcon" : "filledCommentIcon"
          }
          onClick={() =>
            setRowHandleObj({
              ...rowHandleObj,
              ID: rowData.ID,
              commentType: "Employee",
              comment: rowData.EmployeeComments,
              isPopup: true,
              isEdit: rowData.isRowEdit,
              files: rowData.AttachmentFiles,
            })
          }
        />
      </div>
    );
  };
  const ManagerRatingBodyTemplate = (rowData: any) => {
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return 0 <= index ? (
      duplicateData[index].isRowEdit ? (
        <div className="d-flex">
          <div
            onMouseOut={() =>
              setRating({ ...rating, MangerRating: rowData.ManagerRating })
            }
          >
            <div className="rating-container">
              {ratingValues.map((value: any, index) => (
                <a
                  key={index}
                  href="#"
                  className={`rating-star ${
                    value <= rowData.ManagerRating ? "active" : ""
                  } ${value <= rating.MangerRating ? "active" : ""} ${
                    ![1, 2, 3, 4, 5].includes(value) ? "noPadding" : ""
                  } ${
                    props.isManager && props.appraisalCycle.submitComments
                      ? "Show"
                      : "disabled"
                  }`}
                  onMouseOver={() => handleMouseOver(value, "manger")}
                  onClick={() => {
                    onChangeHandleFun(index, "ManagerRating", rowData.ID);
                  }}
                >
                  <span></span>
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.ManagerRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.ManagerComments == ""
                ? "commentIcon"
                : "filledCommentIcon"
            }
            onClick={() =>
              setRowHandleObj({
                ...rowHandleObj,
                ID: rowData.ID,
                commentType: "Manager",
                comment: rowData.ManagerComments,
                isPopup: true,
                isEdit: rowData.isRowEdit,
              })
            }
          />
        </div>
      ) : (
        <div className="d-flex">
          <div>
            <div className="rating-container">
              {ratingValues.map((value, index) => (
                <a
                  key={index}
                  href="#"
                  className={`rating-star ${
                    value <= rowData.ManagerRating ? "active" : ""
                  } ${![1, 2, 3, 4, 5].includes(value) ? "noPadding" : ""}`}
                >
                  <span></span>
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.ManagerRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.ManagerComments == ""
                ? "commentIcon"
                : "filledCommentIcon"
            }
            onClick={() =>
              setRowHandleObj({
                ...rowHandleObj,
                ID: rowData.ID,
                commentType: "Manager",
                comment: rowData.ManagerComments,
                isPopup: true,
                isEdit: rowData.isRowEdit,
              })
            }
          />
        </div>
      )
    ) : (
      <div className="d-flex">
        <div>
          <div className="rating-container">
            {ratingValues.map((value, index) => (
              <a
                key={index}
                href="#"
                className={`rating-star ${
                  value <= rowData.ManagerRating ? "active" : ""
                } ${![1, 2, 3, 4, 5].includes(value) ? "noPadding" : ""}`}
              >
                <span></span>
              </a>
            ))}
          </div>
          <span className="rating-value">{rowData.ManagerRating}</span>
        </div>
        <FaCommentDots
          className={
            rowData.ManagerComments == "" ? "commentIcon" : "filledCommentIcon"
          }
          onClick={() =>
            setRowHandleObj({
              ...rowHandleObj,
              ID: rowData.ID,
              commentType: "Manager",
              comment: rowData.ManagerComments,
              isPopup: true,
              isEdit: rowData.isRowEdit,
            })
          }
        />
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
          <MdEditDocument
            className={styles.editIcon}
            onClick={(e) => editRowFunction(rowData)}
          />

          {props.isManager &&
          props.appraisalCycle.goalSubmit &&
          rowData.GoalCategory === "ManagerGoal" ? (
            <MdDelete
              className={styles.cancelIcon}
              onClick={() => {
                let duplicateArr = [...duplicateData];
                let isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
                if (isEdit.length > 0) {
                  toast.current?.show({
                    severity: "warn",
                    summary: "Warning",
                    detail:
                      "Please save or cancel the current row before editing another row",
                  });
                } else {
                  setGoalDelPopup({
                    ...goalDelPopup,
                    delPopup: true,
                    delGoalId: rowData.ID,
                  });
                }
              }}
            />
          ) : null}
        </div>
      )
    ) : (
      <div>
        <MdEditDocument
          className={styles.editIcon}
          onClick={(e) => editRowFunction(rowData)}
        />
        {props.isManager ? (
          <MdDelete
            className={styles.cancelIcon}
            onClick={() => goalDeleteFun()}
          />
        ) : null}
      </div>
    );
  };

  const fileDeleteFunction = (ind: number) => {
    let duplicateArr = duplicateData;
    let index = duplicateArr.findIndex(
      (obj: any) => obj.ID === rowHandleObj.ID
    );
    let orignalObj = duplicateArr[index];
    let temp: any = [...orignalObj.AttachmentFiles];
    if (temp[ind].isStatus === "new") {
      temp.splice(ind, 1);
      orignalObj.AttachmentFiles = temp;
      duplicateArr[index] = orignalObj;
      setDuplicateData([...duplicateArr]);
      categoryHandleFun([...duplicateArr]);
      setRowHandleObj({ ...rowHandleObj, files: orignalObj.AttachmentFiles });
    } else {
      temp[ind].isStatus = "delete";
      orignalObj.AttachmentFiles = temp;
      duplicateArr[index] = orignalObj;
      setDuplicateData([...duplicateArr]);
      categoryHandleFun([...duplicateArr]);
      setRowHandleObj({ ...rowHandleObj, files: orignalObj.AttachmentFiles });
    }
  };

  const dialogCancelFuntion = () => {
    let masterArr = [...masterData];
    let index = masterArr.findIndex((obj) => obj.ID === rowHandleObj.ID);
    let orignalObj = masterArr[index];
    let changeArray = duplicateData.map((obj) => {
      if (obj.ID === rowHandleObj.ID) {
        if (rowHandleObj.commentType === "Manager") {
          obj.ManagerComments =
            orignalObj && orignalObj.ManagerComments
              ? orignalObj.ManagerComments
              : "";
          return obj;
        } else {
          obj.EmployeeComments =
            orignalObj && orignalObj.EmployeeComments
              ? orignalObj.EmployeeComments
              : "";
          obj.AttachmentFiles =
            orignalObj && orignalObj.AttachmentFiles
              ? orignalObj.AttachmentFiles.map((file: any) => {
                  if (file.isStatus !== "new") {
                    if (file.isStatus === "delete") {
                      file.isStatus = "uploaded";
                      return file;
                    } else {
                      return file;
                    }
                  }
                })
              : [];
          return obj;
        }
      } else {
        return obj;
      }
    });
    setDuplicateData([...changeArray]);
    categoryHandleFun([...changeArray]);
    setRowHandleObj({
      ...rowHandleObj,
      isPopup: false,
    });
  };

  return (
    <div>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          {/* <div className={styles.addCategory}>
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
            ) : props.isManager ? (
              <div>
                <Button
                  label="New Category"
                  onClick={(e) =>
                    setCategoryHandleObj({ ...categoryHandleObj, isNew: true })
                  }
                />
              </div>
            ) : (
              <></>
            )}
          </div> */}
          <Toast ref={toast} />
          <div className="">
            <Dialog
              className="reviewDialog"
              header={rowHandleObj.commentType + " Comments"}
              visible={rowHandleObj.isPopup}
              style={{ width: "35vw" }}
              onHide={() =>
                setRowHandleObj({ ...rowHandleObj, isPopup: false })
              }
            >
              <div>
                <InputTextarea
                  style={{ width: "100%" }}
                  rows={4}
                  cols={30}
                  value={rowHandleObj.comment}
                  disabled={
                    props.isManager &&
                    props.appraisalCycle.submitComments &&
                    rowHandleObj.commentType === "Manager" &&
                    rowHandleObj.isEdit
                      ? false
                      : !props.isManager &&
                        props.appraisalCycle.submitComments &&
                        rowHandleObj.commentType === "Employee" &&
                        rowHandleObj.isEdit
                      ? false
                      : true
                  }
                  onChange={(e) =>
                    onChangeHandleFun(
                      e.target.value,
                      rowHandleObj.commentType,
                      rowHandleObj.ID
                    )
                  }
                />
              </div>
              <div className="fileBtn" style={{ marginTop: "10px" }}>
                {!props.isManager &&
                props.appraisalCycle.submitComments &&
                rowHandleObj.commentType === "Employee" &&
                rowHandleObj.isEdit ? (
                  <FileUpload
                    mode="basic"
                    name="demo[]"
                    auto
                    multiple
                    chooseLabel="Upload File"
                    maxFileSize={1000000}
                    onSelect={(e) =>
                      onChangeHandleFun(e.files, "Attachments", rowHandleObj.ID)
                    }
                  />
                ) : null}
              </div>
              {rowHandleObj.files.filter(
                (data: any) => data.isStatus !== "delete"
              ).length > 0 && rowHandleObj.commentType === "Employee" ? (
                <span className="uploadedFiles">Uploaded files</span>
              ) : null}
              <div
                className={
                  rowHandleObj.files.filter(
                    (data: any) => data.isStatus !== "delete"
                  ).length > 0 && rowHandleObj.commentType === "Employee"
                    ? "fileSec"
                    : "hide"
                }
              >
                {rowHandleObj.isPopup && rowHandleObj.commentType === "Employee"
                  ? rowHandleObj.files.map((file: any, index: number) => {
                      return (
                        file.isStatus !== "delete" && (
                          <div className="fileBox">
                            <a
                              className="filename"
                              href={file.ServerRelativeUrl}
                            >
                              <FaFileCircleCheck />
                              {file.FileName}
                            </a>
                            {!props.isManager &&
                            props.appraisalCycle.submitComments &&
                            rowHandleObj.commentType === "Employee" &&
                            rowHandleObj.isEdit ? (
                              <MdOutlineClose
                                className="cancelIcon"
                                onClick={() => fileDeleteFunction(index)}
                              />
                            ) : null}
                          </div>
                        )
                      );
                    })
                  : null}
              </div>

              <div className={styles.dialogFooter}>
                <Button
                  className={styles.submitBtn}
                  onClick={() =>
                    setRowHandleObj({
                      ...rowHandleObj,
                      isPopup: false,
                    })
                  }
                  hidden={
                    props.isManager &&
                    props.appraisalCycle.submitComments &&
                    rowHandleObj.commentType === "Manager" &&
                    rowHandleObj.isEdit
                      ? false
                      : !props.isManager &&
                        props.appraisalCycle.submitComments &&
                        rowHandleObj.commentType === "Employee" &&
                        rowHandleObj.isEdit
                      ? false
                      : true
                  }
                  label="Add"
                  severity="success"
                />
                <Button
                  className={styles.cancelBtn}
                  onClick={() => dialogCancelFuntion()}
                  text
                  label="cancel"
                ></Button>
              </div>
            </Dialog>
            <Dialog
              header="Header"
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
                <p>Do you want to delete this Goal?</p>
                <div>
                  <Button
                    onClick={() => goalDeleteFun()}
                    // icon="pi pi-check"
                    label="confirm"
                    className="mr-2 dltBtn"
                  ></Button>
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
                  ></Button>
                </div>
              </div>
            </Dialog>
          </div>
          <div
            style={{ marginTop: "10px" }}
            className={`${categories.length ? `card` : ""}`}
          >
            <Accordion
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            >
              {categories.map((items, index: any) => {
                return (
                  <AccordionTab
                    className="accordionMain"
                    header={
                      <span className="flex d-flex justify-content-between align-items-center gap-2 w-full category-sec">
                        <span className="CategoryTitle">
                          {items.GoalCategory}
                        </span>
                        {/* {props.isManager ? (
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
                                    onClick={() =>
                                      setIsPopup({
                                        ...isPopup,
                                        delIndex: null,
                                        delPopup: false,
                                      })
                                    }
                                    text
                                    icon="pi pi-times"
                                    label="Cancel"
                                  ></Button>
                                </div>
                              </Dialog>
                            )}
                            {items.values.filter((val: any) => val.isNew)
                              .length === 0 ? (
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
                        ) : null} */}
                      </span>
                    }
                  >
                    <div className="preDefinedTable">
                      <DataTable
                        value={items.values}
                        className="p-datatable-sm"
                      >
                        <Column
                          className="col1"
                          field="GoalName"
                          header="Goal Name"
                          style={{
                            width: "50%",
                          }}
                          body={GoalnameBodyTemplate}
                        ></Column>
                        <Column
                          className="col1"
                          field="EmployeeRating"
                          header="Employee Comments & Rating"
                          style={{
                            width: "20%",
                          }}
                          body={EmployeeRatingBodyTemplate}
                        ></Column>
                        <Column
                          className="col1"
                          field="ManagerRating"
                          header="Manager Comments & Rating"
                          style={{
                            width: "20%",
                          }}
                          body={ManagerRatingBodyTemplate}
                        ></Column>
                        {props.appraisalCycle.submitComments ||
                        (props.appraisalCycle.goalSubmit && props.isManager) ? (
                          <Column
                            className="col4"
                            header="Action"
                            style={{ width: "10%" }}
                            body={ActionBodyTemplate}
                          ></Column>
                        ) : null}
                      </DataTable>
                    </div>
                  </AccordionTab>
                );
              })}
            </Accordion>
          </div>
          {categories.length > 0 ? (
            <></>
          ) : (
            <div className="noDataMsg" style={{ paddingTop: "20px" }}>
              there are no predefined goals set at the moment
            </div>
          )}
          {managerGoals.length > 0 ||
          (props.isManager && props.appraisalCycle.goalSubmit) ? (
            <div>
              <div className="managerGoal">
                <span>Manager Goals</span>
              </div>
              <div
                className="managerGoalTable"
                style={{ position: "relative" }}
              >
                <DataTable value={managerGoals} className="p-datatable-sm">
                  <Column
                    className="col1"
                    field="GoalName"
                    header="Goal Name"
                    style={{ width: "50%" }}
                    body={GoalnameBodyTemplate}
                  ></Column>
                  <Column
                    className="col1"
                    field="EmployeeRating"
                    header="Employee Comments & Rating"
                    style={{ width: "20%" }}
                    body={EmployeeRatingBodyTemplate}
                  ></Column>
                  <Column
                    className="col1"
                    field="ManagerRating"
                    header="Manager Comments & Rating"
                    style={{ width: "20%" }}
                    body={ManagerRatingBodyTemplate}
                  ></Column>
                  {props.appraisalCycle.submitComments ||
                  (props.appraisalCycle.goalSubmit && props.isManager) ? (
                    <Column
                      className="col4"
                      header="Action"
                      style={{ width: "10%" }}
                      body={ActionBodyTemplate}
                    ></Column>
                  ) : null}
                </DataTable>

                {props.isManager &&
                props.appraisalCycle.goalSubmit &&
                !duplicateData.some((data) => data.isNew) ? (
                  <div className="addMaganerGoal">
                    <GrAdd
                      onClick={(e) => addGoalFunction(categories.length)}
                    />
                  </div>
                ) : null}
              </div>
              {managerGoals.length > 0 ? (
                <></>
              ) : (
                <div>
                  <div className="noDataMsg">No Data Found</div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};
export default PredefinedGoals;
