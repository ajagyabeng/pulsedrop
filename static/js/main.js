// FAVORITING AN NFT CARD
const favorites = document.querySelectorAll('#like_card_icon');

for (let i = 0; i < favorites.length; i++) {
  var addFavorites = false;
  const favorite = favorites[i];

  favorite.addEventListener("click", likeOrUnlike)
}

function likeOrUnlike(e) {
    console.log(e)
  if(this.classList.contains('not-liked')) {
    this.classList.remove('not-liked');
    this.classList.add('liked');
    var addFavorites = true;
  }else {
    this.classList.remove('liked');
    this.classList.add('not-liked');
    var addFavorites = false;
  }
  const cardId = e.target.dataset['id']
  fetch('/add_favorite/' + cardId, {
      method: 'POST',
      body: JSON.stringify({
        'favorite': addFavorites
      }),

      headers: {
        'Content-Type': 'application/json'
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
            <span class=" ${card.status == 'Live' ? 'live-status-color': ''} nft-status d-inline-block">
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


/* LIVE FILTER */ 

const liveNft = document.querySelector('#live-filter')
const upcomingNft = document.querySelector('#upcoming-filter')
const allNft = document.querySelector('#all-nfts')

liveNft.addEventListener('click', filterCards)
upcomingNft.addEventListener('click', filterCards)
allNft.addEventListener('click', filterCards)

async function filterCards(e) {
  e.preventDefault()
  console.log(e)
  const filterType = e.target.dataset['filter']

  // send fetch request to server
  const response = await fetch(`/filter?filter_status=${filterType}`)
  const data = await response.json()
  createCard(data.cards)
}

/* BLOCKCHAIN FILTER */

const blockchains = document.querySelectorAll('.filter-name')

for(let i = 0; i < blockchains.length; i++) {
  const blockchain = blockchains[i];

  blockchain.addEventListener('click', blcFilter)
}

async function blcFilter(e) {
  e.preventDefault()
  // console.log(e)
  const blockFilter = e.target.dataset['name']

  // send fetch request
  const response = await fetch(`/blc_filter?filter_blc=${blockFilter}`)
  const data = await response.json()
  createCard(data.cards)
}