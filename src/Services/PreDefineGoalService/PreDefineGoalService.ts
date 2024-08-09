/* eslint-disable no-unused-expressions */
/* eslint-disable no-debugger */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises*/
import { LISTNAMES } from "../../config/config";
// import { setCurrentUserDetails } from "../../redux/slices/CommonSlice";
import SpServices from "../SpServices/SpServices";

export const getCurrentUserGoals = (ACId: number, userDetails: any): void => {
  SpServices.SPReadItems({
    Listname: LISTNAMES.PredefinedGoals,
    Select:
      "*,AssignTo/EMail,AssignTo/Id,AssignTo/Title,Attachments,AttachmentFiles",
    Expand: "AssignTo,AttachmentFiles",
    Filter: [
      {
        FilterKey: "AppraisalCycleLookupId",
        Operator: "eq",
        FilterValue: ACId,
      },
      {
        FilterKey: "AssignToId",
        Operator: "eq",
        FilterValue: userDetails.userID,
      },
      {
        FilterKey: "isDelete",
        Operator: "eq",
        FilterValue: 1,
      },
      {
        FilterKey: "isDeleteHR",
        Operator: "eq",
        FilterValue: 1,
      },
    ],
  }).then((res: any) => {
    console.log(res);
  });
};
