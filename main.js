
var paintedTable = document.querySelector('#painted-table');
var newGameBtn = document.querySelector('#new-game-btn');
var header = document.querySelector('header');
var timer = document.querySelector('#timer');

//create array for cards and push cards into array
var cards = document.querySelectorAll('.card');

//an empty selections array, add selections with each turn to compare later
var selections = [];

//array of classes to be shuffled/assigned when games start
var classes = [
            'stark', 'stark', 
            'lannister', 'lannister', 
            'baratheon', 'baratheon', 
            'targaryen', 'targaryen', 
            'greyjoy', 'greyjoy',
            'arryn', 'arryn',
            'tyrell', 'tyrell',
            'bolton', 'bolton',
            'martell', 'martell',
            'tully', 'tully'];



//add animated to instructions to attract user's attention
var animateH2 = function() {
  var h2Element = document.querySelector('h2');
  h2Element.classList.add('animated');
  h2Element.classList.add('pulse');
};

window.setTimeout(animateH2, 500);



//take last two cards selected and turn face down if they don't match
var noMatch = function(){
  selections[selections.length - 2].classList.add('facedown');
  selections[selections.length - 1].classList.add('facedown');
};



//establish timer and set/clear intervals
var timeCount = 0;
var timeGame = function(){
  timeCount++;
  timer.textContent = timeCount;
};

var startTimer = function (){
  var startTimerId = window.setInterval(timeGame, 1000);
  return startTimerId;
};

var stopTimer = function (intervalId) {
  window.clearInterval(intervalId);
};



//option to hide timer for those players that dislike seeing timer tick (like me)
var hideTimerBtn = document.getElementById('hide-timer-btn');

var toggleTimer = function() {
 if (timer.classList.contains('hidden')) {
  timer.classList.remove('hidden');
  hideTimerBtn.textContent = 'Hide Timer';
 
 } else {
  timer.classList.add('hidden');
  hideTimerBtn.textContent = 'Show Timer';
 }
};

hideTimerBtn.addEventListener('click', toggleTimer);



//variables for determineWinner() below
var bestTime = 0;
var bestTimeElement = document.querySelector('#best-time');
var winner = document.createElement('p');
var bestTimeAlert = document.createElement('p');
var playAgain = document.createElement('p');


var determineWinner = function() {
 var facedownCards = document.querySelectorAll('.facedown'); //array of cards still facedown AKA unmatched

  //if all cards have been matched game is over
  if (facedownCards.length === 0) {
      winner.textContent = 'Congrats you won in ' + timeCount + ' seconds!';
      header.appendChild(winner);

      //check for Best Time: if its the first game it will obviously be the best time, otherwise check if timeCount is less than bestTime
      if (timeCount < bestTime || bestTime === 0) {
        bestTime = timeCount;
        bestTimeElement.textContent = 'Best Time: ' + bestTime + ' seconds';
        bestTimeAlert.textContent = 'You got the best time! Play again and try to beat it!';
        header.appendChild(bestTimeAlert);

    } else {
        playAgain.textContent = 'Play again and try to beat the best time!';
        header.appendChild(playAgain);
    }
    stopTimer(startTimerId); //stop timer
  }
  //remove animation classes so if New Game is clicked again, it animates
  paintedTable.classList.remove('animated');
  paintedTable.classList.remove('pulse');
};



//basic function to flip a card over when it is selected
var flipCard = function(event) {
  var target = event.target;

  if (target.classList.contains('facedown')) {
    target.classList.remove('facedown');
    selections.push(target); //push targets to an array to compare later
    
    var firstChoice = selections[selections.length - 2]; 
    var secondChoice = selections[selections.length - 1];
    
    //if two cards are selected determine if they match
    if (selections.length % 2 === 0) {

      //if two choices have same class, its a match
      //but need to make sure if you clicked the same exact card, the game doesn't think you found a match--check ids
      if (firstChoice.classList[1] === secondChoice.classList[1] && firstChoice.id !== secondChoice.id){

        firstChoice.removeEventListener('click', flipCard);
        secondChoice.removeEventListener('click', flipCard);

        //highlights matches
        firstChoice.classList.add('match');
        secondChoice.classList.add('match');
  
      } else if (firstChoice.classList[1] !== secondChoice.classList[1] && firstChoice.id !== secondChoice.id) {
        window.setTimeout(noMatch, 500); //leave enough time for player to see cards
      }
    }
  } 
  determineWinner();
};



//classList is always going to have 3 classes -- '.facedown' gets replaced with '.match' when two cards have been matched
//so to reset the game the last two have to be removed and replaced with '.facedown' and a new class for matching purposes
var resetGame = function() {
  shuffle(classes);
  selections = [];

  paintedTable.classList.add('animated');
  paintedTable.classList.add('pulse');

  for (var i = 0; i < classes.length; i++) {
    cards[i].classList.remove(cards[i].classList[1]);
    cards[i].classList.remove(cards[i].classList[1]);

    cards[i].classList.add('facedown', classes[i]);
  }

  if (header.children.length > 4) { //if header has more than 5 children it indicates at least one game has already been played
    header.removeChild(header.children[4]); //remove end of game alerts so new game can start 
    header.removeChild(header.children[4]);
    
    timeCount = 0;
    timer.textContent = 0; //reset timer
    startTimerId = startTimer();

  } else if (timeCount === 0 && bestTime === 0) { //if very first game, need to start timer
      startTimerId = startTimer();
  
  } else { //if restarting while already playing but before winning, just need to reset timer
    timeCount = 0;
    timer.textContent = 0; //reset timers

  }

  //added event listener to children of parent element as per this article: http://www.kirupa.com/html5/handling_events_for_many_elements.htm
  //inside function so player must press New Game button before they can flip cards
  paintedTable.addEventListener('click', flipCard, false);
};

newGameBtn.addEventListener('click', resetGame);



//Fisher-Yates (aka Knuth) Shuffle: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
var shuffle = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};



