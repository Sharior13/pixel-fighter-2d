const MAPS = {
    arena: {
        id: "arena",
        name: "Battle Arena",
        width: 2000,
        height: 800,
        groundY: 700,
        backgroundColor: "#1a1a2e",
        platforms: [],
        spawnPoints: [
            { x: 200, y: 400 },
            { x: 1800, y: 400 }
        ],
        boundaries: {
            left: 0,
            right: 2000,
            top: 0,
            bottom: 800
        }
    },
    
    forest: {
        id: "forest",
        name: "Mystic Forest",
        width: 2500,
        height: 900,
        groundY: 800,
        backgroundColor: "#2d5016",
        platforms: [],
        spawnPoints: [
            { x: 250, y: 500 },
            { x: 2250, y: 500 }
        ],
        boundaries: {
            left: 0,
            right: 2500,
            top: 0,
            bottom: 900
        }
    },
    
    volcano: {
        id: "volcano",
        name: "Volcanic Crater",
        width: 1800,
        height: 700,
        groundY: 600,
        backgroundColor: "#3d1e0e",
        platforms: [],
        spawnPoints: [
            { x: 200, y: 350 },
            { x: 1600, y: 350 }
        ],
        boundaries: {
            left: 0,
            right: 1800,
            top: 0,
            bottom: 700
        }
    },
    
    sky: {
        id: "sky",
        name: "Sky Temple",
        width: 2200,
        height: 1000,
        groundY: 900,
        backgroundColor: "#87ceeb",
        platforms: [],
        spawnPoints: [
            { x: 300, y: 600 },
            { x: 1900, y: 600 }
        ],
        boundaries: {
            left: 0,
            right: 2200,
            top: 0,
            bottom: 1000
        }
    },
    
    training: {
        id: "training",
        name: "Training Grounds",
        width: 1500,
        height: 600,
        groundY: 500,
        backgroundColor: "#4a4a4a",
        platforms: [],
        spawnPoints: [
            { x: 200, y: 300 },
            { x: 1300, y: 300 }
        ],
        boundaries: {
            left: 0,
            right: 1500,
            top: 0,
            bottom: 600
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