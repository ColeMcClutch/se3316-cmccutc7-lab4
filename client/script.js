//Button creations
const search = document.getElementById('searchBar')
const searchFilter = document.getElementById('searchDropDown')
const searchSubmit = document.getElementById('searchSubmit')

const sortFilter = document.getElementById('sortDropDown')
const sortSubmit = document.getElementById('sortSubmit')

const create = document.getElementById('creator')
const newListName = document.getElementById('newName')

const heroView = document.getElementById('heroView')
const listView = document.getElementById('heroView')

const deleteDrop = document.getElementById('deleteDropdown')

const pubButton = document.getElementById('publisherButton')

const deleteButton = document.getElementById('deleteSubmit')

console.log("hello")


//Button commands

// Function to display superhero data
const displaySuperheroes = () => {
    const tableBody = document.getElementById("subtitles");
    superheroes = fetch('/api/superheroes/superhero_info/:id')

    superheroes.forEach(superhero => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th>${superhero.id}</th>
            <th>${superhero.name}</th>
            <th>${superhero.race}</th>
            <th>${superhero.publisher}</th>
            <th>${superhero.powers.join(", ")}</th>
        `;
        tableBody.appendChild(row);
    });
};

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
    const response = await fetch('/api/superheroes/publisher_info')
    alert(response.textContent())
}


//Delete function


//search
// Function to fetch superheroes based on search criteria
const searchHeroes = async () => {
    const searchText = search.value
    const filter = searchFilter.value
    const response = await fetch(`/api/superheroes_info/search?pattern=${encodeURIComponent(searchText)}&field=${encodeURIComponent(filter)}`);
    if (response.ok) {
        const data = await response.json();
        displaySuperheroes(data)
        console.log('')
    } else {
        console.error('Request failed with status:', response.status);
    }
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
    fetchAndsortSuperheroes()
}
);



//Function for creating new  list
const createList = async () => {
    const newName = newListName.value
    try {
        const response = await fetch('/api/superheroes/new-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newName,
                description: 'Favorite Superheroes List',
            }),
        })
        if (response.ok) {
            newListName.value = ''
            retrieveLists()

            const newOption = document.createElement('option')
            newOption.text = newListName.value
            deleteDrop.appendChild(newOption)

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
    const response = await fetch('/api/custom-lists')
    if (response.ok) {
        const lists = await response.json()
        listView.textContent = '';
        lists.forEach(async (list) => {
            const listElement = document.createElement('div')
            listElement.textContent = list.name
            listElement.addEventListener('click', () => showSuperheroesInList(list.listName))
            listView.appendChild(listElement)
        })
    } else {
        console.error('Failed to retrieve lists')
    }
}

// Function to show superheroes in a selected list
const showSuperheroesInList = async (listName) => {
    // Send a request to the backend to retrieve superhero IDs in the selected list
    const response = await fetch(`/api/custom-lists/${listName}/superhero-ids`)
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
            const superheroElement = document.createElement('div');
            superheroElement.textContent = `
                <h3>${superhero.name}</h3>
                <p>Race: ${superhero.race}</p>
                <p>Publisher: ${superhero.publisher}</p>
                <p>Powers: ${superhero.powers.join(', ')}</p>
                `;
            heroView.appendChild(superheroElement);
        });
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

//Display lists immediately
displayAllLists()

//Display all superheroes
fetchAndDisplaySuperheroes()