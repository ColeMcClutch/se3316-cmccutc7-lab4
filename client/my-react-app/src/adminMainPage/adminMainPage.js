import React from 'react';

const AdminPage = () => {







    
  return (
    <div>
      {/* Title */}
      <div className="title">
        <h1>Cole's List of Heroes</h1>
      </div>

      {/* Searching Methods */}
      <div className="searchMethods">
        {/* Name Searcher */}
        <input type="text" id="searchBar" name="searcher" placeholder="Search By:" />
        <ul id="results1"></ul>

        {/* Radio buttons for searching */}
        <fieldset>
          <legend>Topic:</legend>
          <label htmlFor="nameRadio">Name</label>
          <input type="radio" id="nameRadioSearch" name="searchTopic" value="name" />
          {/* ... Other radio buttons ... */}
        </fieldset>

        {/* Create new list button */}
        <button type="button" id="searchSubmit">Submit</button>

        {/* Create new list button */}
        <button type="button" id="creator">Create New List</button>

        {/* New list name maker */}
        <input type="text" id="newName" name="newName" placeholder="Name of new List:" />

        {/* Drop down for list */}
        <label htmlFor="listChoice">Public or Private List?:</label>
        <select id="listChoice">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        {/* Drop down for list */}
        <label htmlFor="deleteDropdown">Select list:</label>
        <select id="deleteDropdown"></select>

        {/* Delete list button */}
        <button type="button" id="deleteSubmit">Delete List</button>

        <button type="button" id="publisherButton">Publishers</button>

        {/* Hero choices for adding */}
        <label htmlFor="listHeroes">Heroes in List:</label>
        <select id="listHeroes"></select>

        {/* Create new list button */}
        <button type="button" id="addCustom">Add Hero to List</button>

        {/* Create new list button */}
        <button type="button" id="deleteCustom">Delete Hero From List</button>
      </div>

      {/* Show all lists */}
      <table id="listView">
        <h2>Lists:</h2>
        <tbody id="listTitle"></tbody>
      </table>

      {/* Shows superheroes from list */}
      <table id="heroView">
        <h2>Heroes:</h2>
        <div className="cellTitles">
          <h3>ID</h3>
          <h3>Name</h3>
          <h3>Race</h3>
          <h3>Publisher</h3>
          <h3>Powers</h3>
        </div>
        <thead>
          <tr>
            <th className="subtitle">ID</th>
            <th className="subtitle">Name</th>
            <th className="subtitle">Race</th>
            <th className="subtitle">Publisher</th>
            <th className="subtitle">Powers</th>
          </tr>
        </thead>
        <tbody id="subtitles">
          {/* Your superhero data rows will go here */}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;