/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
// import { HiPencil } from "react-icons/hi2";
import { MdEditDocument } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { FaCommentDots } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FileUpload } from "primereact/fileupload";
import { RiInformationFill } from "react-icons/ri";
import styles from "./SelfGoalsStyle.module.scss";
import "../masterStyle.css";
import Loader from "../Loader/Loader";

const SelfGoals = (props: any) => {
  const toast = useRef<Toast>(null);
  const appraisalCycleID = props.appraisalCycle.currentCycle;
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [managerGoals, setManagerGoals] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
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
  const [goalDelPopup, setGoalDelPopup] = useState<any>({
    delPopup: false,
    delGoalId: null,
  });

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
      .filter(`AppraisalCycleLookupId eq '${appraisalCycleID}'`)
      .get()
      .then((items) => {
        const filterData = items.filter(
          (item) =>
            props.EmployeeEmail === item.AssignTo.EMail &&
            !item.isDelete &&
            !item.isDeleteHR
        );
        const tempArr: any = [];
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
        setIsLoader(false);
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
    setIsLoader(true);
    init();
    setManagerGoals([]);
    setDuplicateData([]);
  }, [props]);
  const addGoalFunction = (): void => {
    const duplicateArr = [...duplicateData];
    const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
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
          GoalCategory: "SelfGoal",
          EmployeeId: "",
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
    const duplicateArr = [...duplicateData];
    const index = [...duplicateArr].findIndex((obj) => obj.ID === data.ID);
    const tempObj = duplicateArr[index];
    const addObj: any = {
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
      ManagerComments: tempObj.ManagerComments,
      EmployeeComments: tempObj.EmployeeComments,
      ManagerRating: tempObj.ManagerRating,
      EmployeeRating: tempObj.EmployeeRating,
    };
    if (data.isNew && tempObj.GoalName !== "") {
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
          AppraisalCycleLookupId: appraisalCycleID,
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
    } else if (tempObj.GoalName !== "") {
      sp.web.lists
        .getByTitle("SelfGoals")
        .items.getById(tempObj.ID)
        .update(addObj)
        .then((res) => {
          const duplicateArr = [...duplicateData];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
          };
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          setManagerGoals([...duplicateArr]);

          const newFiles = tempObj.AttachmentFiles.filter(
            (fill: any) => fill.isStatus === "new"
          ).map((file: any) => {
            return {
              name: file.FileName,
              content: file.content,
            };
          });

          const deleteFiles = tempObj.AttachmentFiles.filter(
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
                  const duplicateArr = [...duplicateData];
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
                const duplicateArr = [...duplicateData];
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
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please enter goal name",
      });
    }
  };
  const goalDeleteFun = () => {
    const duplicateArr = [...duplicateData];
    const index = [...duplicateArr].findIndex(
      (obj) => obj.ID === goalDelPopup.delGoalId
    );
    const delObj = duplicateArr[index];
    const delArray = duplicateArr.filter(
      (items) => items.ID !== goalDelPopup.delGoalId
    );
    sp.web.lists
      .getByTitle("SelfGoals")
      .items.getById(delObj.ID)
      .update({ isDelete: true })
      .then((res) => {
        setManagerGoals([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
        setGoalDelPopup({
          ...goalDelPopup,
          delPopup: false,
          delGoalId: null,
        });
      })
      .catch((err) => console.log(err));
  };
  const editCancelFun = (data: any) => {
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
    setManagerGoals([...duplicateArr]);
  };
  const editRowFunction = (data: any) => {
    const duplicateArr = [...duplicateData];
    const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
    if (isEdit.length > 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail:
          "Please save or cancel the current row before editing another row",
      });
    } else {
      const index = [...duplicateArr].findIndex(
        (obj: any) => obj.ID === data.ID
      );
      const tempObj = duplicateArr[index];
      duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
      setDuplicateData([...duplicateArr]);
      setManagerGoals([...duplicateArr]);
    }
  };
  const onChangeHandleFun = (value: any, type: string, id: number) => {
    const duplicateArr = duplicateData;
    const index = duplicateArr.findIndex((obj: any) => obj.ID === id);
    const orignalObj = duplicateArr[index];
    const temp: any = [...orignalObj.AttachmentFiles];

    const editObj = {
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
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
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
        <div className="goalName">
          <RiInformationFill />
          {rowData.GoalName}
        </div>
      )
    ) : (
      <div className="goalName">{rowData.GoalName}</div>
    );
  };
  const EmployeeRatingBodyTemplate = (rowData: any) => {
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
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
                    props.isManager && props.appraisalCycle.submitComments
                      ? "show"
                      : "disabled"
                  }`}
                  onMouseOver={() => handleMouseOver(value, "Employee")}
                  onClick={() => {
                    onChangeHandleFun(index, "EmployeeRating", rowData.ID);
                  }}
                >
                  <span />
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.EmployeeRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.EmployeeComments === ""
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
                  <span />
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.EmployeeRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.EmployeeComments === ""
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
                <span />
              </a>
            ))}
          </div>
          <span className="rating-value">{rowData.EmployeeRating}</span>
        </div>
        <FaCommentDots
          className={
            rowData.EmployeeComments === ""
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
    );
  };
  const ManagerRatingBodyTemplate = (rowData: any) => {
    const ratingValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
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
                    !props.isManager && props.appraisalCycle.submitComments
                      ? "show"
                      : "disabled"
                  }`}
                  onMouseOver={() => handleMouseOver(value, "manger")}
                  onClick={() => {
                    onChangeHandleFun(index, "ManagerRating", rowData.ID);
                  }}
                >
                  <span />
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.ManagerRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.ManagerComments === ""
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
                  <span />
                </a>
              ))}
            </div>
            <span className="rating-value">{rowData.ManagerRating}</span>
          </div>
          <FaCommentDots
            className={
              rowData.ManagerComments === ""
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
                <span />
              </a>
            ))}
          </div>
          <span className="rating-value">{rowData.ManagerRating}</span>
        </div>
        <FaCommentDots
          className={
            rowData.ManagerComments === "" ? "commentIcon" : "filledCommentIcon"
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
        <div>
          <MdEditDocument
            className={styles.editIcon}
            onClick={(e) => editRowFunction(rowData)}
          />
          {props.isManager &&
          props.appraisalCycle.goalSubmit &&
          rowData.GoalCategory === "SelfGoal" ? (
            <MdDelete
              className={styles.cancelIcon}
              onClick={() => {
                const duplicateArr = [...duplicateData];
                const isEdit = duplicateArr.filter((edit) => edit.isRowEdit);
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
        {!props.isManager ? (
          ""
        ) : (
          <MdDelete
            className={styles.cancelIcon}
            onClick={() => goalDeleteFun()}
          />
        )}
      </div>
    );
  };

  const fileDeleteFunction = (ind: number) => {
    const duplicateArr = [...duplicateData];
    const index = [...duplicateArr].findIndex(
      (obj: any) => obj.ID === rowHandleObj.ID
    );
    const tempObj = duplicateArr[index];
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
    const masterArr = [...masterData];
    const index = masterArr.findIndex((obj) => obj.ID === rowHandleObj.ID);
    const orignalObj = masterArr[index];
    const changeArray = duplicateData.map((obj) => {
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
    // setMasterData([...changeArray]);
    //  categoryHandleFun([...changeArray]);
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
          <Toast ref={toast} />
          <div>
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
                    !props.isManager &&
                    props.appraisalCycle.submitComments &&
                    rowHandleObj.commentType === "Manager" &&
                    rowHandleObj.isEdit
                      ? false
                      : props.isManager &&
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
                {props.isManager &&
                props.appraisalCycle.submitComments &&
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
                            {props.isManager &&
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
                    setRowHandleObj({ ...rowHandleObj, isPopup: false })
                  }
                  hidden={
                    !props.isManager &&
                    props.appraisalCycle.submitComments &&
                    rowHandleObj.commentType === "Manager" &&
                    rowHandleObj.isEdit
                      ? false
                      : props.isManager &&
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
                />
              </div>
            </Dialog>
            <Dialog
              header="Delete"
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
              <div>
                <p>Do you want to delete this category?</p>
                <Button
                  onClick={() => goalDeleteFun()}
                  icon="pi pi-check"
                  label="Confirm"
                  className="mr-2"
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
                  icon="pi pi-times"
                  label="cancel"
                />
              </div>
            </Dialog>
          </div>
          {/* <div className="managerGoal">
            <span>Self Goals</span>
          </div> */}
          {managerGoals.length > 0 ||
          (props.isManager && props.appraisalCycle.goalSubmit) ? (
            <></>
          ) : (
            <div className="noDataMsg" style={{ paddingTop: "20px" }}>
              there are no self goals set at the moment
            </div>
          )}

          {managerGoals.length > 0 ||
          (props.isManager && props.appraisalCycle.goalSubmit) ? (
            <div>
              <div
                className="managerGoalTable"
                style={{
                  position: "relative",
                  marginTop:
                    props.isManager && props.appraisalCycle.goalSubmit
                      ? "35px"
                      : "20px",
                }}
              >
                <DataTable value={managerGoals} className="p-datatable-sm">
                  <Column
                    className="col1"
                    field="GoalName"
                    header="Goal Name"
                    style={{ width: "50%" }}
                    body={GoalnameBodyTemplate}
                  />
                  {props.appraisalCycle.submitComments ? (
                    <Column
                      className="col1"
                      field="EmployeeRating"
                      header="Employee Rating"
                      style={{ width: "20%" }}
                      body={EmployeeRatingBodyTemplate}
                    />
                  ) : null}
                  {props.appraisalCycle.submitComments ? (
                    <Column
                      className="col1"
                      field="ManagerRating"
                      header="Manager Rating"
                      style={{ width: "20%" }}
                      body={ManagerRatingBodyTemplate}
                    />
                  ) : null}

                  {props.appraisalCycle.submitComments ||
                  (props.appraisalCycle.goalSubmit && props.isManager) ? (
                    <Column
                      className="col4"
                      header="Action"
                      style={{ width: "10%" }}
                      body={ActionBodyTemplate}
                    />
                  ) : null}
                </DataTable>
                {props.isManager &&
                props.appraisalCycle.goalSubmit &&
                !duplicateData.some((data) => data.isNew) ? (
                  <div
                    className="addMaganerGoal"
                    onClick={(e) => addGoalFunction()}
                  >
                    <GrAdd />
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
export default SelfGoals;
