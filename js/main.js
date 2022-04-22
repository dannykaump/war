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
const replayButton = document.querySelector('a')
const button = document.querySelector('button')
const winsDOM = document.querySelector('#wins')
const lossesDOM = document.querySelector('#losses')
const deck = document.querySelector('#deck')
const scoreBoard = document.querySelector('.scoreboard')
const player1 = document.querySelector('#player1')
const player2 = document.querySelector('#player2')

const delay = 50 // ms

// GETS NEW DECK_ID
function shuffle() {
  showButton()
  setLocalStorage()
  fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      localStorage.setItem('deckId', data.deck_id)
      localStorage.setItem('remaining', data.remaining)
      updateScore()
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
  localStorage.setItem('score1', 0)
  localStorage.setItem('score2', 0)
}

//shuffle deck on page load
shuffle()


button.addEventListener('click', drawTwo)

addEventListener('keyup', function onEvent(e) {
  if (e.code === 'Enter') {
    drawTwo()
  }
});
// DRAW 2 CARDS FOM DECK W/ DECK_ID
function drawTwo() {
  const url = `https://www.deckofcardsapi.com/api/deck/${localStorage.deckId}/draw/?count=2`
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      clear()
      localStorage.setItem('remaining', data.remaining)
      // if first draw, ignore timeout
      if (localStorage.remaining === '50') {
        player2.src = data.cards[1].image
        player1.src = data.cards[0].image
      } else {
        player1.src = data.cards[0].image
        setTimeout(function () {
          player2.src = data.cards[1].image
        }, delay);
      }
      //assign values from drawn cards
      let playerVal = convertToNum(data.cards[0].value)
      let botVal = convertToNum(data.cards[1].value)
      //check for winner of each round
      checkRound(playerVal, botVal)
      // check for overall rounds won when deck is empty
      checkWinner(Number(localStorage.score1), Number(localStorage.score2))
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function clear() {
  input.classList.add('hidden')
  deck.classList.remove('hidden')
  main.classList.remove('hidden')
  saveName()
}

function saveName() {
  if (localStorage.getItem('userName') === null || localStorage.getItem('userName') === '') {
    localStorage.setItem('userName', input.value) // save username
  }
  playerName.innerHTML = localStorage.getItem('userName') || 'Player 1'
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
  let score1 = localStorage.getItem('score1')
  score1++
  localStorage.setItem('score1', score1)
}

function roundLost() {
  makeRed()
  h3.innerHTML = '<strong>Player 2</strong> Wins Round'
  let score2 = localStorage.getItem('score2')
  score2++
  localStorage.setItem('score2', score2)
}

// determines game winner & updates score
function checkWinner(val1, val2) {
  if (Number(localStorage.remaining) === 0) {
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
  h3.innerHTML = `Game over! <bong>${localStorage.userName}</bong> wins!`
  makeBlue()
  hideButton()
}

function gameLoss() {
  let lossCount = localStorage.getItem('losses')
  lossCount++
  localStorage.setItem('losses', lossCount)
  h3.innerHTML = `Game over! <bong>Player 2</bong> wins!`
  makeRed()
  hideButton()
}

function updateScore() {
  deck.innerHTML = `Deck : ${localStorage.remaining}`
  setTimeout(function () {
    playerScore.innerHTML = `<bong>${Number(localStorage.score1) * 2}</bong>`
    botScore.innerHTML = `<strong>${Number(localStorage.score2) * 2}</strong>`
  }, delay);
  showWins()
}

function showWins() {
  winsDOM.innerHTML = `Wins : <bong>${localStorage.getItem('wins')}</bong>`
  lossesDOM.innerHTML = `Losses : <strong>${localStorage.getItem('losses')}</strong>`

}

// play again -- shuffle, reset score
replayButton.addEventListener('click', replay)

function replay() {
  score1 = 0
  score2 = 0
  shuffle()
  main.classList.add('hidden')
  h3.innerHTML = ''
}

// quick styles

function hideButton() {
  replayButton.classList.remove('hidden')
  button.classList.add('hidden')
}

function showButton() {
  replayButton.classList.add('hidden')
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
