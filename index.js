// Welcome to
// __________         __    __  .__                               __
// \______   \_____ _/  |__/  |_|  |   ____   ______ ____ _____  |  | __ ____
//  |    |  _/\__  \\   __\   __\  | _/ __ \ /  ___//    \\__  \ |  |/ // __ \
//  |    |   \ / __ \|  |  |  | |  |_\  ___/ \___ \|   |  \/ __ \|    <\  ___/
//  |________/(______/__|  |__| |____/\_____>______>___|__(______/__|__\\_____>
//
// This file can be a nice home for your Battlesnake logic and helper functions.
//
// To get you started we've included code to prevent your Battlesnake from moving backwards.
// For more info see docs.battlesnake.com

import runServer from './server.js';

// info is called when you create your Battlesnake on play.battlesnake.com
// and controls your Battlesnake's appearance
// TIP: If you open your Battlesnake URL in a browser you should see this data
function info() {
  console.log('INFO');

  return {
    apiversion: '1',
    author: 'mohzfr', // TODO: Your Battlesnake Username
    color: '#28603a', // TODO: Choose color
    head: 'all-seeing', // TODO: Choose head
    tail: 'nr-booster', // TODO: Choose tail
    version: '0.1',
  };
}

// start is called when your Battlesnake begins a game
function start(gameState) {
  console.log('GAME START');
}

// end is called when your Battlesnake finishes a game
function end(gameState) {
  console.log('GAME OVER\n');
}

// move is called on every turn and returns your next move
// Valid moves are "up", "down", "left", or "right"
// See https://docs.battlesnake.com/api/example-move for available data
function move(gameState) {
  let isMoveSafe = {
    up: true,
    down: true,
    left: true,
    right: true,
  };

  // We've included code to prevent your Battlesnake from moving backwards
  const myHead = gameState.you.body[0];
  const myNeck = gameState.you.body[1];

  if (myNeck.x < myHead.x) {
    // Neck is left of head, don't move left
    isMoveSafe.left = false;
  } else if (myNeck.x > myHead.x) {
    // Neck is right of head, don't move right
    isMoveSafe.right = false;
  } else if (myNeck.y < myHead.y) {
    // Neck is below head, don't move down
    isMoveSafe.down = false;
  } else if (myNeck.y > myHead.y) {
    // Neck is above head, don't move up
    isMoveSafe.up = false;
  }

  // TODO: Step 1 - Prevent your Battlesnake from moving out of bounds
  const boardWidth = gameState.board.width;
  const boardHeight = gameState.board.height;

  // Check if the next move is within the boundaries
  if (myHead.x <= 0) {
    isMoveSafe.left = false; // Don't move left if at the left edge
  } else if (myHead.x >= boardWidth - 1) {
    isMoveSafe.right = false; // Don't move right if at the right edge
  }

  if (myHead.y <= 0) {
    isMoveSafe.down = false; // Don't move down if at the bottom edge
  } else if (myHead.y >= boardHeight - 1) {
    isMoveSafe.up = false; // Don't move up if at the top edge
  }

  // TODO: Step 2 - Prevent your Battlesnake from colliding with itself
  const myBody = gameState.you.body;
  console.log('Body: ', myBody);
  console.log('Body part count: ', Object.keys(myBody));

  myBody.forEach((part) => {
    if (myHead.x === part.x) {
      if (myHead.y + 1 === part.y) {
        isMoveSafe.up = false;
      } else if (myHead.y - 1 === part.y) {
        isMoveSafe.down = false;
      }
    }

    if (myHead.y === part.y) {
      if (myHead.x + 1 === part.x) {
        isMoveSafe.right = false;
      } else if (myHead.x - 1 === part.x) {
        isMoveSafe.left = false;
      }
    }

    console.log('current part search: ', part);
  });

  // TODO: Step 3 - Prevent your Battlesnake from colliding with other Battlesnakes
  const opponents = gameState.board.snakes;
  

  const dangerousSpots = [];

  opponents.forEach((opponent) => {
    if (opponent.id !== gameState.you.id) {
      let oppHead = opponent.body[0];
      console.log('Opponents Head: ', oppHead);

      // Add positions around the opponent's head to the dangerous spots array
      const potentialDangerousSpots = [
        { x: oppHead.x, y: oppHead.y + 1 }, // Up
        { x: oppHead.x, y: oppHead.y - 1 }, // Down
        { x: oppHead.x + 1, y: oppHead.y }, // Right
        { x: oppHead.x - 1, y: oppHead.y }, // Left
      ];

      potentialDangerousSpots.forEach((spot) => {
        if (
          spot.x >= 0 &&
          spot.x < gameState.board.width &&
          spot.y >= 0 &&
          spot.y < gameState.board.height
        ) {
          // Check if the spot is within the boundaries
          dangerousSpots.push(`${spot.x}_${spot.y}`);
        }
      });
    }
  });

  // Check if the next move leads to a dangerous spot
  const nextMoveKey = `${myHead.x}_${myHead.y}`;
  if (dangerousSpots.includes(nextMoveKey)) {
    console.log(`MOVE ${gameState.turn}: Move to dangerous spot avoided! Moving down`);
    return { move: 'down' };
  }
  // Are there any safe moves left?
  const safeMoves = Object.keys(isMoveSafe).filter((key) => isMoveSafe[key]);
  if (safeMoves.length == 0) {
    console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
    return { move: 'down' };
  }

  // Choose a random move from the safe moves
  const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)];

  // TODO: Step 4 - Move towards food instead of random, to regain health and survive longer
  const food = gameState.board.food;

  // displayDebugInfo(myBody, isMoveSafe);
  console.log('Current Pos: (', myHead.x, ' ,', myHead.y, ')');
  console.log(
    'All Possible Moves:\nUp: ',
    isMoveSafe.up,
    '\nDown: ',
    isMoveSafe.down,
    '\nLeft: ',
    isMoveSafe.left,
    '\nRight: ',
    isMoveSafe.right
  );
  console.log(`MOVE ${gameState.turn}: ${nextMove}`);
  return { move: nextMove };
}

runServer({
  info: info,
  start: start,
  move: move,
  end: end,
});
