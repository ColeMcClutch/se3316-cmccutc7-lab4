
//Button creations
const search = document.getElementById('searchBar')
const sort = document.getElementById('sortBar')
const searchFilter = document.getElementById('searchDropDown').value
const sortFilter = document.getElementById('sortDropDown').value
const create = document.getElementById('creator')
const heroView = document.getElementById('hero')
const listView = document.getElementById('lists')
const view = document.getElementById('viewer')


//Button commands
//search
if (searchFilter=="name"){}
else if (searchFilter="race"){}
else if (searchFilter="publisher"){}
else if (searchFilter="Power"){}


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

