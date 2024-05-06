import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as moment from "moment";
import { MdEditDocument } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { DatePicker, mergeStyles } from "@fluentui/react";
// import styles from "./AdminStyle.module.scss";
import styles from "../PreDefinedGoal/PreDefinedGoalsStyle.module.scss";
import Loader from "../Loader/Loader";

const AdminComponent = () => {
  const rootClass = mergeStyles({
    maxWidth: 300,
    fontFamily: "Fluent MDL2 Hybrid Icons !important",
    selectors: {
      "> *": { marginBottom: 15 },
      ".icon-95": {
        fontFamily: "Fluent MDL2 Hybrid Icons !important",
      },
      ".root-110": {
        fontFamily: "Fluent MDL2 Hybrid Icons !important",
      },
    },
  });

  // const onFormatDate = (date?: Date): string => {
  //   return !date
  //     ? ""
  //     : date.getDate() +
  //         "/" +
  //         (date.getMonth() + 1) +
  //         "/" +
  //         (date.getFullYear() % 100);
  // };

  const [masterData, setmasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  // const [updateDatas, setUpdateDatas] = useState<any>({
  //   Id: null,
  //   commentsSubmitSDate: "",
  //   commentsSubmitEDate: "",
  //   goalsSubmitSDate: "",
  //   goalsSubmitEDate: "",
  // });
  //   const [date, setDate] = useState<any>(null);
  console.log(masterData, duplicateData, displayData);

  const getAppraisalList = () => {
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.get()
      .then((items) => {
        let tempArr: any = [];
        items.forEach((res) => {
          tempArr.push({
            ID: res.ID,
            Year: res.Title,
            cycleCategory: res.cycleCategory,
            startDate: res.startDate,
            endDate: res.endDate,
            commentsSubmitSDate: new Date(res.commentsSubmitSDate),
            commentsSubmitEDate: new Date(res.commentsSubmitEDate),
            goalsSubmitSDate: new Date(res.goalsSubmitSDate),
            goalsSubmitEDate: new Date(res.goalsSubmitEDate),
            isRowEdit: false,
          });
        });
        setDuplicateData([...tempArr]);
        setDisplayData([...tempArr]);
        setmasterData([...tempArr]);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAppraisalList();
  }, []);

  const editRowFunction = (data: any) => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
    setDuplicateData([...duplicateArr]);
    // setUpdateDatas({
    //   Id: tempObj.ID,
    //   commentsSubmitSDate: moment(tempObj.commentsSubmitSDate).format(
    //     "DD-MMM-YYYY"
    //   ),
    //   commentsSubmitEDate: moment(tempObj.commentsSubmitEDate).format(
    //     "DD-MMM-YYYY"
    //   ),
    //   goalsSubmitSDate: moment(tempObj.goalsSubmitSDate).format("DD-MMM-YYYY"),
    //   goalsSubmitEDate: moment(tempObj.goalsSubmitEDate).format("DD-MMM-YYYY"),
    // });
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
  };

  const goalSubmitFun = (rowData: any) => {
    setIsLoader(true);
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex(
      (obj: any) => obj.ID === rowData.ID
    );
    let tempObj = duplicateArr[index];
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.getById(rowData.ID)
      .update({
        commentsSubmitSDate: moment(tempObj.commentsSubmitSDate).format(
          "DD-MMM-YYYY"
        ),
        commentsSubmitEDate: moment(tempObj.commentsSubmitEDate).format(
          "DD-MMM-YYYY"
        ),
        goalsSubmitSDate: moment(tempObj.goalsSubmitSDate).format(
          "DD-MMM-YYYY"
        ),
        goalsSubmitEDate: moment(tempObj.goalsSubmitEDate).format(
          "DD-MMM-YYYY"
        ),
      })
      .then((res) => {
        duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: false };
        setDuplicateData([...duplicateArr]);
        setDisplayData([...duplicateArr]);
        setmasterData([...duplicateArr]);
        setIsLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const goalSubmitFun = (rowData: any) => {
  //   sp.web.lists
  //     .getByTitle("AppraisalCycles")
  //     .items.getById(updateDatas.Id)
  //     .update({
  //       commentsSubmitSDate: updateDatas.commentsSubmitSDate
  //         ? updateDatas.commentsSubmitSDate
  //         : "",
  //       commentsSubmitEDate: updateDatas.commentsSubmitEDate
  //         ? updateDatas.commentsSubmitEDate
  //         : "",
  //       goalsSubmitSDate: updateDatas.goalsSubmitSDate
  //         ? updateDatas.goalsSubmitSDate
  //         : "",
  //       goalsSubmitEDate: updateDatas.goalsSubmitEDate
  //         ? updateDatas.goalsSubmitEDate
  //         : "",
  //     })
  //     .then((res) => {
  //       masterData.forEach((obj) => {
  //         if (obj.ID == updateDatas.Id) {
  //           (obj.commentsSubmitSDate = updateDatas.commentsSubmitSDate
  //             ? updateDatas.commentsSubmitSDate
  //             : ""),
  //             (obj.commentsSubmitEDate = updateDatas.commentsSubmitEDate
  //               ? updateDatas.commentsSubmitEDate
  //               : ""),
  //             (obj.goalsSubmitSDate = updateDatas.goalsSubmitSDate
  //               ? updateDatas.goalsSubmitSDate
  //               : ""),
  //             (obj.goalsSubmitEDate = updateDatas.goalsSubmitEDate
  //               ? updateDatas.goalsSubmitEDate
  //               : "");
  //         }
  //       });
  //       displayData.forEach((obj) => {
  //         if (obj.ID == updateDatas.Id) {
  //           (obj.commentsSubmitSDate = updateDatas.commentsSubmitSDate
  //             ? updateDatas.commentsSubmitSDate
  //             : ""),
  //             (obj.commentsSubmitEDate = updateDatas.commentsSubmitEDate
  //               ? updateDatas.commentsSubmitEDate
  //               : ""),
  //             (obj.goalsSubmitSDate = updateDatas.goalsSubmitSDate
  //               ? updateDatas.goalsSubmitSDate
  //               : ""),
  //             (obj.goalsSubmitEDate = updateDatas.goalsSubmitEDate
  //               ? updateDatas.goalsSubmitEDate
  //               : "");
  //         }
  //       });

  //       let duplicateArr = [...duplicateData];
  //       let indexMain = [...masterData].findIndex((obj: any) => obj.ID === rowData.ID);
  //       let tempObjMain = masterData[indexMain];
  //       if (tempObjMain) {
  //         let index = [...duplicateArr].findIndex((obj: any) => obj.ID === rowData.ID);
  //         duplicateArr[index] = tempObjMain;
  //       } else {
  //         duplicateArr = duplicateArr.filter((obj) => obj.ID !== rowData.ID);
  //       }
  //       setDuplicateData([...duplicateArr]);

  //       // setUpdateDatas({
  //       //   Id: null,
  //       //   commentsSubmitSDate: "",
  //       //   commentsSubmitEDate: "",
  //       //   goalsSubmitSDate: "",
  //       //   goalsSubmitEDate: "",
  //       // });
  //     })
  //     .catch((err: any) => {
  //       console.log("err", err);
  //     });
  // };

  const handleDateSelection = (date: any, id: number, fieldName: any) => {
    let tempArr = [...duplicateData];
    let index = tempArr.findIndex((obj) => obj.ID === id);
    let tempObj = tempArr[index];
    let currentObj = {
      ID: tempObj.ID,
      Year: tempObj.Title,
      cycleCategory: tempObj.cycleCategory,
      startDate: tempObj.startDate,
      endDate: tempObj.endDate,
      commentsSubmitSDate:
        fieldName === "commentsSubmitSDate"
          ? date
          : tempObj.commentsSubmitSDate,
      commentsSubmitEDate:
        fieldName === "commentsSubmitEDate"
          ? date
          : tempObj.commentsSubmitEDate,
      goalsSubmitSDate:
        fieldName === "goalsSubmitSDate" ? date : tempObj.goalsSubmitSDate,
      goalsSubmitEDate:
        fieldName === "goalsSubmitEDate" ? date : tempObj.goalsSubmitEDate,
      isRowEdit: tempObj.isRowEdit,
    };
    tempArr[index] = currentObj;
    setDuplicateData([...tempArr]);
    console.log(duplicateData, "DuplicateDatas", currentObj, "currentObj");
    // const sample: any = { ...updateDatas };
    // sample[fieldName] = moment(date).format("DD-MMM-YYYY");
  };

  const ACNameBodyTemplate = (rowData: any) => {
    return (
      <div>
        {rowData.Year} - {rowData.cycleCategory}
      </div>
    );
  };
  const startDateBodyTemplate = (rowData: any) => {
    return <div>{moment(rowData.startDate).format("DD-MMM-YYYY")}</div>;
  };

  const endDateBodyTemplate = (rowData: any) => {
    return <div>{moment(rowData.endDate).format("DD-MMM-YYYY")}</div>;
  };

  const goalsSubmitSDateBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div className={rootClass}>
        <DatePicker
          showMonthPickerAsOverlay={true}
          value={rowData.commentsSubmitSDate}
          onSelectDate={(date) =>
            handleDateSelection(date, rowData.ID, "goalsSubmitSDate")
          }
        />
      </div>
    ) : (
      <div>{moment(rowData.goalsSubmitSDate).format("DD-MM-YYYY")}</div>
    );
  };

  const goalsSubmitEDateBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div className={rootClass}>
        <DatePicker
          showMonthPickerAsOverlay={true}
          value={rowData.goalsSubmitEDate}
          onSelectDate={(date) =>
            handleDateSelection(date, rowData.ID, "goalsSubmitEDate")
          }
        />
      </div>
    ) : (
      <div>{moment(rowData.goalsSubmitEDate).format("DD-MM-YYYY")}</div>
    );
  };

  const commentsSubmitSDateBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div className={rootClass}>
        <DatePicker
          showMonthPickerAsOverlay={true}
          value={rowData.commentsSubmitSDate}
          onSelectDate={(date) =>
            handleDateSelection(date, rowData.ID, "commentsSubmitSDate")
          }
        />
      </div>
    ) : (
      <div>{moment(rowData.commentsSubmitSDate).format("DD-MM-YYYY")}</div>
    );
  };

  const commentsSubmitEDateBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div className={rootClass}>
        <DatePicker
          showMonthPickerAsOverlay={true}
          value={rowData.commentsSubmitEDate}
          onSelectDate={(date) =>
            handleDateSelection(date, rowData.ID, "commentsSubmitEDate")
          }
        />
      </div>
    ) : (
      <div>{moment(rowData.commentsSubmitEDate).format("DD-MM-YYYY")}</div>
    );
  };

  const ActionBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
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
      </div>
    );
  };

  return isLoader ? (
    <Loader />
  ) : (
    <div style={{ fontFamily: "Fluent MDL2 Hybrid Icons" }}>
      <DataTable value={displayData} className="p-datatable-sm">
        <Column
          className="col1"
          field="Year"
          header="Appraisal Year"
          style={{ width: "10%" }}
          body={ACNameBodyTemplate}
        ></Column>
        <Column
          className="col1"
          field="startDate"
          header="Cycle start date"
          style={{ width: "10%" }}
          body={startDateBodyTemplate}
        ></Column>
        <Column
          className="col1"
          field="endDate"
          header="Cycle end date"
          style={{ width: "10%" }}
          body={endDateBodyTemplate}
        ></Column>
        <Column
          className="col1"
          field="goalsSubmitSDate"
          header="goals submission start Date"
          style={{ width: "15%" }}
          body={goalsSubmitSDateBodyTemplate}
        ></Column>
        <Column
          className="col1"
          field="goalsSubmitEDate"
          header="goals submission end Date"
          style={{ width: "15%" }}
          body={goalsSubmitEDateBodyTemplate}
        ></Column>
        <Column
          className="col1"
          field="commentsSubmitSDate"
          header="Review submission start date"
          style={{ width: "15%" }}
          body={commentsSubmitSDateBodyTemplate}
        ></Column>
        <Column
          className="col1"
          field="commentsSubmitEDate"
          header="Review submission end date"
          style={{ width: "15%" }}
          body={commentsSubmitEDateBodyTemplate}
        ></Column>
        <Column
          className="col4"
          header="Action"
          style={{ width: "10%" }}
          body={ActionBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};

export default AdminComponent;
