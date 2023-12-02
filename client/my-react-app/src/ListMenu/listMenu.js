import React, { useState } from 'react';
import './listMenu.css';
import { useNavigate } from 'react-router-dom';


const ListMenu = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [listName, setListName] = useState('');
  const [listType, setListType] = useState('public');
  const [selectedList, setSelectedList] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); // Add password state
  const navigate = useNavigate()
  const [ratingChoice, setRatingChoice] = useState('');
  const [ratingText, setRatingText] = useState('');
  const [review, setReview] = useState('');
  const [listDescription, setListDescription] = useState(''); 




  // Event handlers (replace with your logic)
  const handleSearch = () => {
    // Implement search logic
  };

  const handleCreateList = () => {
    // Implement create list logic
  };

  const handleDeleteList = () => {
    // Implement delete list logic
  };

  const handleAddHeroToList = () => {
    // Implement add hero to list logic
  };

  const handleDeleteHeroFromList = () => {
    // Implement delete hero from list logic
  };

  //Update password
  const updatePassword = async () => {
    try {
      const updateResponse = await fetch('/api/users/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          password: password, 
          nickname: username, 
          newPassword: newPassword
        }),
      });

      if (updateResponse.ok) {
        const success = await updateResponse.json()
        console.log(success)
      } else {
        // Handle failure
        console.log('Unable to change Password, check credientials')
      }
    } catch (error) {
      console.error('Error during password update:', error);
    }
  };

  const rateList = () => {
    //Rating List method
  }

  const logOut = () => {
    navigate('/login')
  }

  return (
    <div>
      <div className="title">
        <h1>Cole's List of Heroes</h1>
      </div>

    <div className = "uPOptions">
      Use the textboxes for updating passwords
      <input type = "text"
            id = 'emailUse'
            placeholder = 'Inspect email'
            value = {email}
            onChange={(e) => setEmail(e.target.value)} // Update password state
            />

      <input type = "text"
            id = 'passwordUse'
            placeholder = 'Password'
            value = {password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            />

      <input type = "text"
            id = 'usernameUse'
            placeholder = 'Username'
            value = {username}
            onChange={(e) => setUsername(e.target.value)} // Update password state
            />

      <input type = "text"
            id = 'newpasswordUse'
            placeholder = 'New Password'
            value = {newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Update password state
            />

      <button type="button" id="updatePassword" onClick={updatePassword}>
            Update Password
            </button>
        </div>

        <div className='="ratingOptions'>

        <select
        id="ratingChoice"
        value={ratingChoice}
        onChange={(e) => setListType(e.target.value)}
        >
        </select>


          <input type = "text"
          id = 'listRate'
          placeholder = 'Rate out of 5'
          value = {ratingText}
          onChange={(e) => setRatingChoice(e.target.value)}
          />

          <input type = "text"
          id = 'listReview'
          placeholder = 'Comments?'
          value = {review}
         onChange={(e) => setReview(e.target.value)}
          />

        <button type="button" id="rateButton" onClick={rateList}>
         Rate List
        </button>


        <button type="button" id="logoutButton" onClick={logOut}>
        LogOut
        </button>


        </div>



      <div className="searchMethods">
  <input
    type="text"
    id="searchBar"
    name="searcher"
    placeholder="Search By: "
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <ul id="results1"></ul>

  <fieldset>
    <legend>Topic:</legend>

    <label htmlFor="nameRadio">Name</label>
    <input
      type="radio"
      id="nameRadioSearch"
      name="searchTopic"
      value="name"
    />

    <label htmlFor="raceRadio">Race</label>
    <input
      type="radio"
      id="raceRadioSearch"
      name="searchTopic"
      value="race"
    />

    <label htmlFor="publisherRadio">Publisher</label>
    <input
      type="radio"
      id="publisherRadioSearch"
      name="searchTopic"
      value="name"
    />

    <label htmlFor="powersRadio">Powers</label>
    <input
      type="radio"
      id="powersRadioSearch"
      name="searchTopic"
      value="name"
    />

    <ul id="results2"></ul>
  </fieldset>

        <button type="button" id="searchSubmit" onClick={handleSearch}>
          Submit
        </button>

        <button type="button" id="creator" onClick={handleCreateList}>
          Create New List
        </button>
        <input
          type="text"
          id="newName"
          name="newName"
          placeholder="Name of new List: "
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
        <input
          type="text"
          id="newDescription"
          name="newDescription"
          placeholder="List Description: "
          value={listDescription}
          onChange={(e) => setListName(e.target.value)}
        />
        <label htmlFor="listChoice">Public or Private List?:</label>
        <select
          id="listChoice"
          value={listType}
          onChange={(e) => setListType(e.target.value)}
        >
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>

        <label htmlFor="deleteDropdown">Select list:</label>
        <select
          id="deleteDropdown"
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value)}
        >
          {/* Inject list data here*/ }
        </select>
        <button type="button" id="deleteSubmit" onClick={handleDeleteList}>
          Delete List
        </button>

        <button type="button" id="publisherButton">
          Publishers
        </button>

        <label htmlFor="listHeroes">Heroes in List:</label>
        <select id="listHeroes">
          {/* Inject data here*/ }
        </select>

        <button type="button" id="addCustom" onClick={handleAddHeroToList}>
          Add Hero to List
        </button>

        <button type="button" id="deleteCustom" onClick={handleDeleteHeroFromList}>
          Delete Hero From List
        </button>
      </div>

      <table id="listView">
        <h2>Lists: </h2>
        <tbody id="listTitle">{/* Inject List data here*/ }</tbody>
      </table>

      <table id="heroView">
        <h2>Heroes: </h2>
        <thead>
          <tr>
            <th className="subtitle">ID</th>
            <th className="subtitle">Name</th>
            <th className="subtitle">Race</th>
            <th className="subtitle">Publisher</th>
            <th className="subtitle">Powers</th>
          </tr>
        </thead>
        <tbody id="subtitles">{/* Your superhero data rows will go here*/ }</tbody>
      </table>
    </div>
  );
};

export default ListMenu;