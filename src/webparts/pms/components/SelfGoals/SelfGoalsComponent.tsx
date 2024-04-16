import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { HiPencil } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import { GrAdd } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { Rating } from "primereact/rating";
import { FaCommentDots } from "react-icons/fa6";
import "./selfGoals.css";
import styles from "./SelfGoalsStyle.module.scss";

const SelfGoals = (props: any) => {
  const [activeIndex, setActiveIndex] = useState<any>(0);
  const [masterData, setMasterData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryHandleObj, setCategoryHandleObj] = useState<any>({
    ID: null,
    newCategory: "",
    isNew: false,
    isUpdate: false,
  });
  const [duplicateData, setDuplicateData] = useState<any[]>([]);
  const [totalSFGoals, setTotalSFGoals] = useState<any[]>([]);
  const [isPopup, setIsPopup] = useState<any>({
    delPopup: false,
    delIndex: null,
  });
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
  });
  const [rating, setRating] = useState(0);
  const [fixedRating, setFixedRating] = useState(null);

  console.log(masterData, duplicateData, categories);

  const getDetails = () => {
    sp.web.lists
      .getByTitle("SelfGoals")
      .items.select("*", "Employee/Id", "Employee/EMail", "Employee/Title")
      .expand("Employee")
      .get()
      .then((items) => {
        setTotalSFGoals([...items]);
        console.log("items", items);
        const filterData = items.filter((item) => {
          return item.Employee.EMail == props.memberEmail && !item.isDelete;
        });
        const tempArr: any = [];
        let ID = 0;
        const categorizedItems = filterData.reduce((acc: any, obj: any) => {
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
                },
              ],
            });
          }
          return acc;
        }, []);
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
            isRowEdit: false,
            isNew: false,
          });
        });
        setMasterData([...tempArr]);
        setDuplicateData([...tempArr]);
        setCategories([...categorizedItems]);
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
          if (user.Email === props.curUser) {
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
  }, []);

  const categoryHandleFun = (data: any) => {
    let ID = 1;
    let groupedArray = data.reduce((acc: any, obj: any) => {
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
            },
          ],
        });
      }
      return acc;
    }, []);
    setCategories([...groupedArray]);
  };

  const addNewCategory = (condition: boolean) => {
    let tempArray = [...duplicateData];
    let tempCategoryArr = [...categories];
    if (condition) {
      if (categoryHandleObj.newCategory !== "") {
        tempArray.push({
          ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
          GoalCategory: categoryHandleObj.newCategory,
          GoalName: "",
          EmployeeId: "",
          ManagerComments: "",
          EmployeeComments: "",
          ManagerRating: 0,
          EmployeeRating: 0,
          isRowEdit: true,
          isNew: true,
        });
        setDuplicateData([...tempArray]);
        categoryHandleFun([...tempArray]);
        setCategoryHandleObj({
          ...categoryHandleObj,
          newCategory: "",
          isNew: false,
          isUpdate: false,
        });
      }
    } else {
      let index = tempCategoryArr.findIndex(
        (inx) => inx.mainID === categoryHandleObj.ID
      );
      let tempObj = tempCategoryArr[index];
      let categoryGolasArr = tempObj.values;
      if (tempObj.GoalCategory != categoryHandleObj.newCategory) {
        categoryGolasArr.forEach((obj: any) => {
          sp.web.lists
            .getByTitle("SelfGoals")
            .items.getById(obj.ID)
            .update({ GoalCategory: categoryHandleObj.newCategory })
            .then((res) => {
              let duplicateindex = tempArray.findIndex(
                (temp) => temp.ID === obj.ID
              );
              let duplicateObj = tempArray[duplicateindex];
              tempArray[duplicateindex] = {
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
              setMasterData([...tempArray]);
              setDuplicateData([...tempArray]);
              categoryHandleFun([...tempArray]);
            })
            .catch((err) => console.log(err));
        });
      }
    }
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
        .getByTitle("SelfGoals")
        .items.getById(obj.ID)
        .update({ isDelete: true })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    });
  };

  const addGoalFunction = (ind: number) => {
    let tempArrVal = categories;
    let index = [...tempArrVal].findIndex((obj) => obj.mainID == ind + 1);
    let data = tempArrVal[index];
    setDuplicateData([
      ...duplicateData,
      {
        ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        GoalCategory: data.GoalCategory,
        EmployeeId: "",
        ManagerComments: "",
        EmployeeComments: "",
        ManagerRating: 0,
        EmployeeRating: 0,
      },
    ]);
    categoryHandleFun([
      ...duplicateData,
      {
        ID: Math.max(...totalSFGoals.map((o) => o.ID)) + 1,
        GoalName: "",
        isRowEdit: true,
        isNew: true,
        GoalCategory: data.GoalCategory,
        EmployeeId: "",
        ManagerComments: "",
        EmployeeComments: "",
        ManagerRating: 0,
        EmployeeRating: 0,
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

  const onChangeHandleFun = (value: any, type: string, id: number) => {
    let tempArrvalues = duplicateData.map((obj) => {
      if (obj.ID == id) {
        if (type === "GoalName") {
          obj.GoalName = value;
          return obj;
        }
        if (type === "Manager") {
          obj.ManagerComments = value;
          setRowHandleObj({
            ...rowHandleObj,
            comment: value,
          });

          return obj;
        }
        if (type === "Employee") {
          obj.EmployeeComments = value;
          setRowHandleObj({
            ...rowHandleObj,
            comment: value,
          });
          return obj;
        }
        if (type === "EmployeeRating") {
          obj.EmployeeRating = (value+1)/2;
          return obj;
        }
        if (type === "ManagerRating") {
          obj.ManagerRating = value;
          return obj;
        }
      } else {
        return obj;
      }
    });
    categoryHandleFun([...tempArrvalues]);
  };
  const GoalnameBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <InputTextarea
        value={rowData.GoalName}
        rows={2}
        cols={30}
        onChange={(e) =>
          onChangeHandleFun(e.target.value, "GoalName", rowData.ID)
        }
        disabled={props.isManager ? true : false}
      />
    ) : (
      <div
        style={{
          padding: "8px 0px 8px 15px",
          fontFamily: "Roboto, Arial, Helvetica, sans-serif",
          color: "#64728c",
          fontSize: "15px",
          width: "100%",
        }}
      >
        {rowData.GoalName}
      </div>
    );
  };

  const goalSubmitFun = (data: any) => {
    let index = [...duplicateData].findIndex((obj) => obj.ID === data.ID);
    let tempObj = duplicateData[index];
    let addObj: any = {
      GoalName: tempObj.GoalName,
      GoalCategory: tempObj.GoalCategory,
      ManagerComments: tempObj.ManagerComments,
      EmployeeComments: tempObj.EmployeeComments,
      ManagerRating: tempObj.ManagerRating,
      EmployeeRating: tempObj.EmployeeRating,
    };
    if (data.isNew) {
      sp.web.lists
        .getByTitle("SelfGoals")
        .items.add({
          GoalName: tempObj.GoalName,
          GoalCategory: tempObj.GoalCategory,
          EmployeeId: assignUserObj.userID,
          ManagerComments: tempObj.ManagerComments,
          EmployeeComments: tempObj.EmployeeComments,
          ManagerRating: tempObj.ManagerRating,
          EmployeeRating: tempObj.EmployeeRating,
        })
        .then((res) => {
          let duplicateArr = [...duplicateData];
          duplicateArr[index] = {
            ...tempObj,
            [`${"isRowEdit"}`]: false,
            [`${"isNew"}`]: false,
          };
          setTotalSFGoals([...totalSFGoals, tempObj]);
          setDuplicateData([...duplicateArr]);
          setMasterData([...duplicateArr]);
          categoryHandleFun([...duplicateArr]);
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

  const editRowFunction = (data: any) => {
    let duplicateArr = [...duplicateData];
    let index = [...duplicateArr].findIndex((obj: any) => obj.ID === data.ID);
    let tempObj = duplicateArr[index];
    duplicateArr[index] = { ...tempObj, [`${"isRowEdit"}`]: true };
    setDuplicateData([...duplicateArr]);
    categoryHandleFun([...duplicateArr]);
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
        categoryHandleFun([...delArray]);
        setDuplicateData([...delArray]);
        setMasterData([...delArray]);
      })
      .catch((err) => console.log(err));
  };

  const ActionBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
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
        {props.isManager ? (
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

  

  const handleMouseOver = (value :any) => {
    if (fixedRating === null) {
      setRating(value);
    }
    else if(fixedRating !== null){
      setRating(value);
    }
  };

  const handleMouseOut = () => {
    if (fixedRating === null) {
      setRating(0);
    }
  };

  const handleClick = (value :any) => {
    if (fixedRating === null) {
      setFixedRating(value);
      setRating(value);
    }
    else if(fixedRating !== null){
      setFixedRating(value);
    }
    
  };

  console.log(rating)

  const EmployeeRatingBodyTemplate = (rowData: any) => {
    // const number = 4.5;
    const ratingValues = [0.5,1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <div className="card flex justify-content-center">
        <Rating
          value={rowData.EmployeeRating}
          onChange={(e) =>
            onChangeHandleFun(e.target.value, "EmployeeRating", rowData.ID)
          }
          disabled={props.isManager}
          stars={5}
          cancel={false}
        />
         <div className="rating-container" onMouseOut={handleMouseOut}>
         {ratingValues.map((value :any, index) => (
        <div>
        <a
          key={index}
          href="#"
          className={`rating-star ${value <= rowData.EmployeeRating ? 'active' : ''} ${value <= rating ? 'active' : ''} ${![1,2,3,4,5].includes(value)? 'noPadding' : ''}`}
          onMouseOver={() => handleMouseOver(value)}
          onClick={() => {onChangeHandleFun(index, "EmployeeRating", rowData.ID)}}
        >
          <span></span>
        </a>
        </div>
      ))}
    </div>
      <span className="rating-value">{rowData.EmployeeRating}</span>
      </div>
    ) : (
      <div className="card flex justify-content-center">
        <Rating
          value={rowData.EmployeeRating}
          stars={5}
          disabled
          cancel={false}
        />
         <div className="rating-container" onMouseOut={handleMouseOut}>
         {ratingValues.map((value, index) => (
        <div>
        <a
          key={index}
          href="#"
          className={`rating-star ${value <= rowData.EmployeeRating ? 'active' : ''} ${![1,2,3,4,5].includes(value)? 'noPadding' : ''}`}
          // onMouseOver={() => handleMouseOver(value)}
          onClick={() => handleClick(value)}
        >
          <span></span>
        </a>
        </div>
      ))}
    </div>
    
    <span className="rating-value">{rowData.EmployeeRating}</span>
      </div>
    );
  };

  const EmployeeCommentsBodyTemplate = (rowData: any) => {
    return (
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
          })
        }
      />
    );
  };

  const ManagerRatingBodyTemplate = (rowData: any) => {
    let currentObj = duplicateData.filter((obj) => obj.ID == rowData.ID);
    return currentObj[0].isRowEdit ? (
      <div className="card flex justify-content-center">
        <Rating
          value={rowData.ManagerRating}
          onChange={(e) =>
            onChangeHandleFun(e.target.value, "ManagerRating", rowData.ID)
          }
          disabled={!props.isManager}
          stars={5}
          cancel={false}
        />
      </div>
    ) : (
      <div className="card flex justify-content-center">
        <Rating
          value={rowData.ManagerRating}
          stars={5}
          disabled
          cancel={false}
        />
      </div>
    );
  };

  const ManagerCommentsBodyTemplate = (rowData: any) => {
    return (
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
    );
  };

  return (
    <>
      {props.isManager ? (
        ""
      ) : (
        <div className={styles.addCategory}>
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
          ) : (
            <Button
              label="New Category"
              onClick={(e) =>
                setCategoryHandleObj({ ...categoryHandleObj, isNew: true })
              }
            />
          )}
        </div>
      )}
      <div className="card">
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
                  <Dialog
                    header={rowHandleObj.commentType + " Comments"}
                    visible={rowHandleObj.isPopup}
                    style={{ width: "50vw" }}
                    onHide={() =>
                      setRowHandleObj({ ...rowHandleObj, isPopup: false })
                    }
                  >
                    <div>
                      <InputTextarea
                        style={{ width: "80%" }}
                        rows={4}
                        cols={30}
                        value={rowHandleObj.comment}
                        disabled={
                          props.isManager &&
                          rowHandleObj.commentType === "Manager" &&
                          rowHandleObj.isEdit
                            ? false
                            : !props.isManager &&
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
                    <div className={styles.dialogFooter}>
                      <Button
                        className={styles.submitBtn}
                        onClick={() =>
                          setRowHandleObj({ ...rowHandleObj, isPopup: false })
                        }
                        hidden={
                          props.isManager &&
                          rowHandleObj.commentType === "Manager" &&
                          rowHandleObj.isEdit
                            ? false
                            : !props.isManager &&
                              rowHandleObj.commentType === "Employee" &&
                              rowHandleObj.isEdit
                            ? false
                            : true
                        }
                        label="Submit"
                        severity="success"
                      />
                      <Button
                        className={styles.cancelBtn}
                        onClick={() =>
                          setRowHandleObj({ ...rowHandleObj, isPopup: false })
                        }
                        text
                        label="cancel"
                      ></Button>
                    </div>
                  </Dialog>
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
                      field="EmployeeComments"
                      header="Employee Comments"
                      style={{ width: "15%" }}
                      body={EmployeeCommentsBodyTemplate}
                    ></Column>
                    <Column
                      className="col1"
                      field="ManagerRating"
                      header="Manager Rating"
                      style={{ width: "15%" }}
                      body={ManagerRatingBodyTemplate}
                    ></Column>
                    <Column
                      className="col1"
                      field="ManagerComments"
                      header="Manager Comments"
                      style={{ width: "15%" }}
                      body={ManagerCommentsBodyTemplate}
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
      )}
    </>
  );
};
export default SelfGoals;
