/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */

import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as moment from "moment";
import { MdEditDocument } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { DatePicker } from "@fluentui/react";
import { Toast } from "primereact/toast";
// import styles from "./AdminStyle.module.scss";
import styles from "../PreDefinedGoal/PreDefinedGoalsStyle.module.scss";
import Loader from "../Loader/Loader";
import "../masterStyle.css";

const AdminComponent = (): any => {
  // const rootClass = mergeStyles({
  //   maxWidth: 300,
  //   fontFamily: "Fluent MDL2 Hybrid Icons !important",
  //   selectors: {
  //     "> *": { marginBottom: 15 },
  //     ".icon-95": {
  //       fontFamily: "Fluent MDL2 Hybrid Icons !important",
  //     },
  //     ".root-110": {
  //       fontFamily: "Fluent MDL2 Hybrid Icons !important",
  //     },
  //   },
  // });

  const [masterData, setmasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const toast = React.useRef<Toast>(null);
  console.log(masterData, duplicateData, displayData);

  const getAppraisalList = (): any => {
    sp.web.lists
      .getByTitle("AppraisalCycles")
      .items.get()
      .then((items) => {
        const tempArr: any = [];
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

  const editRowFunctionWithCheck = (rowData: any) => {
    const isAnyRowInEdit = duplicateData.some((item) => item.isRowEdit);
    if (isAnyRowInEdit) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail:
          "Please save or cancel the current row before editing another row",
      });
    } else {
      editRowFunction(rowData);
    }
  };

  const editRowFunction = (data: any): any => {
    const duplicateArr = [...duplicateData];
    const index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
    const tempObj = duplicateArr[index];
    duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
    setDuplicateData([...duplicateArr]);
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
  };

  const goalSubmitFun = (rowData: any): any => {
    setIsLoader(true);
    const duplicateArr = [...duplicateData];
    const index = [...duplicateArr].findIndex(
      (obj: any) => obj.ID === rowData.ID
    );
    const tempObj = duplicateArr[index];
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

  const handleDateSelection = (date: any, id: number, fieldName: any): any => {
    const tempArr = [...duplicateData];
    const index = tempArr.findIndex((obj) => obj.ID === id);
    const tempObj = tempArr[index];
    const currentObj = {
      ID: tempObj.ID,
      Year: tempObj.Year,
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
  };

  const ACNameBodyTemplate = (rowData: any): any => {
    return (
      <div
        style={{
          padding: "9px 0px",
        }}
      >
        {rowData.Year} - {rowData.cycleCategory}
      </div>
    );
  };
  const startDateBodyTemplate = (rowData: any): any => {
    return <div>{moment(rowData.startDate).format("DD-MMM-YYYY")}</div>;
  };

  const endDateBodyTemplate = (rowData: any): any => {
    return <div>{moment(rowData.endDate).format("DD-MMM-YYYY")}</div>;
  };

  const goalsSubmitSDateBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div>
        <DatePicker
          showMonthPickerAsOverlay={true}
          value={rowData.goalsSubmitSDate}
          onSelectDate={(date) =>
            handleDateSelection(date, rowData.ID, "goalsSubmitSDate")
          }
        />
      </div>
    ) : (
      <div>{moment(rowData.goalsSubmitSDate).format("DD-MM-YYYY")}</div>
    );
  };

  const goalsSubmitEDateBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div>
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

  const commentsSubmitSDateBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div>
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

  const commentsSubmitEDateBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div>
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

  const ActionBodyTemplate = (rowData: any): any => {
    const index = duplicateData.findIndex((obj) => obj.ID === rowData.ID);

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
          onClick={(e) => editRowFunctionWithCheck(rowData)}
        />
      </div>
    );
  };

  return isLoader ? (
    <Loader />
  ) : (
    <>
      <Toast ref={toast} />
      <div className="AppraisalCycle">
        <span>APPRAISAL CYCLE</span>
      </div>
      <div className="adminTable">
        <DataTable value={displayData} className="p-datatable-sm">
          <Column
            className="col1"
            field="Year"
            header="Appraisal Year"
            style={{ width: "10%" }}
            body={ACNameBodyTemplate}
          />
          <Column
            className="col1"
            field="startDate"
            header="Cycle start date"
            style={{ width: "10%" }}
            body={startDateBodyTemplate}
          />
          <Column
            className="col1"
            field="endDate"
            header="Cycle end date"
            style={{ width: "10%" }}
            body={endDateBodyTemplate}
          />
          <Column
            className="col1"
            field="goalsSubmitSDate"
            header="goals submit start Date"
            style={{ width: "15%" }}
            body={goalsSubmitSDateBodyTemplate}
          />
          <Column
            className="col1"
            field="goalsSubmitEDate"
            header="goals submit end Date"
            style={{ width: "15%" }}
            body={goalsSubmitEDateBodyTemplate}
          />
          <Column
            className="col1"
            field="commentsSubmitSDate"
            header="Review submit start Date"
            style={{ width: "15%" }}
            body={commentsSubmitSDateBodyTemplate}
          />
          <Column
            className="col1"
            field="commentsSubmitEDate"
            header="Review submit end Date"
            style={{ width: "15%" }}
            body={commentsSubmitEDateBodyTemplate}
          />
          <Column
            className="col4"
            header="Action"
            style={{ width: "10%" }}
            body={ActionBodyTemplate}
          />
        </DataTable>
      </div>
    </>
  );
};

export default AdminComponent;
