
import React, { useState, useEffect } from 'react';
function App(){
//Button creations
const search = document.getElementById('searchBar')
const searchSubmit = document.getElementById('searchSubmit')
//Search Buttons
const nameSearch = document.getElementById('nameRadioSearch')
const raceSearch = document.getElementById('raceRadioSearch')
const publisherSearch = document.getElementById('publisherRadioSearch')
const powerSearch = document.getElementById('powerRadioSearch')

const sortSubmit = document.getElementById('sortSubmit')
//Sort Buttons
const create = document.getElementById('creator')
const newListName = document.getElementById('newName')
const heroView = document.getElementById('heroView')
const listView = document.getElementById('listView')
const listTitle = document.getElementById('listTitle')
const deleteDrop = document.getElementById('deleteDropdown')
const pubButton = document.getElementById('publisherButton')
const deleteButton = document.getElementById('deleteSubmit')
const addListButton = document.getElementById('addCustom')
const deleteListButton = document.getElementById('deleteCustom')

//Login controls
const emailText = document.getElementById('email')
const usernameText = document.getElementById('username')
const passwordText = document.getElementById('password')
const signUp = document.getElementById('signUp')
const logOut = document.getElementById('logOut')
const logIn = document.getElementById('logIn')
const loginScreen = document.getElementById('loginScreen')

//login header
const loginTitle = document.getElementById('notice')
//List status
const listStatus = document.getElementById('listChoice')

//HeroesList for adjusting
const listHeroes = document.getElementById('listHeroes')
//Login status variable
let isLoggedIn = true

//Sets functions to disbaled until login
nameSearch.disabled = true
raceSearch.disabled= true
publisherSearch.disabled= true
powerSearch.disabled= true
searchSubmit.disabled= true
search.disabled= true
create.disabled= true
listStatus.disabled=true
newListName.disabled= true
deleteDrop.disabled= true
pubButton.disabled= true
deleteButton.disabled= true
addListButton.disabled= true
deleteListButton.disabled= true
listHeroes.disabled=true

//Check login function
function checkLogin(){
    nameSearch.disabled = !isLoggedIn
    raceSearch.disabled= !isLoggedIn
    publisherSearch.disabled= !isLoggedIn
    powerSearch.disabled= !isLoggedIn
    searchSubmit.disabled= !isLoggedIn
    search.disabled= !isLoggedIn
    create.disabled= !isLoggedIn
    listStatus.disabled=!isLoggedIn
    newListName.disabled= !isLoggedIn
    deleteDrop.disabled= !isLoggedIn
    pubButton.disabled= !isLoggedIn
    deleteButton.disabled= !isLoggedIn
    addListButton.disabled= !isLoggedIn
    deleteListButton.disabled= !isLoggedIn
    listHeroes.disabled = !isLoggedIn
}

// Function to show the popup
function showPopup() {
    document.getElementById('popup-container').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}
// Function to close the popup
function closePopup() {
    document.getElementById('popup-container').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
window.onload=showPopup
const close = document.getElementById('popClose')
close.addEventListener('click', () =>{
    closePopup()
    emailText.focus()
})
//Button commands
//register
signUp.addEventListener('click', async () => {
    const email = emailText.value;
    const username = usernameText.value;
    const password = passwordText.value;
    try {
        const response = await fetch(`/api/users/register?email=${email}&password=${password}&nickname=${username}`, {
            method: 'POST'
        });
        if (response.ok) {
            const logData = await response.json();
            alert(`New Account Added! Welcome ${username}! After verification, You may login now`);
        } else {
            console.error('Registration failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
});
//create conditional delete button
let deleteUser;
//rating options
let ratingText;
//rating description
ratingText = document.createElement('input')
ratingText.type = 'float';
ratingText.placeholder = 'Rate out of 5';
const ratingChoice = document.createElement('select')
let rateButton = document.createElement('button')
rateButton.textContent='Rate List'
//review description
let review = document.createElement('input')
review.placeholder = 'Review of List'

//Disable button
let disableButton = document.createElement('button')
disableButton.textContent='Disable'
//enable button
let enableButton = document.createElement('button')
enableButton.textContent='Enable'
//Update password button
let updateButton = document.createElement('button')
updateButton.textContent='Update Password'
//Login controllers
const loginControllers = () => {
//login
logIn.addEventListener('click', async () => {
    
try{
    //Change login status
    checkLogin()
    //calling on email, username, and password
    const email = emailText.value;
    const username = usernameText.value;
    const password = passwordText.value;
    const missingValues = !email || !password || !username;
    if(missingValues){
        alert('missing login credientials. Please enter missing values')
    }else{
    const response = await fetch(`/api/users/login?email=${email}&password=${password}&nickname=${username}`,{
        method: 'POST'
    })
    if(response.ok){
            const account = await response.json()
            //Remove login buttons
            loginScreen.removeChild(signUp)
            loginScreen.removeChild(logIn)
            // Set the text content of the paragraph
            loginTitle.textContent = `Welcome ${username}!`;
                deleteUser = document.createElement('button')
            deleteUser.textContent = 'Delete Account';
            deleteUser.addEventListener('click', async () => {
            // Handle the logic to delete the user's account
            const deleteResponse = await fetch(`/api/users/removeAccount?email=${emailText.value}&password=${passwordText.value}&nickname=${usernameText.value}`, {
            method: 'DELETE'
            });
            if (deleteResponse.ok) {
            // Update the UI or perform any other actions after successful deletion
            console.log('User account deleted successfully.');
            } else {
            console.error('Error deleting user account:', deleteResponse.statusText);
            }
            });
            updateButton.addEventListener('click' , async() => {
            const updateResponse = await fetch(`/api/users/updatePassword?email=${emailText.value}&password=${passwordText.value}&nickname=${usernameText.value}&newPassword=${passwordText.value}`, {
                method: 'POST'
            });
            if(updateResponse.ok){
                // Update the UI or perform any other actions after successful deletion
                console.log('Password updated.');
                loginTitle.textContent = `${usernameText.value}, your password has been changed to: ${passwordText.value}`;
            } 
            })
        


      // Append the delete button and rating abilities to the login screen
      loginScreen.appendChild(deleteUser);
      loginScreen.appendChild(ratingChoice)
      loginScreen.appendChild(ratingText)
      loginScreen.appendChild(review)
      loginScreen.appendChild(rateButton)
      loginScreen.appendChild(updateButton)
      //If admin, place enable button
      if(username == 'admin'){
        loginScreen.appendChild(enableButton)
        //Attach Disable button
        loginScreen.appendChild(disableButton)
      }
      //Calls on display lists
    await loadLists();
    
    }else{
        const incorrect = document.createElement('p')
        incorrect.textContent = 'No account exists'
        
    }
} 
    
}catch (error){
    console.error('Error: ', error);
}
})

//logout
logOut.addEventListener('click', () => {
    //removes items first to rearrange order
    loginScreen.removeChild(emailText)
    loginScreen.removeChild(passwordText)
    loginScreen.removeChild(usernameText)
    loginScreen.removeChild(logOut)
    loginScreen.removeChild(loginTitle)
    loginScreen.removeChild(deleteUser);    
    loginScreen.removeChild(ratingText)
    loginScreen.removeChild(ratingChoice)
    loginScreen.removeChild(rateButton)
    loginScreen.removeChild(review)
    loginScreen.removeChild(updateButton)
    if(usernameText.value == 'admin'){
        loginScreen.removeChild(enableButton)
        loginScreen.removeChild(disableButton)
    }
    //Change loggedIn status
    isLoggedIn = true
    //re-appends them in correct order
    loginScreen.appendChild(emailText)
    loginScreen.appendChild(usernameText)
    loginScreen.appendChild(passwordText)
    loginScreen.appendChild(signUp)
    loginScreen.appendChild(logIn)
    loginScreen.appendChild(logOut)
    loginScreen.appendChild(loginTitle)
    loginTitle.textContent = '*Please use Gmail email accounts for creating user account*'
    usernameText.textContent=''
    emailText.textContent=''
    passwordText.textContent=''
    listView.innerHTML=''
    heroView.innerHTML=''
    listTitle.innerHTML=''
    deleteDrop.innerHTML=''
    ratingChoice.innerHTML=''
})
}
//Call on login controls
loginControllers()
//disableButton listener
disableButton.addEventListener('click', async() => {
    //logout
    const email = emailText.value;
    const username = usernameText.value;
    const password = passwordText.value;
    const response = await fetch(`/api/users/disable?email=${email}&password=${password}&nickname=${username}`,{
        method: 'POST'
    })
    if(response.ok){
    //re-appends them in correct order
    loginTitle.textContent = `*Account: ${username} has been disabled*`;
    
    }
})

//disableButton listener
enableButton.addEventListener('click', async() => {
    //logout
    const email = emailText.value;
    const username = usernameText.value;
    const password = passwordText.value;
    const response = await fetch(`/api/users/disable?email=${email}&password=${password}&nickname=${username}`,{
        method: 'POST'
    })
    if(response.ok){
    //re-appends them in correct order
    loginTitle.textContent = `*Account: ${username} has been Enabled*`;
    
    }
})

//publisher button
pubButton.addEventListener('click', () => {
    publisherDisplay()
})
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



//search
// Function to fetch superheroes based on search criteria
const searchHeroes = async () => {
    const searchText = search.value
    const searchCriteria = document.querySelector('input[name="searchTopic"]:checked').value;
        try{
            //resets heroview
            heroView.innerHTML=''
            //Searches
            const response = await fetch(`/api/superheroes/search_and_combined?pattern=${searchText}&field=${searchCriteria}&n=${50}`);
            if (response.ok) {
                const dataSet = await response.json();
                dataSet.forEach((data) => {
                    
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${data.id}</td>
                                <td>${data.name}</td>
                                <td>${data.Race}</td>
                                <td>${data.Publisher}</td>
                                <td>${data.power}</td>
                            `;
                            // search line
                            const searchLine = data.Publisher + ' ' + data.name
                            // Add a DDg search button to the row button to the row
                            const searchButtonDDG = document.createElement('button');
                            searchButtonDDG.textContent = 'Search DDG';
                            searchButtonDDG.addEventListener('click', () => {
                            // Call a function to perform DDG search with the hero name
                            performDDGSearch(searchLine);
                            });
                             // Append the button to the row
                            const cell = document.createElement('td');
                            cell.appendChild(searchButtonDDG);
                            row.appendChild(cell);
    
                            row.querySelectorAll('td').forEach(td =>{
                                td.classList.add('centered-text');
                            })
                            heroView.appendChild(row)
                    })
                
               
                }
            
            }catch (error){
                console.error('Error', error)
            }
            
           
        }
    
// Event listener for the search button click
searchSubmit.addEventListener('click', () => {
    searchHeroes()
});
// Function to perform DDG search with the hero name
function performDDGSearch(heroName) {
    // You can use the heroName parameter to perform the DDG search
    // Example: open a new window or redirect to DDG search URL
    const ddgSearchURL = `https://duckduckgo.com/?q=${encodeURIComponent(heroName)}`;
    window.open(ddgSearchURL, '_blank');
}


// Loading lists
const loadLists = async () => {
    const username = usernameText.value;
    try {
        const response = await fetch('api/superheroes/allLists');
        if (response.ok) {
            const lists = await response.json(); // Await the json() promise
            // Sort the lists by lastModified timestamp in descending order
            const sortedLists = Object.entries(lists)
                .sort(([key1, list1], [key2, list2]) => {
                    return list2.lastModified - list1.lastModified;
                })
                .slice(0, 15)
                .reverse();
            //Clears the table
            listTitle.innerHTML=''

            //TO-DO Work on getting listTitle changes to apply after ratings.
            sortedLists.forEach(([listkey, list]) => {
                if (list.status == 'public') {
                    // Add List to listView
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${list.status + ': ' + list.listName}</td>`;
                    listTitle.appendChild(row);

                    //Delete Option
                    const newOptionDelete = document.createElement('option')
                    newOptionDelete.textContent = list.listName
                    newOptionDelete.value = list.listName
                    deleteDrop.appendChild(newOptionDelete)
                    //Recovery Option
                    const newOptionRating = document.createElement('option');
                    newOptionRating.textContent = list.listName
                    newOptionRating.value = list.listName
                    ratingChoice.appendChild(newOptionRating)
                    //ratebutton Listener
                    rateButton.addEventListener('click', () => {
                    // Get the rating information from the row's content
                    const ratingInfo = row.textContent;
                
                    // Check if the row contains the selected list name and ratingChoice
                    if (ratingInfo.includes(list.listName) && ratingInfo.includes(ratingChoice.value)) {
                        // Check if the row matches the expected format
                        listTitle.removeChild(row);
                        row.innerHTML = `<td>${list.status} :  ${list.listName}   -   ${ratingText.value}/5  -   ${review.value}</td>`;
                        listTitle.appendChild(row);
                    }
            });
                }
                if(list.status == 'private'){
                    if(list.owner == username){
                         // Add List to listView
                        const row = document.createElement('tr');
                        row.innerHTML = `<td>${list.status + ': ' + list.listName}</td>`;
                        listTitle.appendChild(row);

                        //Delete Option
                        const newOptionDelete = document.createElement('option')
                        newOptionDelete.textContent = list.listName
                        newOptionDelete.value = list.listName
                        deleteDrop.appendChild(newOptionDelete)
                        //Recovery Option
                        const newOptionRating = document.createElement('option');
                        newOptionRating.textContent = list.listName
                        newOptionRating.value = list.listName
                        ratingChoice.appendChild(newOptionRating)


                        //ratebutton Listener
                        rateButton.addEventListener('click', () => {
                        // Get the rating information from the row's content
                        const ratingInfo = row.textContent;
                
                        // Check if the row contains the selected list name and ratingChoice
                        if (ratingInfo.includes(list.listName) && ratingInfo.includes(ratingChoice.value)) {
                            // Check if the row matches the expected format
                            listTitle.removeChild(row);
                            row.innerHTML = `<td>${list.status} :   ${list.listName}   -   ${ratingText.value}/5  -   ${review.value}</td>`;
                            listTitle.appendChild(row);
                        }
            });
                        }
                }
                
            });
        } else {
            console.error('Error loading lists: Response not OK', response);
        }
    } catch (error) {
        console.error('Error loading lists:', error);
    }
};


//Function for creating new  list
const createList = async () => {
    const newName = newListName.value
    const status = listStatus.value
    const username = usernameText.value
    try {
        const response = await fetch(`/api/superheroes/new-lists/${newName}/New%20List/${status}/${username}`, {
            method: 'POST',  
        })
        if (response.ok) {
            newListName.textContent = ''
            //Delete Option
            const newOptionDelete = document.createElement('option')
            newOptionDelete.textContent = newListName.value
            newOptionDelete.value = newListName.value
            deleteDrop.appendChild(newOptionDelete)
            //Recovery Option
            const newOptionRating = document.createElement('option');
            newOptionRating.textContent = newListName.value
            newOptionRating.value = newListName.value
            ratingChoice.appendChild(newOptionRating)


            
            //Add List to listView
            const row = document.createElement('tr')
            row.innerHTML = `<td>${status + ': ' + newListName.value}</td>`;
            listTitle.appendChild(row)
            //includes rating instructions
            //ratebutton Listener
            rateButton.addEventListener('click', () => {
                    // Get the rating information from the row's content
                    const ratingInfo = row.textContent;
                
                    // Check if the row contains the selected list name and ratingChoice
                    if (ratingInfo.includes(newListName.value) && ratingInfo.includes(ratingChoice.value)) {
                        // Check if the row matches the expected format
                        listTitle.removeChild(row);
                        row.innerHTML = `<td>${status + ': ' + newListName.value}   -   ${ratingText.value}/5  -   ${review.value}</td>`;
                        listTitle.appendChild(row);
                    }
            });
        } else {
            console.error('Failed to create a new list')
            return null
        }
    } catch (error) {
        console.error('Error: ', error)
    }
}

//Event listener for new list creator
create.addEventListener('click', () => {
    createList()
})
//Function to retrieve and display favorite lists
const retrieveLists = async () => {
    let listName = customSearch.value
    const listsResponse = await fetch(`/api/superheroes/custom-Idlists/${listName}`);
    if (response.ok) {
        const list = await listsResponse.json()
        .then((list) => {
            showSuperheroesInList(list)
            return list
            
        })      
    } else {
        console.error('Failed to retrieve lists')
    }
}
// Function to show superheroes in a selected list
const showSuperheroesInList = async (listName) => {
    // Send a request to the backend to retrieve superhero IDs in the selected list
    try{
    const response = await fetch(`/api/superheroes/custom/${listName}`)
    if (response.ok) {
        const heroIDs = await response.json()
        const heroes = await Promise.all(
            heroIDs.map(async (superheroId) => {
                const response = await fetch(`/apisuperheroes/superhero-info/${superheroId}`);
                if (response.ok) {
                    return response.json()
                }
            })
        )
        heroView.innerHTML = '';
        heroes.forEach((superhero) => {
            if(superhero){
            const superheroElement = document.createElement('div');
            superheroElement.innerHTML = `
                <h3>${superhero.name}</h3>
                <p>Race: ${superhero.race}</p>
                <p>Publisher: ${superhero.publisher}</p>
                <p>Powers: ${superhero.powers.join(', ')}</p>
                `;
            heroView.appendChild(superheroElement);
            }
        });
    } else {
        console.error('Failed to retrieve superhero IDs:', response.status);
    }
} catch (error) {
    console.error('Error:', error);
}
}
//how to tell when a list has been clicked
// Add a click event listener to listTitle rows
listTitle.addEventListener('click', async (event) => {
    const targetRow = event.target.closest('tr');
    if (targetRow) {
        // Extract listName from the clicked row
        const rowContent = targetRow.textContent.trim();
        const listNamePrefix = 'private: ';
        let listName;
        if (rowContent.startsWith(listNamePrefix)) {
            listName = rowContent.slice(listNamePrefix.length);
            
        } else {
            // Handle the case where the format is unexpected
            console.error('Unexpected row format:', rowContent);
            return;
        }
        try {
            const encodedListName = encodeURIComponent(listName);
            const response = await fetch(`/api/superheroes/custom/${encodedListName}/superhero-ids`);
            
            if (response.ok) {
                const listElements = await response.json();
                const heroesResponse = await fetch(`/api/superheroes/idSearch/${encodedListName}`, {
                    method: 'POST',  
                });
                if(heroesResponse.ok){
                    const heroes = await heroesResponse.json()
                    const heroElements = heroes.updatedList.elements
                // Display the elements in heroView
                heroView.innerHTML = ''; // Clear existing content
                Object.keys(heroElements).forEach((key) => {
                    const element = heroElements[key];
                    const listItem = document.createElement('li');
                    listItem.textContent = 'ID: ' + element.id + ' | Name: ' + element.name + ' | Race: ' + element.Race + ' | Publisher: ' + element.Publisher + ' | Powers: ' + element.powers;

                    //list heroes Option
                    const newHeroOption = document.createElement('option')
                    newHeroOption.textContent = element.name
                    newHeroOption.value = element.name
                    listHeroes.appendChild(newHeroOption)

                    // search line
                    const searchLine = element.Publisher + ' ' + element.name
                    // Add a DDg search button to the row button to the row
                    const searchButtonDDG = document.createElement('button');
                    searchButtonDDG.textContent = 'Search DDG';
                    searchButtonDDG.addEventListener('click', () => {
                    // Call a function to perform DDG search with the hero name
                    performDDGSearch(searchLine);
                    });
                    // Append the button to the row
                    const cell = document.createElement('td');
                    cell.appendChild(searchButtonDDG);
                    listItem.appendChild(cell);

                    heroView.appendChild(listItem);
                });
            }



            } else {
                console.error('Error fetching list elements:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching list elements:', error);
        }
    }
});
//how to add superheroes to a list
addListButton.addEventListener('click', function(event){
    let searchText = search.value
    const searchCriteria = document.querySelector('input[name="searchTopic"]:checked').value;
    let useList = retrieveLists(select)
    try{
        const response = fetch(`/api/superheroes/search_and_combined?pattern=${searchText}&field=${searchCriteria}&n=${1}`);
        if(response.ok){
            const result = response.json()
            addResults(useList, result)
            const row = document.createElement('tr')
            row.innerHTML = `
                <h3>${result.name}</h3>
                <p>Race: ${result.Race}</p>
                <p>Publisher: ${result.Publisher}</p>
                <p>Powers: ${result.power.join(', ')}</p>
                `;
        }
    }catch (error) {
        console.error('Error:', error);
    }
})
async function retrieveIDs(listName){
    try{
        const response = await fetch(`/api/superheroes/custom/${listName}/superhero-Ids`);
        if(response.ok){
            const data = await response.json()
            console.log(data)
            return data
        }
    }catch (error) {
        console.error('Error:', error);
        }
}


//how to delete superheroes from a list 
/*deleteListButton.addEventListener('click', async function(event){
    const removeHero = listHeroes.value
    const list = deleteDrop.value
    const superheroIds = retrieveIDs(list)
    const removalIDs = 
    try{
        const deleteResponse = await fetch(`/api/superheroes/removeIDs/${list}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                superheroIds: superheroIds,
                removalIDs: removalIDs,
            }),
        });
        if(deleteResponse.ok){
            const data = deleteResponse.json()
        }
    }catch (error) {
        console.error('Error:', error);
        }
    
});*/


//function to delete lists
const deleteLists = async () =>{
    try{
        const removal = deleteDrop.value
        const response = await fetch(`/api/superheroes/lists/${removal}`, {
            method: 'DELETE'
        });
        if (response.ok){
            deleteDrop.remove(removal)
            listView.deleteRow(removal)
        }else if (response.status === 404) {
            console.error(`List '${removal}' not found`);
        } else {
            console.error('Failed to delete the list');
        }   
    } catch (error) {
        console.error('Error:', error);
    }
}
deleteButton.addEventListener('click',() => {
    deleteLists()
})
}
export default App