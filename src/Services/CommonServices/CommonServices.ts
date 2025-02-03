/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises*/
import { LISTNAMES } from "../../config/config";
import { setCurrentUserDetails } from "../../redux/slices/CommonSlice";
import {
  setMasterCycles,
  setRolesList,
  setUserDetails,
} from "../../redux/slices/HRGoalsSlice";
import SpServices from "../SpServices/SpServices";
import { graph } from "@pnp/graph/presets/all";

export const getCurrentUserDetails = (
  dispatcher: any,
  userEmail: string
): void => {
  SpServices.getAllUsers().then((res: any) => {
    res.forEach((user: any) => {
      if (user.Email === userEmail) {
        dispatcher(
          setCurrentUserDetails({
            userID: user.Id,
            userName: user.Title,
            userEmail: user.Email,
          })
        );
      }
    });
  });
};

export const arrangeWord = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getAppraisalCycles = (dispatcher: any): void => {
  SpServices.SPReadItems({
    Listname: LISTNAMES.AppraisalCycles,
    Select: "*",
  })
    .then((cycle) => {
      const tempArr: any = [];
      cycle.reverse();
      cycle.forEach((res) => {
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
        });
      });
      dispatcher(setMasterCycles([...tempArr]));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUsersDetailsAndRoles = async (dispatcher: any) => {
  try {
    // SpServices.SPReadItems({
    //   Listname: LISTNAMES.EmployeeList,
    //   Select:
    //     "*,Employee/ID,Employee/Title,Employee/EMail,Members/ID,Members/Title,Members/EMail",
    //   Expand: "Employee,Members",
    // }).then((res: any) => {
    //   if (res.length > 0) {
    //     const rolesSet = new Set();
    //     const uniqueArray = res.filter((data: any) => {
    //       if (!rolesSet.has(data.Roles) && data.Roles !== "Admin") {
    //         rolesSet.add(data.Roles);
    //         return true;
    //       }
    //       return false;
    //     });

    //     const rolesArr: any = uniqueArray.map((role: any) => {
    //       return { name: role.Roles, code: role.Roles };
    //     });
    //     console.log(rolesArr);
    //     debugger;
    //     //   setRolesList([...rolesArr]);
    //     dispatcher(setRolesList([...rolesArr]));
    //     const userArr: {
    //       EmployeeName: string;
    //       UserEmail: string;
    //       Role: string;
    //       EmployeeID: number;
    //     }[] = [];
    //     res.forEach((obj: any) => {
    //       if (obj.Roles !== "Admin") {
    //         userArr.push({
    //           EmployeeName: obj.Employee.Title,
    //           UserEmail: obj.Employee.EMail,
    //           Role: obj.Roles,
    //           EmployeeID: obj.Employee.ID,
    //         });
    //       }
    //     });
    //     //   setUsersList([...userArr]);
    //     dispatcher(setUserDetails([...userArr]));
    //     // getAppraisalCycles();
    //   }
    // });
    graph.users
      .top(999)
      .select("*")
      .filter("accountEnabled eq true")
      .get()
      .then((data) => {
        if (data?.length > 0) {
          const rolesSet = new Set();
          const uniqueArray = data.filter((data: any) => {
            if (
              !rolesSet.has(data.jobTitle) &&
              data.jobTitle !== "Admin" &&
              data.jobTitle !== null
            ) {
              rolesSet.add(data.jobTitle);
              return true;
            }
            return false;
          });

          const rolesArr: any = uniqueArray.map((role: any) => {
            return { name: role.jobTitle, code: role.jobTitle };
          });
          dispatcher(setRolesList([...rolesArr]));
          const userArr: {
            EmployeeName: string;
            UserEmail: string;
            Role: string;
            EmployeeID: number;
          }[] = [];
          data.forEach((obj: any) => {
            if (obj.jobTitle !== "Admin") {
              userArr.push({
                EmployeeName: obj.displayName ? obj.displayName : "",
                UserEmail: obj.mail ? obj.mail : "",
                Role: obj.jobTitle ? obj.jobTitle : "",
                EmployeeID: obj.id,
              });
            }
          });
          console.log(userArr, "userArr");
          dispatcher(setUserDetails([...userArr]));
        }
      });
  } catch (error) {
    console.error("Error in updateFolderSequenceNumber: ", error);
  }
};
