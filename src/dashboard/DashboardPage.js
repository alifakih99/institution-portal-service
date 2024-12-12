import React from 'react';
import './../style/Style.css';
import TableComponent from "./../table/TableComponent";
import SearchableDropdown from "./../dropdown/SearchableDropdown";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();
  const handleNewInstitution = () => {
    navigate('/institution');
  };

  return (
    <div className="">
      <div style={{ margin: "20px" }}>
        <button onClick={handleNewInstitution}>
          New Institution
        </button>
      </div>
      <SearchableDropdown></SearchableDropdown>
      <TableComponent></TableComponent>
    </div>
  );

}
export default DashboardPage;