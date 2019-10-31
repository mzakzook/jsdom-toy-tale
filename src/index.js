let showForm = false

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    showForm = !showForm
    if (showForm) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })
  listenForSubmit()
  listenToClicks()
})

function fetchToys() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(data => getToys(data))
}

function getToys(data) {
  const container = document.getElementById('toy-collection')
  container.innerHTML = data.map(toy =>
    
    `<div class="card" id="${toy.id}">
      <h2>${toy.name}</h2> 
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes}</p>
      <button class="like-btn">Like <3</button>
    </div>`
  ).join('')
  
}


function listenForSubmit() {
  const form = document.querySelector(".add-toy-form");
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    getToyInfo(event);
  });
}
  

function getToyInfo(event) {
  const form = event.target;
  let name = form.name.value;
  const imgUrl = form.image.value;
  const toy = {
    name: name,
    image: imgUrl,
    likes: 0
  }
  
  createToy(toy);
  form.name.value = ""
  form.image.value = ""
}

function createToy(toy) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toy)
  })
    .then(res => res.json())
    .then(toy => {
      const newDiv = document.createElement('div');
      newDiv.className = "card"
      newDiv.id = `${toy.id}`;
      newDiv.innerHTML = 
      `<h2>${toy.name}</h2> 
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes}</p>
      <button class="like-btn">Like <3</button>`;
      const container = document.getElementById('toy-collection')
      container.appendChild(newDiv)
    })
}

function listenToClicks() {
  const cards = document.getElementById('toy-collection')
  cards.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
      handleLike(event);
    }
  });
}

function handleLike(event) {
  const toyCard = event.target.parentElement
  addLike(toyCard);
}

function addLike(toyCard) {
  const likes = parseInt(toyCard.querySelector('p').textContent)
  fetch(`http://localhost:3000/toys/${toyCard.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },

    body: JSON.stringify({
      "likes": likes + 1
    })
  })
  .then(res => res.json())
  .then(data => {
    const toyLikes = toyCard.querySelector('p')
    toyLikes.textContent = data.likes
  })
}

fetchToys()