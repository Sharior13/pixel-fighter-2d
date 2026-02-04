# Pixel Fighter 2D

A real-time multiplayer 2D fighting game built with Node.js, Socket.io, and HTML5 Canvas. Features server-authoritative gameplay, matchmaking, character selection, and smooth 60 FPS combat.

## Features

- **Real-time Multiplayer**: Play against opponents online with WebSocket-based networking
- **Server-Authoritative Gameplay**: All game logic runs on the server to prevent cheating
- **Matchmaking System**: Automatic queue-based matchmaking for fair matches
- **Character Selection**: Choose from multiple characters with unique abilities
- **Smooth 60 FPS**: High-performance rendering and physics simulation
- **Responsive Combat**: Input buffering system ensures no actions are lost
- **Time-Limited Matches**: 3-minute matches with automatic win conditions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sharior13/pixel-fighter-2d.git
cd pixel-fighter-2d
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. Open your browser and navigate to:
```
http://localhost: 2000
```

## Project Structure

```
project-root/
├── public/
│   └──assets/                         # Essential game files
│   └── index.html                     # Main HTML entry point
│   └── style.css                      # Global styles
│   └── js/                            # Essential java files
│       ├── main.js                    # Client entry, title screen logic
│       ├── socket.js                  # Client-side socket & input handling
│       ├── render.js                  # Game rendering & animation loop
│       ├── input.js                   # Keyboard input tracking
│       └── characterSelect.js         # Character selection UI
└── server/
    └── server.js                          # Express server & Socket.io initialization
    └── networking/
    │   └── socketHandler.js           # Server socket event handlers
    └── game/
        ├── matchMaking.js             # Queue & match creation
        ├── matchManager.js            # Match state & character selection
        ├── gameState.js               # Game loop & physics simulation
        └── characterData.js           # Character stats & abilities
```

## How to Play

### Controls

- **WAD**: Move your character
- **S**: Block Damage
- **Z / J**: Basic Attack
- **C / L**: Special Ability

### Gameplay Flow

1. **Title Screen**: Click "Find Match" to enter matchmaking
2. **Matchmaking**: Wait for an opponent (automatic pairing)
3. **Character Selection**: Choose your character (10 seconds)
4. **Fight**: Battle your opponent until time runs out or someone's health reaches zero
5. **Results**: View the winner and return to title screen

## Architecture

### Server-Authoritative Model

The game uses a server-authoritative architecture where:
- **Client**: Captures player input and renders the game
- **Server**: Runs all game simulation, validates actions, and determines outcomes
- **Benefits**: Prevents cheating and ensures consistency across all clients
- **Trade-off**: Network latency (mitigated by 60 FPS synchronization)

### Key Systems

#### Input Buffer System
- Clients send inputs at 60 FPS continuously
- Server buffers up to 3 inputs per player
- Game tick processes one input from buffer per tick
- Ensures no input loss due to network jitter

#### State Synchronization
- Server broadcasts full game state 60 times per second
- Clients receive and render state directly
- High tick rate ensures visual smoothness
- No client-side prediction (simple, reliable approach)

#### Match Lifecycle
1. **QUEUE**: Players waiting for match
2. **CHARACTER_SELECT**: Choosing characters (10-second timeout)
3. **FIGHT**: Active gameplay (180-second max duration)
4. **ENDED**: Match finished, cleanup in progress

## Socket Events

### Client → Server
- `findMatch(mode, roomId)` - Request to join matchmaking
- `selectCharacter(characterId)` - Player selects a character
- `lockCharacter()` - Player confirms character choice
- `playerInput(inputs[])` - Send game inputs (60/sec during match)

### Server → Client
- `queueJoined()` - Confirmation of queue entry
- `matchFound({roomId, players})` - Match created
- `characterPreview({socketId, characterId})` - Opponent selected character
- `playerLocked({socketId, playerIndex, characterId})` - Opponent locked in
- `startMatch({roomId, players, gameState})` - Match begins
- `gameStateUpdate(state)` - Game state sync (60/sec)
- `abilityExecuted({socketId, ability, result})` - Ability notification
- `matchEnd({winner, finalStats, reason})` - Match finished
- `matchError({message})` - Error occurred
- `playerDisconnected(socketId)` - Player left the match

## Technologies Used

- **Backend**: Node.js, Express
- **Real-time Communication**: Socket.io
- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Architecture Documentation**: Mermaid.js

## Performance

- **Server Tick Rate**: 60 ticks per second
- **Client Frame Rate**: 60 FPS
- **Network Update Rate**: 60 updates per second
- **Input Latency**: ~16-33ms (1-2 frames)

## Future Enhancements

- Additional characters with unique movesets
- Power-ups and stage hazards
- Ranked matchmaking with ELO system
- Spectator mode
- Replay system
- Mobile touch controls
- Client-side prediction for reduced input latency
- Rollback netcode for better online experience

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built as a learning project for real-time multiplayer game development
- Inspired by classic 2D fighting games

---

**Note**: This game requires a stable internet connection for optimal multiplayer experience. Minimum recommended connection: 1 Mbps down/up with <100ms latency.
