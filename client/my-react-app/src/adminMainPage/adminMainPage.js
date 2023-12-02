import React, { useState } from 'react';
import './adminMainPage.css';
import { useNavigate } from 'react-router-dom';


const AdminMenu = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [listName, setListName] = useState('');
  const [listType, setListType] = useState('public');
  const [selectedList, setSelectedList] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ratingChoice, setRatingChoice] = useState('');
  const [review, setReview] = useState('');
  const [newPassword, setNewPassword] = useState(''); // Add password state
  const [deleteDropdown, setDeleteDropdown] = useState(''); 
  const [listChoice, setListChoice] = useState('');
  const [listTitle, setListTitle] = useState(''); // Add password state
  const [rateButton, setRateButton] = useState(''); 
  const [ratingText, setRatingText] = useState('');
  const username2 = 'admin'
  const navigate = useNavigate()
  const [listDescription, setListDescription] = useState(''); 
  const [searchCriteria, setSearchCriteria] = useState('name'); // Default search criteria
  const [heroesData, setHeroesData] = useState([]);
  const [listData, setListData] = useState([])

  // Event handlers (replace with your logic)
  const handleSearch = async () => {
    try {
      // Resets heroes view
      setHeroesData([]);

      const response = await fetch(`/api/superheroes/search_and_combined?pattern=${encodeURIComponent(searchTerm)}&field=${searchCriteria}&n=${50}`);

      if (response.ok) {
        const dataSet = await response.json();

        setHeroesData(dataSet);
      } else {
        console.error('Failed to fetch superheroes');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to perform DDG search with the hero name
  const performDDGSearch = (searchLine) => {
    // Your DDG search logic here
    console.log('Performing DDG search for:', searchLine);
  };


  const handleCreateList = async () => {
    console.log(listName)
    console.log(listType)
    console.log(username2)
    try {
      const response = await fetch(`/api/superheroes/new-lists/${encodeURIComponent(listName)}/${encodeURIComponent(listDescription)}/${encodeURIComponent(listType)}/${encodeURIComponent(username2)}`, {
          method: 'POST',  
      })
      if (response.ok) {
          setListName('')

          // Create a new row element
          const newRow = document.createElement('tr');
          newRow.innerHTML = `<td>${listType + ': ' + listName}</td>`;

           // Debugging: log the previous state
      console.log('Previous listTitle:', listTitle);

      // Update listTitle by adding the new row to the existing rows
      setListTitle((prevRows) => [...prevRows, newRow]);

      // Debugging: log the updated state
      console.log('Updated listTitle:', listTitle);

          //Delete Option
          const newOptionDelete = document.createElement('option')
          newOptionDelete.textContent = listName
          newOptionDelete.value = listName
          setDeleteDropdown(newOptionDelete)
          //Recovery Option
          const newOptionRating = document.createElement('option');
          newOptionRating.textContent = listName
          newOptionRating.value = listName
          setRatingChoice(newOptionRating)
          
      } else {
          console.error('Failed to create a new list')
          return null
      }
  } catch (error) {
      console.error('Error: ', error)
  }
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
  }

  const enableUser = async() => {
    console.log(email)
    console.log(password)
    console.log(username)
    const response = await fetch('/api/users/enable', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          password: password, 
          nickname: username, 
        })
    })
    if(response.ok){
      const success = response.json()
      console.log(success)
    }else{
      console.log('Failed to Disable')
    }
  }

  const disableUser = async() => {
    console.log(email)
    console.log(password)
    console.log(username)
    const response = await fetch('/api/users/disable', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          password: password, 
          nickname: username, 
        })
    })
    if(response.ok){
      const success = response.json()
      console.log(success)
    }else{
      console.log('Failed to Disable')
    }
  }

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
      Use the textboxes for updating passwords/ disabling users
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
        </div>

        <div className = "AdminControls">
          <button type="button" id="updatePassword" onClick={updatePassword}>
            Update Password
            </button>

            <button type="button" id="enableUser" onClick={enableUser}>
            Enable User
            </button>

            <button type="button" id="disableUser" onClick={disableUser}>
            Disable User
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
          checked={searchCriteria === 'name'}
          onChange={() => setSearchCriteria('name')}
        />

        <label htmlFor="raceRadio">Race</label>
        <input
          type="radio"
          id="raceRadioSearch"
          name="searchTopic"
          value="race"
          checked={searchCriteria === 'race'}
          onChange={() => setSearchCriteria('race')}
        />

        <label htmlFor="publisherRadio">Publisher</label>
        <input
          type="radio"
          id="publisherRadioSearch"
          name="searchTopic"
          value="publisher"
          checked={searchCriteria === 'publisher'}
          onChange={() => setSearchCriteria('publisher')}
        />

        <label htmlFor="powersRadio">Powers</label>
        <input
          type="radio"
          id="powersRadioSearch"
          name="searchTopic"
          value="powers"
          checked={searchCriteria === 'powers'}
          onChange={() => setSearchCriteria('powers')}
        />
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
          onChange={(e) => setListDescription(e.target.value)}
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
  <thead>
    <tr>
      <th className="subtitle">ID</th>
      <th className="subtitle">Name</th>
      <th className="subtitle">Race</th>
      <th className="subtitle">Publisher</th>
      <th className="subtitle">Powers</th>
    </tr>
  </thead>
  <tbody id="subtitles">
    {heroesData.map((hero) => (
      <tr key={hero.id}>
        <td>{'ID: ' + hero.id}</td>
        <td>{'Name: ' + hero.name}</td>
        <td>{'Race: ' + hero.Race}</td>
        <td>{'Publisher: ' + hero.Publisher}</td>
        <td>{'Powers: ' + hero.power}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default AdminMenu;