import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
// import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { HiPencil } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
// import { Rating } from "primereact/rating";
import { FaCommentDots } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FileUpload } from "primereact/fileupload";
import "./selfGoals.css";
import styles from "./SelfGoalsStyle.module.scss";

const SelfGoals = (props: any) => {
  console.log(props);

  // const [activeIndex, setActiveIndex] = useState<any>(0);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [managerGoals, setManagerGoals] = useState<any[]>([]);
  // const [categories, setCategories] = useState<any[]>([]);
  // const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
  //   ID: null,
  //   newCategory: "",
  //   isNew: false,
  //   isUpdate: false,
  // });
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  // const [totalSFGoals, setTotalSFGoals] = useState<any[]>([]);
  // const [isPopup, setIsPopup] = useState<any>({
  //   delPopup: false,
  //   delIndex: null,
  // });
  const [assignUserObj, setAssignUserObj] = useState<any>({
    userID: null,
    userName: "",
    userEmail: "",
  });
  const [rowHandleObj, setRowHandleObj] = useState<any>({
    ID: null,
    commentType: "",
    comment: "",
    isPopup: false,
    isEdit: false,
    files: [],
  });
  const [rating, setRating] = useState({
    MangerRating: 0,
    EmployeeRating: 0,
  });

  console.log(
    masterData,
    duplicateData,
    managerGoals,
    rowHandleObj,
    assignUserObj
  );

  const getDetails = () => {
    sp.web.lists
      .getByTitle("SelfGoals")
      .items.select(
        "*",
        "AssignTo/EMail",
        "AssignTo/Id",
        "AssignTo/Title",
        "Attachments",
        "AttachmentFiles"
      )
      .expand("AssignTo,AttachmentFiles")
      .filter(`AssignTo/EMail eq '${props.EmployeeEmail}'`)
      .get()
      .then((items) => {
        // setTotalSFGoals([...items]);
        console.log("items", items);
        const filterData = items.filter(
          (item) =>
            props.EmployeeEmail == item.AssignTo.EMail &&
            !item.isDelete &&
            !item.isDeleteHR
        );
        // let managerGoals: any = [];
        // let preDefinedGoals = filterData.filter((pre: any) => {
        //   if (pre.GoalCategory === "SelfGoal") {
        //     managerGoals.push({
        //       ID: pre.ID ? pre.ID : null,
        //       GoalCategory: pre.GoalCategory ? pre.GoalCategory : "",
        //       GoalName: pre.GoalName ? pre.GoalName : "",
        //       AssignToId: pre.AssignTo ? pre.AssignTo.Id : "",
        //       ManagerComments: pre.ManagerComments ? pre.ManagerComments : "",
        //       EmployeeComments: pre.EmployeeComments
        //         ? pre.EmployeeComments
        //         : "",
        //       ManagerRating: pre.ManagerRating ? pre.ManagerRating : 0,
        //       EmployeeRating: pre.EmployeeRating ? pre.EmployeeRating : 0,
        //       AttachmentFiles: pre.AttachmentFiles
        //         ? pre.AttachmentFiles.map((file: any) => {
        //             return {
        //               FileName: file.FileName,
        //               ServerRelativeUrl: file.ServerRelativeUrl,
        //               isStatus: "uploaded",
        //             };
        //           })
        //         : [],
        //       isRowEdit: false,
        //       isNew: false,
        //       isManagerGoal: true,
        //     });
        //     return false;
        //   } else {
        //     return true;
        //   }
        // });
        const tempArr: any = [];
        // let ID = 1;
        // const categorizedItems = preDefinedGoals.reduce(
        //   (acc: any, obj: any) => {
        //     let existingCategory = acc.find(
        //       (item: any) => item.GoalCategory === obj.GoalCategory
        //     );
        //     if (existingCategory) {
        //       existingCategory.values.push({
        //         GoalName: obj.GoalName,
        //         isRowEdit: false,
        //         isNew: false,
        //         ID: obj.ID,
        //         ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
        //         EmployeeComments: obj.EmployeeComments
        //           ? obj.EmployeeComments
        //           : "",
        //         ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
        //         EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
        //         AttachmentFiles: obj.AttachmentFiles
        //           ? obj.AttachmentFiles.map((file: any) => {
        //               return {
        //                 FileName: file.FileName,
        //                 ServerRelativeUrl: file.ServerRelativeUrl,
        //                 isStatus: "uploaded",
        //               };
        //             })
        //           : [],
        //       });
        //     } else {
        //       acc.push({
        //         GoalCategory: obj.GoalCategory,
        //         mainID: ID++,
        //         values: [
        //           {
        //             GoalName: obj.GoalName,
        //             isRowEdit: false,
        //             isNew: false,
        //             ID: obj.ID,
        //             ManagerComments: obj.ManagerComments
        //               ? obj.ManagerComments
        //               : "",
        //             EmployeeComments: obj.EmployeeComments
        //               ? obj.EmployeeComments
        //               : "",
        //             ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
        //             EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
        //             AttachmentFiles: obj.AttachmentFiles
        //               ? obj.AttachmentFiles.map((file: any) => {
        //                   return {
        //                     FileName: file.FileName,
        //                     ServerRelativeUrl: file.ServerRelativeUrl,
        //                     isStatus: "uploaded",
        //                   };
        //                 })
        //               : [],
        //           },
        //         ],
        //       });
        //     }
        //     return acc;
        //   },
        //   []
        // );
        filterData.forEach((obj: any) => {
          tempArr.push({
            ID: obj.ID ? obj.ID : null,
            GoalCategory: obj.GoalCategory ? obj.GoalCategory : "",
            GoalName: obj.GoalName ? obj.GoalName : "",
            EmployeeId: obj.Employee ? obj.Employee.Id : "",
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
        setManagerGoals([...tempArr]);
        setMasterData([...tempArr]);
        // setCategories([...categorizedItems]);
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
      .catch((err) => console.log(err));
    getDetails();
  };

  useEffect(() => {
    init();
    setManagerGoals([]);
    setDuplicateData([]);
  }, [props]);

  // const categoryHandleFun = (data: any) => {
  //   let managerGoals: any = [];
  //   let preDefinedGoals = data.filter((pre: any) => {
  //     if (pre.GoalCategory === "SelfGoal") {
  //       managerGoals.push({
  //         ID: pre.ID ? pre.ID : null,
  //         GoalCategory: pre.GoalCategory ? pre.GoalCategory : "",
  //         GoalName: pre.GoalName ? pre.GoalName : "",
  //         AssignToId: pre.AssignTo ? pre.AssignTo.Id : "",
  //         ManagerComments: pre.ManagerComments ? pre.ManagerComments : "",
  //         EmployeeComments: pre.EmployeeComments ? pre.EmployeeComments : "",
  //         ManagerRating: pre.ManagerRating ? pre.ManagerRating : 0,
  //         EmployeeRating: pre.EmployeeRating ? pre.EmployeeRating : 0,
  //         AttachmentFiles: pre.AttachmentFiles
  //           ? pre.AttachmentFiles.map((file: any) => {
  //               return {
  //                 FileName: file.FileName,
  //                 ServerRelativeUrl: file.ServerRelativeUrl,
  //                 isStatus: "uploaded",
  //               };
  //             })
  //           : [],
  //         isRowEdit: pre.isRowEdit,
  //         isNew: pre.isNew,
  //         isManagerGoal: pre.isManagerGoal,
  //       });
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   });
  //   let ID = 1;
  //   let groupedArray = preDefinedGoals.reduce((acc: any, obj: any) => {
  //     let existingCategory = acc.find(
  //       (item: any) => item.GoalCategory === obj.GoalCategory
  //     );
  //     if (existingCategory) {
  //       existingCategory.values.push({
  //         GoalName: obj.GoalName,
  //         ID: obj.ID,
  //         isRowEdit: obj.isRowEdit,
  //         isNew: obj.isNew,
  //         ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
  //         EmployeeComments: obj.EmployeeComments ? obj.EmployeeComments : "",
  //         ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
  //         EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
  //         AttachmentFiles: obj.AttachmentFiles,
  //       });
  //     } else {
  //       acc.push({
  //         GoalCategory: obj.GoalCategory,
  //         mainID: ID++,
  //         values: [
  //           {
  //             GoalName: obj.GoalName,
  //             ID: obj.ID,
  //             isRowEdit: obj.isRowEdit,
  //             isNew: obj.isNew,
  //             ManagerComments: obj.ManagerComments ? obj.ManagerComments : "",
  //             EmployeeComments: obj.EmployeeComments
  //               ? obj.EmployeeComments
  //               : "",
  //             ManagerRating: obj.ManagerRating ? obj.ManagerRating : 0,
  //             EmployeeRating: obj.EmployeeRating ? obj.EmployeeRating : 0,
  //             AttachmentFiles: obj.AttachmentFiles,
  //           },
  //         ],
  //       });
  //     }
  //     return acc;
  //   }, []);
  //   setManagerGoals([...managerGoals]);
  //   setCategories([...groupedArray]);
  // };
  const addGoalFunction = () => {
    // let tempArrVal = categories;
    // let index = [...tempArrVal].findIndex((obj) => obj.mainID == ind + 1);
    // let data = tempArrVal[index];
    setDuplicateData([
      ...duplicateData,
      {
        ID: Math.max(...duplicateData.map((o) => o.ID)) + 1,
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        // GoalCategory: data ? data.GoalCategory : "SelfGoal",
        GoalCategory: "SelfGoal",
        EmployeeId: "",
        ManagerComments: "",
        EmployeeComments: "",
        ManagerRating: 0,
        EmployeeRating: 0,
        AttachmentFiles: [],
      },
    ]);
    setManagerGoals([
      ...duplicateData,
      {
        ID: Math.max(...duplicateData.map((o) => o.ID)) + 1,
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        // GoalCategory: data ? data.GoalCategory : "SelfGoal",
        GoalCategory: "SelfGoal",
        EmployeeId: "",
        ManagerComments: "",
        EmployeeComments: "",
        ManagerRating: 0,
        EmployeeRating: 0,
        AttachmentFiles: [],
      },
    ]);
  };
  const goalSubmitFun = async (data: any) => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    let addObj: any = {
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
      ManagerComments: tempObj.ManagerComments,
      EmployeeComments: tempObj.EmployeeComments,
      ManagerRating: tempObj.ManagerRating,
      EmployeeRating: tempObj.EmployeeRating,
    };
    if (data.isNew) {
      await sp.web.lists
        .getByTitle("SelfGoals")
        .items.add({
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          AssignToId: assignUserObj.userID,
          ManagerComments: tempObj.ManagerComments,
          EmployeeComments: tempObj.EmployeeComments,
          ManagerRating: tempObj.ManagerRating,
          EmployeeRating: tempObj.EmployeeRating,
        })
        .then(async (res) => {
          duplicateArr.splice(index, 1);
          duplicateArr.push({
            ...tempObj,
            [`${"ID"}`]: res.data.ID,
            [`${"isRowEdit"}`]: false,
            [`${"isNew"}`]: false,
          });
          await setDuplicateData([...duplicateArr]);
          await setManagerGoals([...duplicateArr]);
          await setMasterData([...duplicateArr]);
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
          setManagerGoals([...duplicateArr]);

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
                  setManagerGoals([...duplicateArr]);
                  if (ind === deleteFiles.length - 1 && newFiles.length > 0) {
                    res.item.attachmentFiles
                      .addMultiple(newFiles)
                      .then((res) => {
                        console.log(res);
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
                        setManagerGoals([...duplicateArr]);
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }
                })
                .catch((err) => console.log(err));
            });
          } else if (newFiles.length > 0) {
            res.item.attachmentFiles
              .addMultiple(newFiles)
              .then((res) => {
                console.log(res);
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
                setManagerGoals([...duplicateArr]);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => console.log(err));
    }
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
        setManagerGoals([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
      })
      .catch((err) => console.log(err));
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
    setManagerGoals([...duplicateArr]);
  };
  const editRowFunction = (data: any) => {
    let duplicateArr = [...duplicateData];
    let isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
    if (isEdit.length > 0) {
      alert("Please save or cancel the current row before editing another row");
    } else {
      let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
      let tempObj = duplicateArr[index];
      duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
      setDuplicateData([...duplicateArr]);
      setManagerGoals([...duplicateArr]);
    }
  };
  // const addNewCategory = (condition: boolean) => {
  //   let tempArray = [...duplicateData];
  //   let tempCategoryArr = [...categories];
  //   if (condition) {
  //     if (categoryHandleObj.newCategory !== "") {
  //       tempArray.push({
  //         ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
  //         GoalCategory: categoryHandleObj.newCategory,
  //         GoalName: "",
  //         EmployeeId: "",
  //         ManagerComments: "",
  //         EmployeeComments: "",
  //         ManagerRating: 0,
  //         EmployeeRating: 0,
  //         isRowEdit: true,
  //         isNew: true,
  //       });
  //       setDuplicateData([...tempArray]);
  //       categoryHandleFun([...tempArray]);
  //       setCategoryHandleObj({
  //         ...categoryHandleObj,
  //         newCategory: "",
  //         isNew: false,
  //         isUpdate: false,
  //       });
  //     }
  //   } else {
  //     let index = tempCategoryArr.findIndex(
  //       (inx) => inx.mainID === categoryHandleObj.ID
  //     );
  //     let tempObj = tempCategoryArr[index];
  //     let categoryGolasArr = tempObj.values;
  //     if (tempObj.GoalCategory != categoryHandleObj.newCategory) {
  //       categoryGolasArr.forEach((obj: any) => {
  //         sp.web.lists
  //           .getByTitle("SelfGoals")
  //           .items.getById(obj.ID)
  //           .update({ GoalCategory: categoryHandleObj.newCategory })
  //           .then((res) => {
  //             let duplicateindex = tempArray.findIndex(
  //               (temp) => temp.ID === obj.ID
  //             );
  //             let duplicateObj = tempArray[duplicateindex];
  //             tempArray[duplicateindex] = {
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
  //             setMasterData([...tempArray]);
  //             setDuplicateData([...tempArray]);
  //             categoryHandleFun([...tempArray]);
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
  //       .getByTitle("SelfGoals")
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
    setManagerGoals([...duplicateArr]);
  };
  const handleMouseOver = (value: any, type: string) => {
    if (type === "manger") {
      setRating({ ...rating, MangerRating: value });
    } else {
      setRating({ ...rating, EmployeeRating: value });
    }
  };
  const GoalnameBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    console.log(rowData, currentObj);

    return currentObj && currentObj[0].isRowEdit ? (
      <InputTextarea
        value={rowData.GoalName}
        rows={2}
        cols={30}
        disabled={!props.isManager}
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
    );
  };
  const EmployeeRatingBodyTemplate = (rowData: any) => {
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj && currentObj[0].isRowEdit ? (
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
                } ${!props.isManager ? "disabled" : "show"}`}
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
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    return currentObj && currentObj[0].isRowEdit ? (
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
                } ${props.isManager ? "disabled" : "show"}`}
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
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj && currentObj[0].isRowEdit ? (
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
        {!props.isManager ? (
          ""
        ) : (
          <MdDelete
            className={styles.cancelIcon}
            onClick={() => goalDeleteFun(rowData)}
          />
        )}
      </div>
    );
  };
  // const fileUploadFunction = (file: any) => {
  //   let duplicateArr = [...duplicateData];
  //   let index = [...duplicateArr].findIndex(
  //     (obj: any) => obj.ID === rowHandleObj.ID
  //   );
  //   let tempObj = duplicateArr[index];
  //   tempObj.AttachmentFiles.push({
  //     FileName: file[0].name,
  //     content: file[0],
  //     ServerRelativeUrl: file[0].objectURL,
  //     isStatus: "new",
  //   });
  //   duplicateArr[index] = { ...tempObj };
  //   setDuplicateData([...duplicateArr]);
  //   setManagerGoals([...duplicateArr]);
  //   setRowHandleObj({ ...rowHandleObj, files: tempObj.AttachmentFiles });
  // };
  const fileDeleteFunction = (ind: number) => {
    console.log(ind);
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex(
      (obj: any) => obj.ID === rowHandleObj.ID
    );
    let tempObj = duplicateArr[index];
    if (tempObj.AttachmentFiles[ind].isStatus === "new") {
      tempObj.AttachmentFiles.splice(ind, 1);
      duplicateArr[index] = { ...tempObj };
      setDuplicateData([...duplicateArr]);
      setManagerGoals([...duplicateArr]);
      setRowHandleObj({
        ...rowHandleObj,
        files: tempObj.AttachmentFiles,
      });
    } else {
      tempObj.AttachmentFiles[ind].isStatus = "delete";
      duplicateArr[index] = { ...tempObj };
      setDuplicateData([...duplicateArr]);
      setManagerGoals([...duplicateArr]);
      setRowHandleObj({ ...rowHandleObj, files: tempObj.AttachmentFiles });
    }
  };

  const dialogCancelFuntion = () => {
    let masterArr = [...masterData];
    let index = masterArr.findIndex((obj) => obj.ID === rowHandleObj.ID);
    let orignalObj = masterArr[index];
    let changeArray = duplicateData.map((obj) => {
      if (obj.ID === rowHandleObj.ID) {
        if (rowHandleObj.commentType === "Manager") {
          obj.ManagerComments = orignalObj.ManagerComments
            ? orignalObj.ManagerComments
            : "";
          obj.AttachmentFiles = orignalObj.AttachmentFiles
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
        } else {
          obj.EmployeeComments = orignalObj.EmployeeComments
            ? orignalObj.EmployeeComments
            : "";
          obj.AttachmentFiles = orignalObj.AttachmentFiles
            ? orignalObj.AttachmentFiles.filter((file: any) => {
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
    setMasterData([...changeArray]);
    //  categoryHandleFun([...changeArray]);
    setRowHandleObj({
      ...rowHandleObj,
      isPopup: false,
    });
  };

  return (
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
      <Dialog
        className="reviewDialog"
        header={rowHandleObj.commentType + " Comments"}
        visible={rowHandleObj.isPopup}
        style={{ width: "35vw" }}
        onHide={() => setRowHandleObj({ ...rowHandleObj, isPopup: false })}
      >
        <div>
          <InputTextarea
            style={{ width: "100%" }}
            rows={4}
            cols={30}
            value={rowHandleObj.comment}
            disabled={
              !props.isManager &&
              rowHandleObj.commentType === "Manager" &&
              rowHandleObj.isEdit
                ? false
                : props.isManager &&
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
          {props.isManager &&
          rowHandleObj.commentType === "Employee" &&
          rowHandleObj.isEdit ? (
            <FileUpload
              mode="basic"
              name="demo[]"
              auto
              multiple
              chooseLabel="Add File"
              maxFileSize={1000000}
              onSelect={(e) =>
                onChangeHandleFun(e.files, "Attachments", rowHandleObj.ID)
              }
            />
          ) : null}
        </div>
        {rowHandleObj.files.filter((data: any) => data.isStatus !== "delete")
          .length > 0 && rowHandleObj.commentType === "Employee" ? (
          <span className="uploadedFiles">Uploaded files</span>
        ) : null}
        <div
          className={
            rowHandleObj.files.filter((data: any) => data.isStatus !== "delete")
              .length > 0 && rowHandleObj.commentType === "Employee"
              ? "fileSec"
              : "hide"
          }
        >
          {rowHandleObj.isPopup && rowHandleObj.commentType === "Employee"
            ? rowHandleObj.files.map((file: any, index: number) => {
                return (
                  file.isStatus !== "delete" && (
                    <div className="fileBox">
                      <a className="filename" href={file.ServerRelativeUrl}>
                        <FaFileCircleCheck />
                        {file.FileName}
                      </a>
                      {props.isManager &&
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
            onClick={() => setRowHandleObj({ ...rowHandleObj, isPopup: false })}
            hidden={
              !props.isManager &&
              rowHandleObj.commentType === "Manager" &&
              rowHandleObj.isEdit
                ? false
                : props.isManager &&
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
      {/* <div className="card">
        <Accordion
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {categories.map((items, index) => {
            return (
              <AccordionTab
                header={
                  <span className="flex d-flex justify-content-between align-items-center gap-2 w-full category-sec">
                    <span className="CategoryTitle">{items.GoalCategory}</span>
                    {props.isManager ? (
                      ""
                    ) : (
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
                        {items.values.filter((val: any) => val.isNew).length ===
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
                    )}
                  </span>
                }
              >
                <div className="goalsTable">
                  <DataTable value={items.values} className="p-datatable-sm">
                    <Column
                      className="col1"
                      field="GoalName"
                      header="Goal Name"
                      style={{ width: "30%" }}
                      body={GoalnameBodyTemplate}
                    ></Column>
                    <Column
                      className="col1"
                      field="EmployeeRating"
                      header="Employee Rating"
                      style={{ width: "15%" }}
                      body={EmployeeRatingBodyTemplate}
                    ></Column>
                    <Column
                      className="col1"
                      field="ManagerRating"
                      header="Manager Rating"
                      style={{ width: "15%" }}
                      body={ManagerRatingBodyTemplate}
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
      </div> */}
      {/* {categories.length > 0 ? (
        <div></div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "17px",
            fontWeight: "600",
          }}
        >
          No Data Found
        </div>
      )} */}
      <div className="managerGoal">
        <span>Self Goals</span>
      </div>
      <div className="managerGoalTable" style={{ position: "relative" }}>
        <DataTable value={managerGoals} className="p-datatable-sm">
          <Column
            className="col1"
            field="GoalName"
            header="Goal Name"
            style={{ width: "30%" }}
            body={GoalnameBodyTemplate}
          ></Column>
          <Column
            className="col1"
            field="EmployeeRating"
            header="Employee Rating"
            style={{ width: "15%" }}
            body={EmployeeRatingBodyTemplate}
          ></Column>
          <Column
            className="col1"
            field="ManagerRating"
            header="Manager Rating"
            style={{ width: "15%" }}
            body={ManagerRatingBodyTemplate}
          ></Column>
          <Column
            className="col4"
            header="Action"
            style={{ width: "10%" }}
            body={ActionBodyTemplate}
          ></Column>
        </DataTable>
        {props.isManager ? (
          <div className="addMaganerGoal">
            <GrAdd onClick={(e) => addGoalFunction()} />
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
    </>
  );
};
export default SelfGoals;
