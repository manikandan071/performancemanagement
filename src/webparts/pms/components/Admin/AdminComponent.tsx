import * as React from "react";
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import * as moment from "moment";
import { MdEditDocument } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import {
  DatePicker,
  //   DayOfWeek,
  //   Dropdown,
  //   IDropdownOption,
  mergeStyles,
  defaultDatePickerStrings,
} from "@fluentui/react";
// import styles from "./AdminStyle.module.scss";
import styles from "../PreDefinedGoal/PreDefinedGoalsStyle.module.scss";

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

  const onFormatDate = (date?: Date): string => {
    return !date
      ? ""
      : date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          (date.getFullYear() % 100);
  };

  const [masterData, setmasterData] = useState<any[]>([]);
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  //   const [date, setDate] = useState<any>(null);
  console.log(masterData, duplicateData);

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
            commentsSubmitSDate: res.commentsSubmitSDate,
            commentsSubmitEDate: res.commentsSubmitEDate,
            goalsSubmitSDate: res.goalsSubmitSDate,
            goalsSubmitEDate: res.goalsSubmitEDate,
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

  const ACNameBodyTemplate = (rowData: any) => {
    return (
      <div>
        {rowData.Year} - {rowData.cycleCategory}
      </div>
    );
  };
  const startDateBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div className={rootClass}>
        <DatePicker
          placeholder="Select a date..."
          ariaLabel="Select a date"
          showMonthPickerAsOverlay={true}
          formatDate={onFormatDate}
          strings={defaultDatePickerStrings}
        />
      </div>
    ) : (
      <div>{moment(rowData.startDate).format("DD-MMM-YYYY")}</div>
    );
  };
  const endDateBodyTemplate = (rowData: any) => {
    return <div>{moment(rowData.endDate).format("DD-MMM-YYYY")}</div>;
  };
  const goalsSubmitSDateBodyTemplate = (rowData: any) => {
    return <div>{moment(rowData.goalsSubmitSDate).format("DD-MM-YYYY")}</div>;
  };
  const goalsSubmitEDateBodyTemplate = (rowData: any) => {
    return (
      <div>{moment(rowData.commentsSubmitEDate).format("DD-MM-YYYY")}</div>
    );
  };
  const commentsSubmitSDateBodyTemplate = (rowData: any) => {
    return (
      <div>{moment(rowData.commentsSubmitSDate).format("DD-MM-YYYY")}</div>
    );
  };
  const commentsSubmitEDateBodyTemplate = (rowData: any) => {
    return <div>{moment(rowData.goalsSubmitEDate).format("DD-MM-YYYY")}</div>;
  };
  const ActionBodyTemplate = (rowData: any) => {
    let index = duplicateData.findIndex((obj) => obj.ID == rowData.ID);
    return duplicateData[index].isRowEdit ? (
      <div>
        <IoMdCheckmark
          className={styles.submitIcon}
          //   onClick={() => goalSubmitFun(rowData)}
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

  return (
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
