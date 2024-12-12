import React, { useState, useEffect } from "react";
import api from "./../api";
import { useNavigate } from "react-router-dom";

const TableComponent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchData = async () => {
        try {
            const { data } = await api.get("/api/v1/institution", { params: { page, size } });

            if (data?.data?.institutions && Array.isArray(data.data.institutions)) {
                setData(data.data.institutions);
                setTotalCount(data.data.count || 0);
            } else {
                console.warn("Unexpected API response structure:", data);
                setData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error("Error fetching data:", error.message);

            setData([]);
            setTotalCount(0);
        }
    };


    useEffect(() => {
        fetchData();
    }, [page, size]);

    let totalPages = Math.ceil(totalCount / size);

    const handleEdit = (row) => {
        navigate("/institution", { state: row });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await api.delete(`/api/v1/institution`, { params: { id } });
                alert(`Institution with ID: ${id} deleted successfully`);

                fetchData();
            } catch (error) {
                console.error("Error deleting institution:", error);
                alert("Failed to delete the institution.");
            }
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handlePrint = () => {
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Table Data</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data
                .map(
                    (institution) => `
                  <tr>
                    <td>${institution.id}</td>
                    <td>${institution.code}</td>
                    <td>${institution.name}</td>
                    <td>${institution.status}</td>
                  </tr>
                `
                )
                .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "table-data.html";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ margin: "20px" }}>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((institution) => (
                            <tr key={institution.id}>
                                <td>{institution.id}</td>
                                <td>{institution.code}</td>
                                <td>{institution.name}</td>
                                <td>{institution.status}</td>
                                <td>
                                    <button onClick={() => handleEdit(institution)} style={{ marginRight: "5px" }}>Edit</button>
                                    <button onClick={() => handleDelete(institution.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={{ textAlign: 'center' }} colSpan="5">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: "10px" }}>
                <button onClick={handlePrevPage} disabled={page === 1}>
                    Previous
                </button>
                <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={page === totalPages}>
                    Next
                </button>
            </div>

            <div style={{ marginTop: "20px" }}>
                <button onClick={handlePrint} style={{ padding: "10px 20px" }}>
                    Print to HTML
                </button>
            </div>
        </div>
    );
};

export default TableComponent;