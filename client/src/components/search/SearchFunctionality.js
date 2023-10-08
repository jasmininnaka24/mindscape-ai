import React, { useState, useEffect } from 'react';
import './SearchFunctionality.css';

export const SearchFunctionality = ({ data, onSearch, setSearchTermApp, setSelectedDataId, searchAssetFor, searchTermApp }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [inputField, setInputField] = useState('');

    // Define the field name based on the searchAssetFor prop
    let fieldName;
    switch (searchAssetFor) {
      case 'search-username-for-group-creation':
        fieldName = 'username';
        break;
      case 'search-name':
        fieldName = 'name';
        break;
      default:
        // eslint-disable-next-line no-unused-vars
        fieldName = ''; 
    }
    const handleSearch = (searchTerm) => {
      setSearchTermApp(searchTerm);
      setSearchTerm(searchTerm);
      const filteredResults = data.filter((item) => {
        const fieldValue = item[fieldName];
        if (fieldValue && typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false; // Handle the case where fieldValue is undefined or not a string
      });
      setFilteredData(filteredResults);
      setSelectedItemIndex(-1);
      onSearch(searchTerm);
      setSelectedDataId('');
    };
    

  const handleItemClick = (value, id) => {
    setSearchTerm(value);
    setSelectedDataId(id); 
    setFilteredData([]);
    setSelectedItemIndex(-1);
    setSearchTermApp(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedItemIndex((prevIndex) =>
        prevIndex < filteredData.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedItemIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedItemIndex !== -1) {
        handleItemClick(filteredData[selectedItemIndex][fieldName], filteredData[selectedItemIndex].id);
      } else if (filteredData.length === 1) {
        handleItemClick(filteredData[0][fieldName], filteredData[0].id);
      } else {
        if (inputField === searchTerm) {
          setSelectedDataId(null); 
        } else {
          setSelectedDataId("");
        }
      }
    }
  };
  
  

  useEffect(() => {
    const handleWindowClick = () => {
      setFilteredData([]);
      setSelectedItemIndex(-1);
    };

    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        className='border-medium-800-scale px-5 py-2 w-full rounded-[5px]'
        placeholder='Search here...'
        value={searchTermApp}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          handleSearch(e.target.value);
          setInputField(e.target.value);
        }}
      />
      {inputField !== '' && (
        <div className="search-results">
          {filteredData.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item[fieldName], item.id)}
              className={`clickable-item ${
                index === selectedItemIndex ? 'selected' : ''
              }`}
            >
              {item[fieldName]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
