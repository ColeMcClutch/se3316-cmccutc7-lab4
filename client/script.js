//Button creations
const search = document.getElementById('searchBar')
const searchFilter = document.getElementById('searchDropDown')
const searchSubmit = document.getElementById('searchSubmit')

const sortFilter = document.getElementById('sortDropDown')
const sortSubmit = document.getElementById('sortSubmit')

const create = document.getElementById('creator')
const newListName = document.getElementById('newName')

const heroView = document.getElementById('heroView')
const listView = document.getElementById('listView')
const listTitle = document.getElementById('listTitle')

const deleteDrop = document.getElementById('deleteDropdown')

const pubButton = document.getElementById('publisherButton')

const deleteButton = document.getElementById('deleteSubmit')



//Button commands

// Function to display superhero data
//Information side
const displaySuperheroes = () => {
    fetch('/api/superheroes/superhero_info')
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error('Failed to fetch superheroes');
        }
    })
    .then((superheroes) => {
        // Create an array of fetch promises
        const powersFetchPromises = superheroes.map(superhero => {
            return fetch(`/api/superheroes/superhero_powers/${superhero.id}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                });
            })
         // Wait for all powersFetchPromises to resolve
         return Promise.all(powersFetchPromises)
         .then((powersList) => {
             // Iterate through superheroes and powersList
             superheroes.forEach((superhero, index) => {
                 const powers = powersList[index];

                 // Create the table row and populate with data
                 const row = document.createElement("tr");
                 row.innerHTML = `
                     <td>${superhero.id}</td>
                     <td>${superhero.name}</td>
                     <td>${superhero.Race}</td>
                     <td>${superhero.Publisher}</td>
                     <td>${powers ? Object.keys(powers).filter(key => powers[key] === 'True').join(', ') : 'No powers'}</td>
                 `;



        row.querySelectorAll('td').forEach(td => {
            td.classList.add('centered-text');       
        });

        heroView.appendChild(row);
    });
})
})
.catch(error => {
    console.error('Error:', error);
});
}



// Load and display superheroes on page load
(() => {
    try {
        displaySuperheroes();
    } catch (error) {
        console.error('Error:', error);
    }
});

displaySuperheroes()



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

//Delete function


//EDIT CODE FROM HERE

//search
// Function to fetch superheroes based on search criteria
const searchHeroes = async () => {
    const searchText = search.value
    const filter = searchFilter.value
    try{
        const response = await fetch(`/api/superheroes/superhero_search?pattern=${encodeURIComponent(searchText)}&field=${encodeURIComponent(filter)}`);
        if (response.ok) {
            const data = await response.json();
            displaySearchSuperheroes(data)
        } else {
            console.error('Request failed with status:', response.status);
        }
    }catch (error){
        console.error('Error', error)
    }
};


const displaySearchSuperheroes = async (data) => {
    fetch('/api/superheroes/superhero_info')
    heroView.innerHTML = ''
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error('Failed to fetch superheroes');
        }
    })
    .then((superheroes) => {
    superheroes.forEach(superhero => {
        if(superhero.searchFilter.includes(data)){
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${superhero.id}</td>
            <td>${superhero.name}</td>
            <td>${superhero.Race}</td>
            <td>${superhero.Publisher}</td>
            <td>${superhero.powers && superhero.powers.length ? superhero.powers.join(", ") : 'No powers'}</td>
        `;


        row.querySelectorAll('td').forEach(td => {
            td.classList.add('centered-text');       
        });

        heroView.appendChild(row);
    }
    });
})

};


// Event listener for the search button click
searchSubmit.addEventListener('click', () => {
    searchHeroes()

});




// Function to fetch and sort superheroes
const fetchAndSortSuperheroes = async (sortFilter) => {
    try {
        const response = await fetch('/api/superheroes/superhero_info');
        if (response.ok) {
            const superheroes = await response.json();
            // Sort the superheroes based on the selected filter
            superheroes.sort((a, b) => {
                if (sortFilter === 'powers') {
                    // If sorting by powers, convert powers array to a string for comparison
                    const powersA = a[sortFilter].join(', ');
                    const powersB = b[sortFilter].join(', ');
                    return powersA.localeCompare(powersB);
                } else {
                    return a[sortFilter].localeCompare(b[sortFilter]);
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



//sort functionality
const fetchAndDisplaySuperheroes = async () => {
    try {
        const sort = sortFilter.value;
        const sortedSuperheroes = await fetchAndSortSuperheroes(sort);
        displaySuperheroes(sortedSuperheroes);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Handle sorting button click
sortSubmit.addEventListener('click',  () => {
    const sortValue = sortFilter.value
    const superheroes =  displaySuperheroes()
    //Fetch and display sorted heroes
    fetchAndSortSuperheroes()
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