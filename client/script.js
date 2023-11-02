import { response } from "express"

//Button creations
const search = document.getElementById('searchBar')
const sort = document.getElementById('sortBar')
const searchFilter = document.getElementById('searchDropDown')
const sortFilter = document.getElementById('sortDropDown')
const create = document.getElementById('creator')
const heroView = document.getElementById('hero')
const listView = document.getElementById('lists')
const view = document.getElementById('viewer')
const searchSubmit = document.getElementById('searchSubmit')
const sortSubmit = document.getElementById('sortSubmit')
const viewer = document.getElementById('viewer')
const newListName = document.getElementById('newName')
const favorite = document.getElementById('favoriteLists')


//Button commands

// Function to fetch superhero data from the back-end
const fetchSuperheroes = async () => {
    const response = await fetch('/api/superhero_info');
    const superheroes = await response.json();
    return superheroes;
};

// Function to display superhero data
const displaySuperheroes = (superheroes) => {
    viewer.innerHTML = ''; // Clear previous list
    const field = sortFilter.value;

    superheroes.sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
    });

    superheroes.forEach(superhero => {

        // Sanitize user input using DOMPurify
        const sanitizedName = DOMPurify.sanitize(superhero.name);
        const sanitizedRace = DOMPurify.sanitize(superhero.race);
        const sanitizedPublisher = DOMPurify.sanitize(superhero.publisher);
        const sanitizedPowers = DOMPurify.sanitize(superhero.powers.join(', '));

        const superheroElement = document.createElement('div');
        superheroElement.innerHTML = `
            <h3>${sanitizedName}</h3>
            <p>Race: ${sanitizedRace}</p>
            <p>Publisher: ${sanitizedPublisher}</p>
            <p>Powers: ${sanitizedPowers}</p>
        `;
        viewer.appendChild(superheroElement);
    });
};

// Load and display superheroes on page load
(async () => {
    try {
        const superheroes = await fetchSuperheroes();
        displaySuperheroes(superheroes);
    } catch (error) {
        console.error('Error:', error);
    }
})();


//search
// Function to fetch superheroes based on search criteria
const fetchSuperheroesByCriteria = async (searchCriteria, searchText) => {
    const response = await fetch(`/api/superheroes_info/search?pattern=${searchText}&field=${searchCriteria}`);
    if (response.ok) {
        const data = await response.json();

        // Clear previous viewer results
        viewer.innerHTML = '';

        if (data.length > 0) {
            // Display results
            data.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.textContent = result;
                viewer.appendChild(resultElement);
            });
        } else {
            // No results output
            viewer.textContent = 'No results';
        }
    } else {
        console.error('Request failed with status:', response.status);
    }
};

// Event listener for the search button click
searchSubmit.addEventListener('click', async () => {
    const searchText = search.value;
    const searchCriteria = searchFilter.value;
    try {
        // Fetch and display superheroes based on the search criteria
        await fetchSuperheroesByCriteria(searchCriteria, searchText);
    } catch (error) {
        console.error('Error:', error);
    }
});


// Handle sorting button click
sortSubmit.addEventListener('click', async () => {
    try {
        const sortValue = sortFilter.value
        //Fetch and display sorted heroes
        const sortedHeroes = await fetchAndSortSuperheroes(sortValue)
        displaySuperheroes(sortedHeroes)
    } catch (error){
        console.error('Error:', error)
    }
});

// Function to fetch and sort superheroes
const fetchAndSortSuperheroes = async (sortFilter) => {
    try {
        const response = await fetch('/api/superhero_info');
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
        const sortFilter = document.getElementById('sortFilter').value;
        const sortedSuperheroes = await fetchAndSortSuperheroes(sortFilter);
        displaySuperheroes(sortedSuperheroes);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Load and display superheroes on initial page start
fetchAndDisplaySuperheroes();




//Function for creating new favorite list
const createList = async (listName) => {
    try{
        const response = await fetch ('/api/custom-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: listName,
                description: 'Favorite Superheroes List',
            }),
        })
        if (response.ok){
            const newList = await response.json()
            return newList
        } else {
            console.error('Failed to create a new list')
            return null
        }
    } catch (error){
        console.error('Error: ', error)
        return null
    }
}

// Function to translate text
const translateText = async (text, targetLanguage) => {
    try {
      const [translation] = await translate.translate(text, targetLanguage);
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return the original text in case of an error
    }
  };



//Event listener for new list creator
create.addEventListener('click', async ()=> {
    const listName = newListName.value
    const translatedListName = await translateText(listName,'en')
    createList(translatedListName).then(() => {
        newListName.value = ''
        retrieveLists()
    })
})

//Function to retrieve and display favorite lists
const retrieveLists = async () => {
    try{
        const response = await fetch ('/api/custom-lists')
        if (response.ok){
            const lists = await response.json()
            viewer.innerHTML = '';
            lists.forEach(async (list)=>{
                const translatedListName = await translateText(list.listName, 'en')
                const listElement = document.createElement('div')
                listElement.innerHTML = '<h2>${translatedListName}}</h2>'
                listElement.addEventListener('click', () => showSuperheroesInList(list.listName))
                viewer.appendChild(listElement)
            })
        } else {
            console.error('Failed to retrieve lists')
        }
    } catch (error) {
        console.error('Error:', error)
    }
}

// Function to show superheroes in a selected list
function showSuperheroesInList(listName) {
    //Clear viewer
    viewer.innerHTML = ''; // Clear previous list

    // Send a request to the backend to retrieve superhero IDs in the selected list
    fetch(`/api/custom-lists/${listName}/superhero-ids`)
        .then(response => response.json())
        .then(superheroIds => {

            if (superheroIds.length > 0) {
                superheroIds.forEach(superheroId => {
                    // Send a request to the backend to retrieve superhero details
                    fetch(`/api/superhero-info/${superheroId}`)
                        .then((response) => response.json())
                        .then((superhero) => {
                            // Display superhero information and powers
                            const superheroElement = document.createElement('div');
                            superheroElement.innerHTML = `
                                <h3>${superhero.name}</h3>
                                <p>Race: ${superhero.race}</p>
                                <p>Publisher: ${superhero.publisher}</p>
                                <p>Powers: ${superhero.powers.join(', ')}</p>`;
                            viewer.appendChild(superheroElement);
                        })
                });
            } else {
                viewer.innerHTML = 'No superheroes in this list.';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    }

//Initial list retrieval and display
retrieveLists()


//Changes viewers to lists
view.addEventListener('change', function () {
    // Check if the radio button is selected
    if (listView.checked) {
    }

})

