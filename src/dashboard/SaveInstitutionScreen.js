import React, { useState, useEffect } from "react";
import api from './../api';
import { useLocation } from "react-router-dom";
import "./../style/Style.css"
import { useNavigate } from "react-router-dom";

const SaveInstitutionScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    status: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setFormData(location.state);
    }
  }, [location.state]);

  const handleSave = async () => {
    try {
      const response = await api.post(`/api/v1/institution`, formData);
      if (response.data && response.data.status && response.data.code === 2000) {
        navigate('/');
      }

      setFormData({ id: "", name: "", code: "", status: "" });
    } catch (error) {
      console.error("Error saving institution:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div className='save' style={{ margin: "20px" }}>
      <h2>Save Institution</h2>

      <div>
        <div style={{ marginBottom: "10px" }}>
          <label>ID: </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            disabled
            placeholder="Auto-generated"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Code: </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Enter code"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Status: </label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            placeholder="Enter status"
          />
        </div>
        <button onClick={handleSave} style={{ padding: "10px 20px" }}>
          Save
        </button>
      </div>
    </div>
  );
};

export default SaveInstitutionScreen;
