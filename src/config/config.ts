const CONFIG = {
  webURL: "https://chandrudemo.sharepoint.com/sites/ReadifyEM",
  tenantURL: "https://chandrudemo.sharepoint.com",
};

const LISTNAMES = {
  AppraisalCycles: "AppraisalCycles",
  EmployeeList: "EmployeeList",
  HrGoals: "HrGoals",
  PredefinedGoals: "PredefinedGoals",
  SelfGoals: "SelfGoals",
};
const LIBNAMES = {
  AllDocuments: "AllDocuments",
};

const GROUPS = {
  AdminGroup: "ReadifyEM_Admin",
};

const initialPopupLoaders = {
  visibility: false,
  isLoading: {
    inprogres: false,
    success: false,
    error: false,
  },
  text: "",
  secondaryText: "",
};
export { CONFIG, LISTNAMES, initialPopupLoaders, LIBNAMES, GROUPS };
