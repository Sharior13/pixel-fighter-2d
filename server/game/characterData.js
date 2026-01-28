const CHARACTERS = {
    luffy: {
        id: "luffy",
        name: "Luffy",
        stats: {
            maxHealth: 100,
            speed: 5.5,
            jumpForce: 12,
            weight: 1.0
        },
        abilities: {}
    },
    naruto: {
        id: "naruto",
        name: "Naruto",
        stats: {
            maxHealth: 95,
            speed: 6.0,
            jumpForce: 13,
            weight: 0.95
        },
        abilities: {}
    },
    zoro: {
        id: "zoro",
        name: "Zoro",
        stats: {
            maxHealth: 110,
            speed: 5.0,
            jumpForce: 11,
            weight: 1.1
        },
        abilities: {}
    },
    kakashi: {
        id: "kakashi",
        name: "Kakashi",
        stats: {
            maxHealth: 90,
            speed: 6.5,
            jumpForce: 14,
            weight: 0.9
        },
        abilities: {}
    }
};

const getCharacterData = (characterId)=>{
    return CHARACTERS[characterId] || null;
};

const getAllCharacterIds = ()=>{
    return Object.keys(CHARACTERS);
};

const validateCharacter = (characterId)=>{
    return CHARACTERS.hasOwnProperty(characterId);
};

const getRandomCharacter = ()=>{
    const ids = getAllCharacterIds();
    return ids[Math.floor(Math.random() * ids.length)];
};

module.exports = { CHARACTERS, getCharacterData, getAllCharacterIds, validateCharacter, getRandomCharacter };