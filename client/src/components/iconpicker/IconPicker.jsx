import React, {useState} from 'react';
import * as FaIcons from "react-icons/fa";
import "./iconpicker.scss";


const iconList = Object.keys(FaIcons);

const IconPicker = ({value, onChange}) => {

    const [search, setSearch] = useState("");
    const filteredIcons = iconList.filter((name) => name.toLowerCase().includes(search))



  return (
    <div className='icon-picker'>
        <input
        className='icon-picker-input'
        type='text'
        placeholder='Search icon'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <div className='icon-picker-container'>
            {filteredIcons.}

        </div>
      
    </div>
  )
}

export default IconPicker
