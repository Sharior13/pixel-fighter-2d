const MAPS = {
    cathedral: {
        id: "cathedral",
        name: "Cathedral",
        width: 768 * 3,
        height: 368 * 3,
        groundY: 1000,
        backgroundColor: "#1a1a2e",
        platforms: [],
        spawnPoints: [
            { x: (768 * 3)/2 - 300, y: 900 },
            { x: (768 * 3)/2 + 300, y: 900 }
        ],
        boundaries: {
            left: 0,
            right: 768 * 3,
            top: 0,
            bottom: 368 * 3
        }
    },
    
    forest: {
        id: "forest",
        name: "Mystic Forest",
        width: 800 * 2,
        height: 336 * 2.2,
        groundY: 650,
        backgroundColor: "#2d5016",
        platforms: [],
        spawnPoints: [
            { x: (800 * 2)/2 - 300, y: 550 },
            { x: (800 * 2)/2 + 300, y: 550 }
        ],
        boundaries: {
            left: 0,
            right: 800 * 2,
            top: 0,
            bottom: 336 * 2.2
        }
    },
    
    "fire-village": {
        id: "fire-village",
        name: "Fire Village",
        width: 640 * 3,
        height: 480 * 2,
        groundY: 900,
        backgroundColor: "#3d1e0e",
        platforms: [],
        spawnPoints: [
            { x: (640 * 3)/2 - 300, y: 800 },
            { x: (640 * 3)/2 + 300, y: 800 }
        ],
        boundaries: {
            left: 0,
            right: 640 * 3,
            top: 0,
            bottom: 480 * 2
        }
    },
    
    waterfall: {
        id: "waterfall",
        name: "Waterfall",
        width: 624 * 3,
        height: 384 * 2,
        groundY: 700,
        backgroundColor: "#87ceeb",
        platforms: [],
        spawnPoints: [
            { x: (624 * 3)/2 - 600, y: 600 },
            { x: (624 * 3)/2 + 600, y: 600 }
        ],
        boundaries: {
            left: 0,
            right: 624 * 3,
            top: 0,
            bottom: 384 * 2
        }
    }
};

//get map data by id
const getMapData = (mapId)=>{
    return MAPS[mapId] || MAPS.arena;
};

//get all available map ids
const getAllMapIds = ()=>{
    return Object.keys(MAPS);
};

//validate map id
const validateMap = (mapId)=>{
    return MAPS.hasOwnProperty(mapId);
};

//get random map
const getRandomMap = ()=>{
    const ids = getAllMapIds();
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    return getMapData(randomId);
};

module.exports = { 
    MAPS, getMapData, getAllMapIds, validateMap, getRandomMap };