// select the like buttons on the webpage, returns an array
const favorites = document.querySelectorAll('#like_card_icon');

// loop through the like buttons array 
for (let i = 0; i < favorites.length; i++) {
  // var addFavorites = false;
  const favorite = favorites[i];

  // add event listener when it is clicked
  favorite.addEventListener("click", function (e) {
    // e.preventDefault()
    // console.log(e)
  if(favorite.classList.contains('liked')) {
    favorite.classList.remove('liked');
    favorite.classList.add('not-liked');
    var addFavorites = false;
    const cardId = e.target.dataset['id']

    // remove card from page as soon as it is unliked
    const cardToDelete = document.getElementById(cardId);
    const parent = cardToDelete.parentNode;
    parent.removeChild(cardToDelete)

    // Send data to server
    fetch('/remove_favorite/' + cardId, {
      method: 'POST',
      body: JSON.stringify({
        'favorite': addFavorites
      }),

      headers: {
        'Content-Type': 'application/json'
      }
    })
    const cardContainer = document.getElementsByClassName('nft-card-container');
    if(cardContainer.innerHTML == '') {
      console.log('EMPTY')
    }
  }
})
}


/* SEARCH NFT CARDS */ 
// get hold of the search bar
const searchInput = document.getElementById('search');

// add event listener
searchInput.addEventListener('keyup', searchCard);

async function searchCard(e) {
  console.log(e.target.value)
  cardName = searchInput.value //get hold of the input in the search field
  if(cardName) {
    // const search_url = {{ url_for("/search", name=cardName) }}
    const response = await fetch(`/search?name=${cardName}`)
    const data = await response.json()
    // console.log(data.cards);
    createCard(data.cards) // call create card function
  }else {
    // sends a request to server if no search input and it returns all the cards to be displayed.
    const response = await fetch(`/search?name=${cardName}`)
    const data = await response.json()
    createCard(data.cards) //
  }
}

function createCard(data) {
  // parent element
  const cardContainer = document.querySelector(".nft-card-container")
  // clear the container to make room for the search results to be inserted.
  cardContainer.innerHTML = ''
  // const parent = cardContainer.parentNode
  
  data.forEach((card)=> {
    const nft_card = document.createElement('div')
    nft_card.classList.add('nft-card', 'col-4', 'card', 'm-2')
    nft_card.setAttribute('id', card.id)
    // <div class="nft-card col-4 card m-2" id="${card.id}">
    const card_item = `
        <img src="${ card.card_img_url }" alt="" width="150px" height="200px" class="card-img-top mt-2 nft-card-img">
        <div class="card-body">
          <div class="card-text-wrap">
            <h6 class="nft-card-name card-title m-0">${ card.card_name }</h6>
            <p class="nft-card-text card-text"><span class="light">From</span> <span class="starting-price">${ card.price }</span> <img src="${ card.blockchain_logo_url }" alt="solana logo" class="small-blockchain-img" width="10px"></p>
            <span class="${card.status == 'Live' ?'live-status-color': ''} nft-status d-inline-block">
              ${card.status == 'Live' ? '<i class="fa-solid fa-fire-flame-simple"></i>': ''}
              ${card.status}
            </span>
          </div>
          <a src="#">
            <span>
              <i id="like_card_icon" class="${ card.favorite ?'liked' : 'not-liked' } like-btn fa-solid fa-heart" data-id="${ card.id }" data-name="${ card.favorite }"></i>
            </span>
          </a>
        </div>
    `
    nft_card.innerHTML = card_item
    cardContainer.appendChild(nft_card)
  })
}
