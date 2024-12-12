import React, { useState, useEffect } from "react";
import './../style/Style.css';
import api from "./../api";

const SearchableDropdown = () => {
    const [options, setOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await api.get("/api/v1/institution/active");

                if (response.data !== null && response.data.data && Array.isArray(response.data.data.institutions)) {
                    const names = response.data.data.institutions.map((institution) => institution.name);

                    setOptions(names);
                    setFilteredOptions(names);
                }
            } catch (error) {
                console.error("Error fetching dropdown options:", error);
            }
        };

        fetchOptions();
    }, []);


    useEffect(() => {
        if (Array.isArray(options)) {
            const results = options.filter((option) =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOptions(results);
        } else {
            console.warn("Options is not an array:", options);
            setFilteredOptions([]);
        }
    }, [searchTerm, options]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                {selectedOption || "Select an option"}
                <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
                <div className="dropdown-menu">
                    <input
                        type="text"
                        className="dropdown-search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className="dropdown-list">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className="dropdown-item"
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </li>
                            ))
                        ) : (
                            <li className="dropdown-no-results">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
