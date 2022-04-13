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

let deckId = ''
let score1 = 0
let score2 = 0

function shuffle() {
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

function drawTwo() {
  const url = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`
  clear()
  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)
      document.querySelector('#player1').src = data.cards[0].image
      document.querySelector('#player2').src = data.cards[1].image
      let playerVal = convertToNum(data.cards[0].value)
      let botVal = convertToNum(data.cards[1].value)
      updateDOM(playerVal, botVal)
      countWinLoss(data.remaining, score1, score2)
      updateScore()
    })
    .catch(err => {
      console.log(`error ${err}`)
    });
}

function countWinLoss(remaining, val1, val2) {
  if (remaining === 0) {
    if (val1 > val2) {
      let winCount = localStorage.getItem('wins')
      winCount++
      localStorage.setItem('wins', winCount)
      h3.innerHTML = `Game Over! <bong>${localStorage.userName}</bong> Wins!`
      makeBlue()
    } else if (val1 < val2) {
      let lossCount = localStorage.getItem('losses')
      lossCount++
      localStorage.setItem('losses', lossCount)
      h3.innerHTML = `Game Over! <bong>Player 2</bong> Wins!`
      makeRed()
    } else {
      h3.innerHTML = `Tie! Shuffling Cards`
      shuffle()
    }
    reload.classList.remove('hidden')
    button.classList.add('hidden')
  }
}

function updateDOM(val1, val2) {
  if (localStorage.getItem('userName') === null || localStorage.getItem('userName') === '') {
    localStorage.setItem('userName', input.value)
  }
  playerName.innerHTML = localStorage.getItem('userName') || 'Player 1'
  if (val1 > val2) {
    makeBlue()
    h3.innerHTML = `<bong>${localStorage.userName || 'Player 1'}</bong> Wins Round`
    score1++
  } else if (val1 < val2) {
    makeRed()
    h3.innerHTML = '<strong>Player 2</strong> Wins Round'
    score2++
  } else {
    h3.innerHTML = 'Time for <strong>War!</strong>'
  }
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

const checkWinner = (num1, num2) => num1 > num2 ? localStorage.userName || 'Player 1' : 'Player 2'

function clear() {
  input.classList.add('hidden')
  main.classList.remove('hidden')
}

function updateScore() {
  playerScore.innerHTML = `Score: <bong>${score1 * 2}</bong>`
  botScore.innerHTML = `Score: <strong>${score2 * 2}</strong>`
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