const favorites = document.querySelectorAll('#like_card_icon')

for(let i = 0; i < favorites.length; i++) {
  var fav = favorites[i]
  fav.addEventListener('click', removeFav);
}

function removeFav(e) {
  e.preventDefault()
  console.log(e)
  var addFav = false;
  const cardId = e.target.dataset['id']
  fetch('/remove_favorite/' + cardId, {
    method: 'POST',
    body: JSON.stringify({
      'favorite': addFav
    }),

    headers: {
      'Content-Type': 'application/json'
    }
  })
  const cardDiv = document.getElementById(cardId);
  const parent = cardDiv.parentNode;
  parent.removeChild(cardDiv)

}