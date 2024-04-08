import * as React from "react";
import NavBar from "./NavBar/NavBar";
import { useState } from "react";
// import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { IoIosClose } from "react-icons/io";
import { RxCaretRight } from "react-icons/rx";
// import { CgClose } from "react-icons/cg";
// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Goals from "./Goals/GoalsComponent";
import ManagerComponent from "./Manager/ManagerComponent";
import EmployeeComponent from "./Employee/EmployeeComponent";

const MainComponent = (props: any) => {
  let UserEmail = props.context.pageContext.user.email;
  let UserName = props.context.pageContext.user.displayName

  //   const urlParams = new URLSearchParams(window.location.search);
  //   const pagename: any = urlParams.get("Page");
  //   console.log(pagename);

  const [isNavBar, setIsNavBar] = useState(true);
  const [isNavOption, setNavOption] = useState("");
  console.log(UserEmail, isNavOption);

  //   const setPageFunction = () => {
  //     setNavOption(pagename);
  //   };
  const handleCilck = (item: string) => {
    setNavOption(item);
  };

  //   React.useEffect(() => {
  //     setPageFunction();
  //   });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          width: isNavBar ? "15%" : "5%",
          height: "100vh",
          position: "relative",
          transition: "all 1s",
        }}
      >
        {!isNavBar ? (
          <RxCaretRight
            className="bi bi-4-circle"
            style={{
              position: "absolute",
              left: "94%",
              top: "2%",
              color: "#000",
              backgroundColor: "#fff",
              borderRadius: "50px",
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={() => setIsNavBar(!isNavBar)}
          />
        ) : (
          <IoIosClose
            className="bi bi-4-circle"
            style={{
              position: "absolute",
              left: "94%",
              top: "2%",
              color: "#000",
              backgroundColor: "#fff",
              borderRadius: "50px",
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={() => setIsNavBar(!isNavBar)}
          />
        )}
        {/* <IoIosClose
          className="bi bi-4-circle"
          style={{
            position: "absolute",
            left: "95%",
            top: "2%",
            color: "#000",
            backgroundColor: "#fff",
            borderRadius: "50px",
            fontSize: "25px",
            cursor: "pointer",
          }}
          onClick={() => setIsNavBar(!isNavBar)}
        ></IoIosClose> */}
        {/* <button
          style={{ position: "absolute", left: "100%" }}
          type="submit"
          onClick={() => setIsNavBar(!isNavBar)}
        >
          X
        </button> */}
        <NavBar
          isNav={isNavBar}
          //   tab={isNavOption}
          handleCilck={handleCilck}
          context={props}
        />
      </div>

      <div style={{ width: isNavBar ? "85%" : "95%", marginLeft: "20px" }}>
        {isNavOption === "Goals" ? (
          <div>
            <Goals />
          </div>
        ) : isNavOption === "Manager" ? (
          <div>
            <ManagerComponent ManageContext = {UserEmail} UserName = {UserName}/>
          </div>
        ) : (
          <div>
            <EmployeeComponent/>
          </div>
        )}
      </div>
    </div>
  );
};
export default MainComponent;
