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



//Button commands

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



//EDIT CODE FROM HERE

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
            const response = await fetch(`/api/superheroes/superhero_search?pattern=${searchText}&field=${searchCriteria}&n=${10}`);
            if (response.ok) {
                const dataSet = await response.json();
                dataSet.forEach((data) => {
                    console.log(data)
                    const heroResponse = fetch(`/api/superheroes/superhero_combined?id=${data}`);
                    if(heroResponse.ok){
                        const superheroes = heroResponse.json()
                        superheroes.forEach((hero) => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${hero.id}</td>
                                <td>${hero.name}</td>
                                <td>${hero.race}</td>
                                <td>${hero.publisher}</td>
                                <td>${hero.power}</td>
                            `;
    
                        row.querySelectorAll('td').forEach(td =>{
                            td.classList.add('centered-text');
                    })
    
                heroView.appendChild(row)
    
            
                })
            }})
                
            } else {
                console.error('Request failed with status:', response.status);
            }
        }catch (error){
            console.error('Error', error)
        }
    }
      





// Event listener for the search button click
searchSubmit.addEventListener('click', () => {
    searchHeroes()

});




// Function to fetch and sort superheroes
const SortSuperheroes = async () => {
    const sortCriteria = document.querySelector('input[name="sortTopic"]:checked').value;

    try {
        const response = await fetch('/api/superheroes/superhero_info');
        if (response.ok) {
            const superheroes = await response.json();
    
            // Sort the superheroes based on the selected filter
            superheroes.sort((a, b) => {
                if (sortCriteria === 'powers') {
                    // If sorting by powers, convert powers array to a string for comparison
                    const powersA = a.powers.join(', ');
                    const powersB = b.powers.join(', ');
                    return powersA.localeCompare(powersB);
                } else {
                    // Sort alphabetically based on the selected criteria (name, race, publisher)
                    return a[sortCriteria].localeCompare(b[sortCriteria]);
                }
            });
    
            return superheroes;
        } else {
            console.error('Failed to fetch superheroes');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};


// Handle sorting button click
sortSubmit.addEventListener('click',  () => {

    //Fetch and display sorted heroes
    SortSuperheroes()
}
);



//Function for creating new  list
const createList = async () => {
    const newName = newListName.value
    try {
        const response = await fetch(`/api/superheroes/new-lists/${newName}/New%20List`, {
            method: 'POST',  
        })
        if (response.ok) {
            newListName.textContent = ''
            retrieveLists()

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
    const response = await fetch('/api/superheroes/custom-lists')
    if (response.ok) {
        const lists = await response.json()
        listView.textContent = '';

        for(const listName in (lists)) {
            const listElement = document.createElement('div')
            listElement.textContent = listName
            listElement.addEventListener('click', () => showSuperheroesInList(listName))
            listView.appendChild(listElement)
        }
    } else {
        console.error('Failed to retrieve lists')
    }
}

// Function to show superheroes in a selected list
const showSuperheroesInList = async (listName) => {
    // Send a request to the backend to retrieve superhero IDs in the selected list
    try{
    const response = await fetch(`/api/superheroes/custom-lists/${listName}/superhero-ids`)
    if (response.ok) {
        const heroIDs = await response.json()
        const heroes = await Promise.all(
            heroIDs.map(async (superheroId) => {
                const response = await fetch(`/api/superhero-info/${superheroId}`);
                if (response.ok) {
                    return response.json()
                }
            })
        )
        heroView.textContent = '';
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

//Initial list retrieval and display
retrieveLists()


// Load and display superheroes on page load
heroView.addEventListener('load', () => {
    try {
        const superheroes =  displaySuperheroes();
        displaySuperheroes(superheroes);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to display all the created lists
function displayAllLists() {
    // Send a request to the backend to retrieve all created lists
    fetch(`/api/custom-lists`)
        .then(response => response.json())
        .then(lists => {
            listView.textContent = ''; // Clear previous list
            if (lists.length > 0) {
                lists.forEach(list => {
                    const listElement = document.createElement('div');
                    listElement.textContent = `
              <h2>${list.name}</h2>
              <p>Description: ${list.description}</p>`;
                    listView.appendChild(listElement);
                });
            } else {
                listView.textContent = 'No lists have been created yet.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
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



//Display lists immediately
displayAllLists()

//Display all superheroes
fetchAndDisplaySuperheroes()