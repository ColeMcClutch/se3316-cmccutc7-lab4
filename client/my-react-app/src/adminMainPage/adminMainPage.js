import React, { useState, useEffect } from 'react';
import './adminMainPage.css';
import { useNavigate } from 'react-router-dom';


const AdminMenu = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [listName, setListName] = useState('');
  const [listType, setListType] = useState('private');
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
  const [heroElements, setHeroElements] = useState([]);
  const [selectedHeroId, setSelectedHeroId] = useState('');
  const [listHeroes, setListHeroes] = useState('');

  const giveAdmin = async () => {
    try{
      const response = await fetch('/api/users/giveAdmin',{
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          nickname:username
        })
      })
      if(response.ok){
        console.log(`Admin privileges given to ${email}`);
        alert('Admin privileges given. Relogin for control. If issue occurs contact admin')
      }
    }catch (error) {
      console.error('Error fetching lists:', error);
    }
  }


  
  const fetchListData = async () => {
    try{
        const response = await fetch('/api/superheroes/allLists');
        if(response.ok){
          const lists = await response.json()
          setListData(lists)
        } else {
          console.error('Error fetching lists:', response);
        }
    }catch (error) {
      console.error('Error fetching lists:', error);
    }
  }

  //Fetches list data
  useEffect(() => {
    fetchListData();
  }, [])


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
  const performDDGSearch = (searchPublisher, heroName) => {
    const searchQuery = `${searchPublisher} ${heroName}`;
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
    console.log('Performing DDG search for:', searchQuery);
  };


  const handleCreateList = async () => {
    console.log(listName);
  console.log(listType);
  console.log(username2);
  try {
    const response = await fetch(`/api/superheroes/new-lists/${encodeURIComponent(listName)}/${encodeURIComponent(listDescription)}/${encodeURIComponent(listType)}/${encodeURIComponent(username2)}`, {
      method: 'POST',
    });
    if (response.ok) {
      setListName('');

      // Update listTitle by adding the new row to the existing rows
      setListTitle((prevRows) => [...prevRows, { type: listType, name: listName }]);

      // Update deleteDropdown
      setDeleteDropdown((prevOptions) => [...prevOptions, { textContent: listName, value: listName }]);

      // Update ratingChoice
      setRatingChoice((prevOptions) => [...prevOptions, { textContent: listName, value: listName }]);

    } else {
      console.error('Failed to create a new list');
      return null;
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}


  const handleDeleteList = async () => {
    // Implement delete list logic
    try {
      const removal = deleteDropdown;
  
      if (!removal) {
        console.error('Please select a list to delete.');
        return;
      }
  
      const response = await fetch(`/api/superheroes/lists/${removal}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Remove the selected list from the dropdown
        // Note: Update this logic based on how you're managing the list of options
        setDeleteDropdown('');
      } else if (response.status === 404) {
        console.error(`List '${removal}' not found`);
      } else {
        console.error('Failed to delete the list');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddHeroToList = (hero) => {
    // Implement add hero to list logic
    const listName = deleteDropdown

    if (!listName) {
      alert('Please select a list');
      return;
    }
  
    // Fetch the current list of superhero IDs from the backend
    fetch(`/api/superheroes/custom-Idlists/${listName}`, {
      method: 'POST'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch current list: ${response.statusText}`);
        }
        return response.json();
      })
      .then((currentList) => {
        console.log(currentList);
  
        // Check if currentList.superheroIds is present and is iterable (an array)
        const existingIds = Array.isArray(currentList.elements)
          ? currentList.superheroIds
          : currentList.superheroIds
          ? [currentList.superheroIds]
          : [];
        console.log(existingIds)
  
        // Append the new hero's ID to the existing list
        const updatedList = {
          superheroIds: [...existingIds, hero.id],
        };
        console.log(updatedList)
        // Send a POST request to update the list on the backend
        return fetch(`/api/superheroes/custom-Idlists/${listName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedList),
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to add hero to list: ${response.statusText}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result.message); // Success message
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to add hero to list. Please try again.');
      });
  };

 
  //Next part to work on. Currenlty getting error 500
  const handleDeleteHeroFromList = async() => {
    // Implement delete hero from list logic
    try {
      // Check if a hero is selected
      if (!selectedHeroId || !deleteDropdown) {
        console.error('Please select a hero to remove from the list.');
        return;
      }
      console.log(selectedHeroId)
      console.log(deleteDropdown)
      
  
      // Call the API to remove the hero from the list
      const response = await fetch(`/api/superheroes/removeIDs/${deleteDropdown}`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          removalID: parseInt(selectedHeroId),
        }),
      });
  
      if (response.ok) {
        // Handle success (update UI, show message, etc.)
        console.log('Hero removed from the list successfully');
        console.log(response)
      } else {
        console.error('Failed to remove hero from the list:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Publisher Display Button
  const publisherDisplay = async () => {
    try{
      const response = await fetch('/api/superheroes/publisher_info')
      if (response.ok){
          const publishers = await response.json();
          alert(`Publishers: ${publishers.join(', ')}`);
      } else {
          console.error('Request failed! Status: ', response)
      }
      } catch (error){
          console.error('Error: ', error);
      }
  }
  

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


  //Enable User method
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

  //Disable a user
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

  //Logout
  const logOut = () => {
    navigate('/login')
  }

  // Lists on load
useEffect(() => {
  // Fetch list data and update listTitle when the component mounts
  const fetchData = async () => {
    try {
      const response = await fetch('/api/superheroes/allLists');
      if (response.ok) {
        const lists = await response.json();

        // Process the lists and update listTitle
        const processedLists = Object.entries(lists).map(([key, list]) => {
          if (list.status === 'public' || (list.status === 'private' && list.owner === 'admin')) {
            return (
              <tr key={key}>
                <td>{list.status + ': ' + list.listName}</td>
                <td>
                <button id = 'expandButton' onClick={() => alertList(list)}>
                    Show Details
                  </button>
                </td>
              </tr>
            );
          }
          return null;
        });

        setListTitle(processedLists.filter(Boolean)); // Filter out null values
      } else {
        console.error('Error loading lists: Response not OK', response);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  fetchData(); // Call the fetchData function when the component mounts
}, [username]);

const handleListDrop = async (listName) => {
  console.log('Clicked on:', listName);
  try {
    const encodedListName = encodeURIComponent(listName);
    const response = await fetch(`/api/superheroes/custom/${encodedListName}/superhero-ids`);

    if (response.ok) {
      const listElements = await response.json();
      const heroesResponse = await fetch(`/api/superheroes/idSearch/${encodedListName}`, {
        method: 'POST',
      });

      if (heroesResponse.ok) {
        const heroes = await heroesResponse.json();
        const heroElements = heroes.updatedList.elements;
        console.log(heroElements)
        setHeroesData(Object.values(heroElements))

        // TODO: Additional logic for handling hero elements in React state
      }
    } else {
      console.error('Error fetching list elements:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching list elements:', error);
  }

}

const alertList = async(list) => {
  alert(`${list.listName} Creator: ${list.owner}, Description: ${list.description} Status: ${list.status}  Rating: ${list.rating}  Review: ${list.review}`);
}

//Rating lists
const rateList = async (list) => {
  try {
    const response = await fetch(`http://localhost:3000/api/superheroes/rateList/${list}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: ratingText,
        review: review,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`${list} has a rating of: ${result.message}`);
    } else {
      console.error('Failed to rate list:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


  return (
    <div>
      <div className="title">
        <h1>Cole's List of Heroes</h1>
      </div>

      <button type="button" id="publisherButton"onClick={publisherDisplay}>
            Publishers
            </button>

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

            <button type="button" id="adminButton" onClick={giveAdmin}>
            Give Admin controls to user
            </button>
          </div>


          

          <div className='="ratingOptions'>

          <select
          id="ratingChoice"
          value={ratingChoice}
          onChange={(e) => setRatingChoice(e.target.value)}
        >
         {Object.entries(listData).map(([key, list]) => {
          // Check if the list is public or if the user is the owner for private lists
          if (list.status === 'public' || (list.status === 'private' && list.owner === username)) {
            return (
              <option key={key} value={list.listName}>
                {list.listName}
              </option>
            );
          }
          return null;
        })}
        </select>


            <input type = "text"
            id = 'listRate'
            placeholder = 'Rate out of 5'
            value = {ratingText}
            onChange={(e) => setRatingText(e.target.value)}
            />

            <input type = "text"
            id = 'listReview'
            placeholder = 'Comments?'
            value = {review}
            onChange={(e) => setReview(e.target.value)}
            />

            <button type="button" id="rateButton" onClick={() => rateList(ratingChoice)}>
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
          value="Race"
          checked={searchCriteria === 'race'}
          onChange={() => setSearchCriteria('Race')}
        />

        <label htmlFor="publisherRadio">Publisher</label>
        <input
          type="radio"
          id="publisherRadioSearch"
          name="searchTopic"
          value="Publisher"
          checked={searchCriteria === 'publisher'}
          onChange={() => setSearchCriteria('Publisher')}
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
          value={deleteDropdown}
          onChange={(e) => {
          const selectedListName = e.target.value; // Use the updated value
          setDeleteDropdown(selectedListName);
          handleListDrop(selectedListName); // Pass the selected value to the function
          }}
        >
          {Object.entries(listData).map(([key, list]) => {
          // Check if the list is public or if the user is the owner for private lists
          if (list.status === 'public' || (list.status === 'private' && list.owner === 'admin')) {
            return (
              <option key={key} value={list.listName}>
                {list.listName}
              </option>
            );
          }
          return null;
        })}

        </select>

        <button type="button" id="deleteSubmit" onClick={handleDeleteList}>
          Delete List
        </button>

        

        <label htmlFor="listHeroes">Heroes in List:</label>
        <select id="listHeroes"
          value={selectedHeroId}
          onChange={(e) => setSelectedHeroId(e.target.value)}
        >
          {heroesData.map((hero) => (
            <option key={hero.id} value={hero.id}>
              {hero.name}
            </option>
            ))}
        </select>


        <button type="button" id="deleteCustom" onClick={handleDeleteHeroFromList}>
          Delete Hero From List
        </button>
      </div>

      <table id="listView">
        <h2>Lists: </h2>
        <tbody id="listTitle" >{listTitle}
        </tbody>
      </table>

      <table id="heroView">
  <tbody id="subtitles">
    {heroesData.map((hero) => (
      <tr key={hero.id}>
        <td>{'ID: ' + hero.id}</td>
        <td>{'Name: ' + hero.name}</td>
        <td>{'Race: ' + hero.Race}</td>
        <td>{'Publisher: ' + hero.Publisher}</td>
        <td>{'Powers: ' + hero.powers}</td>
        <td>
            <button
              id = "DDGButton" onClick={() => performDDGSearch(hero.Publisher , hero.name)}
            >
              Search DDG
            </button>
          </td>
          <td>
            <button
              id = 'addButton' onClick={() => handleAddHeroToList(hero, deleteDropdown)}
            >
              Add Hero to SelectedList
            </button>
          </td>
        </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default AdminMenu;