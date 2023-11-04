import { response } from "express"
import { serialize } from "v8"

//Button creations
const search = document.getElementById('searchBar')
const searchFilter = document.getElementById('searchDropDown')
const searchSubmit = document.getElementById('searchSubmit')

const sortFilter = document.getElementById('sortDropDown')
const sortSubmit = document.getElementById('sortSubmit')

const create = document.getElementById('creator')
const newListName = document.getElementById('newName')

const heroButton = document.getElementById('hero')
const listButton = document.getElementById('lists')
const options = document.getElementById('clicker')

const heroView = document.getElementById('heroView')
const listView = document.getElementById('heroView')



//Button commands

// Function to fetch superhero data from the back-end
const fetchSuperheroes = async () => {
    try{
    const response = await fetch('/api/superhero_info');
    if(response.ok){
    const superheroes = await response.json();
    return superheroes
    }else{
        console.error('Failed to fetch superheroes');
    } 
    }catch (error) {
        console.error('Error:', error);
    }
}; 


// Function to display superhero data
const displaySuperheroes = (superheroes) => {
    heroView.innerHTML = ''; // Clear previous list
    superheroes.forEach(superhero => {

       
        const superheroElement = document.createElement('div');
        superheroElement.innerHTML = `
            <h3>${superhero.name}</h3>
            <p>Race: ${superhero.race}</p>
            <p>Publisher: ${superhero.publisher}</p>
            <p>Powers: ${superhero.powers.join(', ')}</p>
        `;
        heroView.appendChild(superheroElement);
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
});


//search
// Function to fetch superheroes based on search criteria
const searchHeroes = async () => {
    const searchText = search.value
    const filter = searchFilter.value
    const response = await fetch(`/api/superheroes_info/search?pattern=${searchText}&field=${filter}`);
    if (response.ok) {
        const data = await response.json();
        displaySuperheroes(data)
    } else {
        console.error('Request failed with status:', response.status);
    }
};

// Event listener for the search button click
searchSubmit.addEventListener('click', () => {
    searchHeroes()
});


// Handle sorting button click
sortSubmit.addEventListener('click', async () => {
        const sortValue = sortFilter.value
        const superheroes = await fetchSuperheroes()
        //Fetch and display sorted heroes
        superheroes.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
        displaySuperheroes(superheroes)
    } 
);

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
        const sort = sortFilter.value;
        const sortedSuperheroes = await fetchAndSortSuperheroes(sort);
        displaySuperheroes(sortedSuperheroes);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Load and display superheroes on initial page start
fetchAndDisplaySuperheroes();




//Function for creating new  list
const createList = async () => {
    const newName = newListName.value
    try{
        const response = await fetch ('/api/custom-lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newName,
                description: 'Favorite Superheroes List',
            }),
        })
        if (response.ok){
            newListName.value=''
            retrieveLists()
        } else {
            console.error('Failed to create a new list')
            return null
        }
    } catch (error){
        console.error('Error: ', error)
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
create.addEventListener('click', ()=> {
    createList()
})

//Function to retrieve and display favorite lists
const retrieveLists = async () => {
        const response = await fetch ('/api/custom-lists')
        if (response.ok){
            const lists = await response.json()
            listView.innerHTML = '';
            lists.forEach(async (list)=>{
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
       if(response.ok){
        const heroIDs = await response.json()
        const heroes = await Promise.all(
            heroIDs.map(async(superheroId) => {
                const response = await fetch(`/api/superhero-info/${superheroId}`);
                if (response.ok){
                    return response.json()
                }
            })
        )
        heroView.innerHTML = '';
        heroes.forEach((superhero) => {
            const superheroElement = document.createElement('div');
            superheroElement.innerHTML = `
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
heroView.addEventListener('load', async () => {
    try {
        const superheroes = await fetchSuperheroes();
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
        listView.innerHTML = ''; // Clear previous list
        if (lists.length > 0) {
          lists.forEach(list => {
            const listElement = document.createElement('div');
            listElement.innerHTML = `
              <h2>${list.name}</h2>
              <p>Description: ${list.description}</p>`;
            listView.appendChild(listElement);
          });
        } else {
          listView.innerHTML = 'No lists have been created yet.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }


//Radio button operations
const radioButtons  = document.getElementsByName('view')
radioButtons.forEach(radio => {
    //Sets heros to be on screen already
    heroButton.checked = true

    //Changes viewers to lists

    options.addEventListener('change', function () {
        // Check if the radio button is selected
        if (listButton.checked = true) {
            heroButton.checked = false
            listView.classList.toggle('highlighted');
            heroView.classList.toggle('unhighlighted');


            displayAllLists()
        }
        else if (heroButton.checked = true){
            listButton.checked = false
            heroView.classList.toggle('highlighted');
            listView.classList.toggle('unhighlighted');

            showSuperheroesInList()
        }
    })
})
