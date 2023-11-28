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
const nameSort = document.getElementById('nameRadioSort')
const raceSort = document.getElementById('raceRadioSort')
const publisherSort = document.getElementById('publisherRadioSort')
const powerSort = document.getElementById('powerRadioSort')

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
const customSearch = document.getElementById('customName')


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



//login
logIn.addEventListener('click', async () => {
    
try{
    //calling on email, username, and password
    const email = emailText.value;
    const username = usernameText.value;
    const password = passwordText.value;

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

      // Append the delete button and rating abilities to the login screen
      loginScreen.appendChild(deleteUser);
      loginScreen.appendChild(ratingChoice)
      loginScreen.appendChild(ratingText)
      loginScreen.appendChild(review)
      loginScreen.appendChild(rateButton)

      //If admin, place enable button
      if(username == 'admin'){
        loginScreen.appendChild(enableButton)
        //Attach Disable button
        loginScreen.appendChild(disableButton)
      }

      

    }else{
        const incorrect = document.createElement('p')
        incorrect.textContent = 'No account exists'
        
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
    loginScreen.removeChild(enableButton)
    loginScreen.removeChild(disableButton)

    //re-appends them in correct order
    loginScreen.appendChild(emailText)
    loginScreen.appendChild(usernameText)
    loginScreen.appendChild(passwordText)
    loginScreen.appendChild(signUp)
    loginScreen.appendChild(logIn)
    loginScreen.appendChild(logOut)
    loginScreen.appendChild(loginTitle)
    loginTitle.textContent = '*Please use Gmail email accounts for creating user account*'
    usernameText.value=''
    emailText.value=''
    passwordText.value=''
    listView.innerHTML=''
    heroView.innerHTML=''

})


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
    console.log(searchCriteria)
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


//Function for creating new  list
const createList = async () => {
    const newName = newListName.value
    try {
        const response = await fetch(`/api/superheroes/new-lists/${newName}/New%20List`, {
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
            row.innerHTML = `<td>${newListName.value}</td>`;
            listTitle.appendChild(row)

            //includes rating instructions

            //list for rating
            const rowRateChoice = ratingChoice.value

            //ratebutton Listener
            rateButton.addEventListener('click', () => {
                    // Get the rating information from the row's content
                    const ratingInfo = row.textContent;
                
                    // Check if the row contains the selected list name and ratingChoice
                    if (ratingInfo.includes(newListName.value) && ratingInfo.includes(ratingChoice.value)) {
                        // Check if the row matches the expected format
                        listTitle.removeChild(row);
                        row.innerHTML = `<td>${newListName.value}   -   ${ratingText.value}/5  -   ${review.value}</td>`;
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
listView.addEventListener('click', function(event){
    let select = deleteDrop.value
    showSuperheroesInList(select)

});

//how to add superheroes to a list
addListButton.addEventListener('click', function(event){
    let select = deleteDrop.value
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


//AddResults method
const addResults = async (listname, result) => {
    try{
        const response = fetch(`/api/superheroes/custom-Idlists?listName=${listname}&superheroIds=${result}`);
        const listTab = (await response).json()
        return listTab


    }catch (error) {
    console.error('Error:', error);
    }
}

//how to delete superheroes from a list 
deleteListButton.addEventListener('click', function(event){
    let select = deleteDrop.value
    let useList = retrieveLists(select)
    try{
        const response =  fetch(`/api/superheroes/search_and_combined?pattern=${searchText}&field=${searchCriteria}&n=${1}`);
        if (response.ok){
            const dataSet = response.json()
            deleteHeroes(useList, dataSet)

        }
    

   
    }catch (error) {
        console.error('Error:', error);
    }
    
    
});


//delete heroes method 
const deleteHeroes = async (listName, result) =>{
    try{
        const response = fetch(`/api/superheroes/superhero_search/listName=${listName}&superheroIds=${result}`);
        const listTab = (await response).json()
        listName.remove(listTab)
        return listTab

    }catch (error) {
    console.error('Error:', error);
    }
}


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

