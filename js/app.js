/*
 *  Memory Game
 *  Udacity Front-End Developer assignment
 *
 *  Developed by Noreen Wu
 *  March 8, 2019
 *
 *  This module, app.js, contains all of the Javascript for this game.
 *  When this file is loaded, the newGame() function is called (see bottom of
 *  this file), and the game is setup: cards are created and each card
 *  is set up to listen for clicks. When a pair of cards has been turned over
 *  by the user, these are evaluated to see if a match has been found. When all matching
 *  pairs have been found, the user wins and a modal is displayed, to
 *  congratulate the user and to show the user how well s/he did.
 */


let openCards = [];           // this list will hold the cards the user has turned over
let numMoves = 0;
const movesElement = document.getElementsByClassName("moves")[0];
let numMatchedCards = 0;
const TOTCARDS = 16;

let numWrongMoves = 0;       // number of wrong moves affects your star-rating
const ADVENTURER = 4;
const SEASONED = 7;
const NOVICE = 10;
let timer = 0;               // will be set to ID of the function
let sec = 0;                 // the number of elapsed seconds since the game began
let elapsedTime = "00:00";   // the number of minutes and seconds since the game began,
                             //   displayed in a friendly format for the user

const deck = document.getElementById("deck");   // the deck element that will contain all cards

/*
 *  Modal functions: these functions relate to managing the modal that
 *  pops up when the user successfully wins the game.
*/
const modal = document.getElementById('congrats-modal');
const closeX = document.getElementsByClassName("close")[0];


// When the user clicks on the X in the modal, close the modal
closeX.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    closeModal();
  }
}

function closeModal() {
  modal.style.display = "none";
}

/* end of Modal functions */


/*
 *  The youWinMessage() and showCongratsAndStats() functions are called when
 *  all of the cards have been matched. The timer is stopped and the Congratulations
 *  modal is displayed.
 */
function showCongratsAndStats() {
  document.getElementById("modal-elapsed-time").textContent = elapsedTime;
  modal.style.display = "block";
}

function youWinMessage() {
  stopTimer();
  showCongratsAndStats();
}

/* end of Congratulations functions */


/*
 *  This function, getCardSymbol() is passed a card and returns the symbol
 *  of the card (which is a class on the card's classList). This is convenient
 *  for determining whether cards match.
 */
function getCardSymbol(c) {
  const symColl = c.getElementsByClassName("fa");
  const sym = symColl[0].classList[1];
  return sym;
}

/*
 *  If two cards have been flipped over and they don't match, then they
 *  need to be flipped back over (turned black) to hide the symbol. This is
 *  done by the functions hideCards() and hideCard(). The function
 *  hideCards() calls hideCard within the setTimeout Javascript function,
 *  so that the user has a chance to see what the symbols were, before
 *  they become invisible.
 */
function hideCard(c) {
  c.classList.remove("open");
  c.classList.remove("show");
  c.classList.remove("red");
}


function hideCards(c1, c2) {
    setTimeout(function() {
      hideCard(c1);
      hideCard(c2);
    }, 900);
}

/*
 *  The function lockCard() is called when a card has been part of a match.
 *  In this case, the card is turned green, and also the card's 'click'
 *  listener is removed, because it should not be listening for events
 *  anymore. It is "locked."
 */
function lockCard(c) {
  c.classList.remove("open");
  c.classList.remove("show");
  c.classList.add("match");
  // remove listener
  c.removeEventListener("click", cardClick);
}


/*
 * This function "turns off" or removes the gold from stars as the user
 * accumulates wrong moves throughout the game, by removing the class "lit"
 * from the star's classList. Although the modal message is not
 * visible until the user has won, the star ratings on the modal are
 * also updated here, so that they will display correctly at the end
 * of the game in the Congratulations message.
*/
function removeStars(level) {
  const stars = document.getElementsByClassName("stars");
  const fastar = stars[0].getElementsByClassName("fa-star");
  const modalFastar = stars[1].getElementsByClassName("fa-star");

  if (level == ADVENTURER) {
    // 2 stars should be shown: unhighlight the 3rd star
    fastar[2].classList.remove("lit");
    modalFastar[2].classList.remove("lit");
  } else if (level == SEASONED) {
    // 1 star should be shown: unhighlight the 2nd star
    fastar[1].classList.remove("lit");
    modalFastar[1].classList.remove("lit");
  } else if (level == NOVICE) {
    // no stars should be shown: unhighlight the 1st star
    fastar[0].classList.remove("lit");
    modalFastar[0].classList.remove("lit");
  }
}


/*
 * If the user has only made one move, then use "Move" rather than "Moves."
 */
function updateMoveP(numMoves) {
  let movep = "Moves";

  (numMoves == 1) ? movep = "Move" : movep = "Moves";
  document.getElementsByClassName("move-plurality")[0].textContent = movep;
}

/*
 * Emphasize to the user that the current pair is not a match by turning the
 * mismatched pair red. An element of class "card" and "red" is defined to
 * have a background of red in the css definitions.
 */
function flashRed(c1, c2) {
  c1.classList.add("red");
  c2.classList.add("red");
}


/*
 *  The function checkForMatch() holds the central piece of logic for the
 *  game. It is called once the user has flipped over 2 cards. It determines
 *  whether a match has been found or not and calls the appropriate functions
 *  that will lock the cards, flip them back over, adjust the star rating
 *  and number of moves.
 */
function checkForMatch() {
  const sym1 = getCardSymbol(openCards[0]);
  const sym2 = getCardSymbol(openCards[1]);

  if (sym1 == sym2) {           // user found 2 matching cards!
    for (const oc of openCards) {
      lockCard(oc);             // lock the 2 matching cards
    }
    numMatchedCards += 2;       // add 2 to the total number of matched cards!

    if (numMatchedCards == TOTCARDS) {
      setTimeout(function() {
        youWinMessage();
      }, 1000);
    }
  } else {                       // the 2 overturned cards do not match
      // show red

      flashRed(openCards[0], openCards[1]);
      hideCards(openCards[0], openCards[1]);
      numWrongMoves++;
      // this logic adjusts the number of gold stars shown
      if (numWrongMoves > NOVICE) {
        removeStars(NOVICE);
      } else if (numWrongMoves > SEASONED) {
        removeStars(SEASONED);
      } else if (numWrongMoves > ADVENTURER) {
        removeStars(ADVENTURER);
      }
  }
  // whether there was a match or not, remove from the open card list
  openCards = [];
  numMoves++;
  movesElement.textContent = numMoves;
  updateMoveP(numMoves);
}



// This function was provided as part of the assignment. It allows the deck
// of cards to be shuffled at the start of each game.
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



/* The array theSymbols[] holds a copy of each symbol that may appear
 *  in the game. This array will be scrambled by the provided shuffle() function,
 *  whenever a new game is begun.
 */
const theSymbols = [
      "fa-diamond",
      "fa-diamond",
      "fa-anchor",
      "fa-anchor",
      "fa-bolt",
      "fa-bolt",
      "fa-cube",
      "fa-cube",
      "fa-leaf",
      "fa-leaf",
      "fa-bicycle",
      "fa-bicycle",
      "fa-bomb",
      "fa-bomb",
      "fa-paper-plane-o",
      "fa-paper-plane-o"
    ];


/* The html for the cards is built here, in createDeck(). The <li> items are created with class
 * "card", and items of class "fa" are created inside each. The html structure of the
 * card is like this:
 *   <li class="card">
 *     <i class="fa fa-cube"></i>
 *   </li>
 * The order of the cards is randomized by appending symbols as classes from the
 * shuffled array, shuffledSymbols.
 */
function createDeck(d) {
  // remove an existing deck
   while(d.hasChildNodes()) {
     d.firstChild.remove();
   }

   const shuffledSymbols = shuffle(theSymbols);        // here, the symbols are shuffled

   for(let i=0;i<TOTCARDS;i++) {
     let ele = document.createElement("li");
     ele.classList = "card";
     let item = document.createElement("i");
     item.classList.add("fa");
     item.classList.add(shuffledSymbols[i]);        // insert a shuffled card symbol here
     ele.appendChild(item);
     d.appendChild(ele);
   }
}



/*
 *  This function, startListening(), loops through all of the
 *  cards in the deck and adds a 'click' listener to them. This is
 *  done with each new game since the cards are destroyed and regenerated
 *  each time, in order to shuffle the deck.
 */
function startListening() {
  const cards = document.getElementsByClassName("card");
  for (const c of cards) {
    c.addEventListener('click', cardClick);
  }
}


/* * *
 *  The following functions relate to the timer, which is set to 0 when the game
 *  is loaded or anytime the game restarts.
 */

 /*
  *  The function padZeroes() is just helping to print the elapsed time in the
  *  format 00:00 (minutes:seconds).
  */
function padZeroes(val) {
  return val > 9 ? val : "0" + val;
}

/*
 * The function gameTimer() constructs the elapsed time in the minutes:seconds
 * format that the user will see. This function is called once every second
 * and creates the appearance of the clock ticking while the user is playing.
 */
function gameTimer() {
  const secStr = padZeroes(sec%60);
  const minStr = padZeroes(parseInt(sec/60));
  elapsedTime = `${minStr}:${secStr}`;
  document.getElementById("elapsedTime").textContent = elapsedTime;
  sec += 1;
}

/*
 * When the user has successfully finished matching all of the cards, the
 * game is over and the timer is stopped by this function, stopTimer().
 */
function stopTimer() {
  clearInterval(timer);
}

/*
 *  The timer is reset to 0 any time a new game begins.
 */
function resetTimer() {
    stopTimer();
    sec = 0;                     // number of seconds since the game began
    elapsedTime = "00:00";
}
/*  end of timer functions */


/*
 * If a card is clicked, it turns green and its symbol is shown to the user. This detailed work
 * is done by the function showCard(). In addition, the card that has been flipped is added to
 * a list of openCards[], so that it may be determined if the user has found a match or not.
 * This matching test is taken care of by the function addToOpenCards().
*/
function cardClick() {
    showCard(this);
    addToOpenCards(this);
}

/*
 * The function showCard() adds the classes "open" and "show" to the card. This activates
 * css which allow the user to see the symbol on the card.
 */
function showCard(c) {
  c.classList.add("open");
  c.classList.add("show");
}

/*
 * The function addToOpenCards() adds the card that was just flipped over to an array
 * called openCards. If there are 2 cards on openCards[], a chain of logic follows,
 * first to see if there is a match and then to handle what should happen if there isn't
 * a match (flip the cards back over), or what should happen if there is a match (lock
 * the cards, so they appear in green and stay flipped in the open position).
*/
function addToOpenCards(c) {
    if (openCards.length == 0) {    // TODO: change to shorter if-else construction
      openCards.push(c);
    } else if (openCards.length == 1) {
      if (openCards[0] != c) {     // if the user double-clicks on the same card, we don't want
        openCards.push(c);         // the identical card to be placed on the openCards array, because
                                   // the symbols will match.
      }
    }

    if (openCards.length == 2) {
      checkForMatch();
    }
}



/*
 * The number of stars that appear to be gold or "lit" has to be reset every time a
 * new game begins.
 */
function resetStars() {
  const stars = document.getElementsByClassName("fa-star");

  for (let s of stars) {
    s.classList.add("lit");
  }
}



/*
 *  The functions newGameMsg() and displayNewGameMessage() are used
 *  to briefly flash a message to the user confirming that a new game
 *  has started.
 */
function newGameMsg(str) {
  document.getElementById("newgame-msg").textContent= str;
}

function displayNewGameMessage() {
  newGameMsg("New Game: Good Luck!");
  setTimeout(function() {
    newGameMsg("");
  }, 1800);
}

/*
 *  Lots of stuff has to be reset when the user starts a new game.
 *  The deck is cleared and the cards are shuffled. The modal, if open,
 *  is closed and the number of moves is set to 0. The stars reset to
 *  the maximum you can earn, 3. The timer is reset, and the new cards
 *  are set up to listen for clicks. Also, a quick message confirms to
 *  the user that they have begun a new game.
 */
function newGame() {
  numMatchedCards = 0; numWrongMoves = 0; numMoves = 0;
  movesElement.textContent = numMoves;

  closeModal();
  createDeck(deck);
  updateMoveP(0);
  resetTimer();
  resetStars();
  startListening();
  displayNewGameMessage();
  timer = setInterval(gameTimer, 1000);  // increment timer every 1000ms (1 sec)
}

/*
 *  The newGame function kicks off a brand new game once this game's url is
 *  accessed, or if the user resets the game by either clicking the reset button or
 *  by answering "yes" to the question, "Do you want to play again," which
 *  appears in the Congratulations modal.
 */
newGame();
