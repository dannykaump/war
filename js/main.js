// WAR 
const main = document.querySelector('main')
const h3 = document.querySelector('h3')
const h2 = document.querySelector('h2')
const h1 = document.querySelector('h1')
const playerScore = document.querySelector('#userScore')
const botScore = document.querySelector('#botScore')
const input = document.querySelector('input')
const playerName = document.querySelector('#user')
const botName = document.querySelector('#bot')
const reload = document.querySelector('a')
const button = document.querySelector('button')
const winsDOM = document.querySelector('#wins')
const lossesDOM = document.querySelector('#losses')
const aside = document.querySelector('aside')
// make these localStorage
let deckId = ''
let score1 = 0
let score2 = 0

// GETS NEW DECK_ID
function shuffle() {
  showButton()
  fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      deckId = data.deck_id
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function setLocalStorage() {
  if (localStorage.getItem('wins') === null) {
    localStorage.setItem('wins', 0)
  }
  if (localStorage.getItem('losses') === null) {
    localStorage.setItem('losses', 0)
  }
  //if username stored, hide input
  if (localStorage.getItem('userName')) {
    input.classList.add('hidden')
  }
}

shuffle()
setLocalStorage()
winsDOM.innerHTML = `Wins: <bong>${localStorage.getItem('wins')}</bong>`
lossesDOM.innerHTML = `Losses: <strong>${localStorage.getItem('losses')}</strong>`

button.addEventListener('click', drawTwo)

addEventListener('keyup', function onEvent(e) {
  if (e.code === 'Enter') {
    drawTwo()
  }
});
// DRAW 2 CARDS FOM DECK W/ DECK_ID
function drawTwo() {
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      clear()
      document.querySelector('#player1').src = data.cards[0].image
      document.querySelector('#player2').src = data.cards[1].image
      //assign values from drawn cards
      let playerVal = convertToNum(data.cards[0].value)
      let botVal = convertToNum(data.cards[1].value)
      //check for winner of each round
      checkRound(playerVal, botVal)
      // check for overall rounds won when deck is empty
      checkWinner(data.remaining, score1, score2)
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function clear() {
  input.classList.add('hidden')
  aside.classList.remove('hidden')
  main.classList.remove('hidden')
}

function convertToNum(val) {
  switch (val) {
    case 'ACE':
      return 14
    case 'KING':
      return 13
    case 'QUEEN':
      return 12
    case 'JACK':
      return 11
    default:
      return Number(val)
  }
}
// determines round winner
function checkRound(val1, val2) {
  if (localStorage.getItem('userName') === null || localStorage.getItem('userName') === '') {
    localStorage.setItem('userName', input.value)
  }
  playerName.innerHTML = localStorage.getItem('userName') || 'Player 1'
  if (val1 > val2) {
    roundWon()
  } else if (val1 < val2) {
    roundLost()
  } else {
    h3.innerHTML = 'Time for <strong>War!</strong>'
  }
}

function roundWon() {
  makeBlue()
  h3.innerHTML = `<bong>${localStorage.userName || 'Player 1'}</bong> Wins Round`
  score1++
}

function roundLost() {
  makeRed()
  h3.innerHTML = '<strong>Player 2</strong> Wins Round'
  score2++
}

// determines game winner & updates score
function checkWinner(remaining, val1, val2) {
  if (remaining === 0) {
    if (val1 > val2) {
      gameWin()
    } else if (val1 < val2) {
      gameLoss()
    } else {
      h3.innerHTML = `Tie! Shuffling Cards`
      shuffle()
    }
  }
  updateScore()
}

function gameWin() {
  let winCount = localStorage.getItem('wins')
  winCount++
  localStorage.setItem('wins', winCount)
  h3.innerHTML = `Game Over! <bong>${localStorage.userName}</bong> Wins!`
  makeBlue()
  hideButton()
}

function gameLoss() {
  let lossCount = localStorage.getItem('losses')
  lossCount++
  localStorage.setItem('losses', lossCount)
  h3.innerHTML = `Game Over! <bong>Player 2</bong> Wins!`
  makeRed()
  hideButton()
}

function updateScore(data) {
  playerScore.innerHTML = `<bong>${score1 * 2}</bong>`
  botScore.innerHTML = `<strong>${score2 * 2}</strong>`
  aside.innerHTML = `Deck : ${data.remaining}`
}

//quick styles

function hideButton() {
  reload.classList.remove('hidden')
  button.classList.add('hidden')
}

function showButton() {
  reload.classList.add('hidden')
  button.classList.remove('hidden')
}

function makeBlue() {
  h1.style.color = 'dodgerblue'
  playerName.style.color = 'dodgerblue'
  botName.style.color = 'white'
}

function makeRed() {
  h1.style.color = 'rgb(255, 80, 80)'
  botName.style.color = 'rgb(255, 80, 80)'
  playerName.style.color = 'white'
}
