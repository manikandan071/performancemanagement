import { sp } from "@pnp/sp";
import * as React from "react";
import { useEffect,useState } from "react";
import {
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
  } from "@fluentui/react";

const MembersComponent = (props: any) => {
  const currentUser = props.currentUser;
  const[membersList,setMembersList] = useState<any[]>([]);
  const[Roles,setRoles] = useState<any[]>([]);
//   const[mergedArrays,setMergedArrays] = useState<any[]>([]);
//   console.log(mergedArrays);
// console.log("test");

  
  
  const columns = [
    {
      key: "columns1",
      name: "MembersName",
      fieldName: "MembersName",
      minWidth: 150,
      maxWidth: 190,
      isMultiline: true,
      onRender: (item: any) => (
        <>
          <div>{item.MembersName}</div>
        </>
      ),
    },
    {
        key: "columns2",
        name: "Roles",
        fieldName: "Role",
        minWidth: 150,
        maxWidth: 190,
        isMultiline: true,
        onRender: (item: any) => (
          <>
            <div>{item.Role}</div>
          </>
        ),
      }
]
  const getDetails = () => {
    sp.web.lists
      .getByTitle("EmployeeList")
      .items.select(
        "*",
        "Employee/EMail",
        "Employee/Id",
        "Employee/Title",
        "Members/Title",
        "Members/Id"
      )
      .expand("Employee,Members")
      .get()
      .then((response: any) => {
        const MembersList :any = [];
        const UserRole :any = [];
        response.forEach((items: any) => {
          if (items.Employee?.EMail === currentUser && items.Roles === "Manager") {
            if (items.Members) {
              items.Members?.forEach((member: any) => {
                MembersList.push({
                  MembersName: member.Title,
                });
              });
            }
          }   
        });
        response.forEach((element:any)=>{
            MembersList.map((obj:any)=>{
                if(element.Employee?.Title == obj.MembersName){
                    UserRole.push({
                        Role : element.Roles
                    });
                }
            })
          });
        setMembersList([...MembersList])
        setRoles([...UserRole])

      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log("aaritest",membersList)
  console.log("Roles",Roles)
  
  const init = () => {
    getDetails();
  };
  useEffect(() => {
    init();
  }, []);

    let mergedArray = [];
    for (let i = 0; i < membersList.length; i++) {
        let mergedObject = {
            membersName: membersList[i]?.MembersName,
            Role: Roles[i]?.Role
        };
        mergedArray.push(mergedObject);
    }
    console.log(mergedArray);
    // setMergedArrays([...mergedArray])

  return (
    <>
      <div>
      <DetailsList
                items={membersList}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
              />
      </div>
    </>
  );
};
export default MembersComponent;
