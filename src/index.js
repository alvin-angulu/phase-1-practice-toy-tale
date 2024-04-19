// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Select elements from the DOM
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector('.add-toy-form');
  let addToy = false; // Boolean to control form visibility

  // Event listener for the Add Toy button to toggle the form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Handle form submission for adding new toys
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally
    postToy({
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    });
  });

  // Function to post a new toy to the server
  function postToy(toyData) {
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(toyData)
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy); // Render the new toy on the page
      toyForm.reset(); // Reset form fields after submission
    })
    .catch(error => console.error('Error:', error)); // Log errors to the console
  }

  // Function to fetch all toys from the server and render them
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => toys.forEach(renderToy)) // Render each toy using renderToy function
      .catch(error => console.error('Error:', error)); // Handle errors
  }

  // Function to create a toy card and append it to the DOM
  function renderToy(toy) {
    let card = document.createElement('div');
    card.className = 'card';

    let h2 = document.createElement('h2');
    h2.textContent = toy.name;

    let img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';

    let p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;

    let button = document.createElement('button');
    button.className = 'like-btn';
    button.id = `like-${toy.id}`;
    button.textContent = 'Like <3';
    button.addEventListener('click', () => increaseLikes(toy, p)); // Add click listener to increase likes

    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    toyCollection.appendChild(card);
  }

  // Function to handle like button clicks and update the toy's likes on the server
  function increaseLikes(toy, pElement) {
    let newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      pElement.textContent = `${updatedToy.likes} Likes`; // Update likes display in the DOM
      toy.likes = updatedToy.likes; // Sync the local state with the server
    })
    .catch(error => console.error('Error:', error)); // Handle errors
  }

  // Call fetchToys to load toys and render them when the page loads
  fetchToys();
});
