
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


//Button commands
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


//sort
if (sortFilter=="name"){}
else if (sortFilter="race"){}
else if (sortFilter="publisher"){}
else if (sortFilter="Power"){}

//create
create.addEventListener("click", function() {
    // Code to run when the button is clicked
    
});

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

