
//Button creations
const search = document.getElementById('searchBar')
const sort = document.getElementById('sortBar')
const searchFilter = document.getElementById('searchDropDown').value
const sortFilter = document.getElementById('sortDropDown').value
const create = document.getElementById('creator')
const heroView = document.getElementById('hero')
const listView = document.getElementById('lists')
const view = document.getElementById('viewer')
const searchSubmit = document.getElementById('searchSubmit')
const sortSubmit = document.getElementById('sortSubmit')
const viewer = document.getElementById('viewer')
const newListName = document.getElementById('newName')
const selected = document.getElementById('selectHeroList')
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

// Event listener for the sort button click
sortSubmit.addEventListener('click', async () => {
    try {
        // Fetch superhero data from the back-end
        const superheroes = await fetchSuperheroes();
        // Display the sorted data
        displaySuperheroes(superheroes);
    } catch (error) {
        console.error('Error:', error);
    }
});

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
searchSubmit.addEventListener('submit', (event) => {
    event.preventDefault();
    const pattern = search.value;
    const field = searchFilter.value;

    // Send a request to the backend to search superheroes
    fetch(`/api/superheroes_info/search?pattern=${pattern}&field=${field}`)
        .then(response => response.json())
        .then(data => {
            // Clear previous search results
            viewer.innerHTML = '';

            // Display search results
            if (data.length > 0) {
                const resultContainer = document.createElement('div');
                resultContainer.innerHTML = `<h2>Search Results:</h2>`;

                data.forEach(superheroId => {
                    // Create a link to view superhero details
                    const link = `<a href="/superhero-details.html?id=${superheroId}">View Details</a>`;
                    resultContainer.innerHTML += `Superhero ID: ${superheroId} ${link}<br>`;
                });

                viewer.appendChild(resultContainer);
            } else {
                viewer.innerHTML = 'No results found.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


//sort functionality
const fetchAndDisplaySuperheroes = () => {
    fetch('/api/superhero_info')
        .then(response => response.json())
        .then(superheroes => {
            viewer.innerHTML = ''; // Clear previous list
            const field = sortFilter.value;

            superheroes.sort((a, b) => {
                if (a[field] < b[field]) return -1;
                if (a[field] > b[field]) return 1;
                return 0;
            });

            superheroes.forEach(superhero => {
                const superheroElement = document.createElement('div');
                superheroElement.innerHTML = `
                    <h3>${superhero.name}</h3>
                    <p>Race: ${superhero.race}</p>
                    <p>Publisher: ${superhero.publisher}</p>
                    <p>Powers: ${superhero.powers.join(', ')}</p>
                `;
                viewer.appendChild(superheroElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

// Load and display superheroes on page load
fetchAndDisplaySuperheroes();

// Handle sorting button click
sortSubmit.addEventListener('click', fetchAndDisplaySuperheroes);




//create
create.addEventListener("click", (event) => {
    // Code to run when the  create new list button is clicked
        event.preventDefault();
        const listName = newListName.value;

        // Send a request to the backend to create a new favorite list
        fetch(`/api/custom-lists`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: listName,
                description: 'Favorite Superheroes List'
            })
        })
            .then(response => response.json())
            .then(data => {
                // Display the created list in the favorite lists section
                const listElement = document.createElement('div');
                listElement.innerHTML = `<h2>${listName}</h2>`;
                listElement.addEventListener('click', () => showSuperheroesInList(listName));
                viewer.appendChild(listElement);
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Clear the input
        newListName.value = '';
    });

    // Function to show superheroes in a selected list
    function showSuperheroesInList(listName) {
        // Send a request to the backend to retrieve superhero IDs in the selected list
        fetch(`/api/custom-lists/${listName}/superhero-ids`)
            .then(response => response.json())
            .then(superheroIds => {
                select.innerHTML = ''; // Clear previous list

                if (superheroIds.length > 0) {
                    superheroIds.forEach(superheroId => {
                        // Send a request to the backend to retrieve superhero details
                        fetch(`/api/superhero-info/${superheroId}`)
                            .then(response => response.json())
                            .then(superhero => {
                                // Display superhero information and powers
                                const superheroElement = document.createElement('div');
                                superheroElement.innerHTML = `
                                    <h3>${superhero.name}</h3>
                                    <p>Race: ${superhero.race}</p>
                                    <p>Publisher: ${superhero.publisher}</p>
                                    <p>Powers: ${superhero.powers.join(', ')}</p>`;
                                select.appendChild(superheroElement);
                            });
                    });
                } else {
                    select.innerHTML = 'No superheroes in this list.';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

//Changes viewer to heroes
view.addEventListener('change', function () {
    // Check if the radio button is selected
    if (heroView.checked) {
    }
})


//Changes viewers to lists
view.addEventListener('change', function () {
    // Check if the radio button is selected
    if (listView.checked) {
    }

})

