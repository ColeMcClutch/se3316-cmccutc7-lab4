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
const usernameText = document.getElementById('userName')
const passwordText = document.getElementById('passWord')
const signUp = document.getElementById('signUp')
const logOut = document.getElementById('logOut')
const logIn = document.getElementById('logIn')
const loginScreen = document.getElementById('loginScreen')


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
signUp.addEventListener('click', () => {
    const response = fetch(`/api/register?email=${emailText}&password=${passwordText}&nickname=${usernameText}`);
    if(response.ok){
        const logData = response.json()
        alert(`New Account Added! Welcome ${usernameText}! You may login now`);
    }
})



//login
logIn.addEventListener('click', () => {
try{
    const response = fetch(`/api/login?email=${emailText}&password=${passwordText}`)
    if(response.ok){
        const account = response.json()
        if(account.nickname == 'admin'){
            //include code for give admion privliges
            loginScreen.innerHTML=''
            // Create a new paragraph element
            const profile = document.createElement('p');
            // Set the text content of the paragraph
            profile.textContent = `Welcome ${usernameText}!`;
            loginScreen.appendChild(profile)
            loginScreen.appendChild(logOut)
            const deleteUser = document.createElement('p')
            loginScreen.appendChild(deleteUser)
        } else{
        loginScreen.innerHTML=''
        // Create a new paragraph element
        const profile = document.createElement('p');
        // Set the text content of the paragraph
        profile.textContent = `Welcome ${usernameText}!`;
        loginScreen.appendChild(profile)
        loginScreen.appendChild(logOut)
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
    loginScreen.innerHTML=''
    loginScreen.appendChild(emailText)
        loginScreen.appendChild(passwordText)
        loginScreen.appendChild(usernameText)
        loginScreen.appendChild(signUp)
        loginScreen.appendChild(logIn)
        loginScreen.appendChild(logOut)
    

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

            const newOption = document.createElement('option')
            newOption.textContent = newListName.value
            newOption.value = newListName.value
            deleteDrop.appendChild(newOption)

            //Add List to listView
            const row = document.createElement('tr')
            row.innerHTML = `<td>${newListName.value}</td>`;
            listTitle.appendChild(row)


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

