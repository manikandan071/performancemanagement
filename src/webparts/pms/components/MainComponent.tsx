import * as React from "react";
import NavBar from "./NavBar/NavBar";
import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { RxCaretRight } from "react-icons/rx";
import Goals from "./Goals/GoalsComponent";

const MainComponent = (props: any) => {
  let UserEmail = props.context.pageContext.user.email;

  const [isNavBar, setIsNavBar] = useState(true);
  const [isNavOption, setNavOption] = useState("");
  console.log(UserEmail, isNavOption);

  const handleCilck = (item: string) => {
    setNavOption(item);
  };

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
            <h1>Manager</h1>
          </div>
        ) : (
          <div>
            <h2>Employee</h2>
          </div>
        )}
      </div>
    </div>
  );
};
export default MainComponent;
