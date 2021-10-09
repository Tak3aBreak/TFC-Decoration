const fs = require('fs')

let WOOD_TYPES = [
    'ash',
    'aspen',
    'birch',
    'chestnut',
    'douglas_fir',
    'hickory',
    'maple',
    'oak',
    'pine',
    'sequoia',
    'spruce',
    'sycamore',
    'white_cedar',
    'willow',
    'kapok',
    'acacia',
    'rosewood',
    'blackwood',
    'palm',
    'hevea'
]

for(let wood of WOOD_TYPES) {
    let code = {
        "__comment": "Generated by generateResources.js",
        "variants": {
            "facing=north": { "model": `tfc_decoration:wood/ladder/${wood}` },
            "facing=east":  { "model": `tfc_decoration:wood/ladder/${wood}`, "y": 90 },
            "facing=south": { "model": `tfc_decoration:wood/ladder/${wood}`, "y": 180 },
            "facing=west":  { "model": `tfc_decoration:wood/ladder/${wood}`, "y": 270 }
        }
    }
    fs.writeFileSync(`./${wood}.json`, JSON.stringify(code, null, 2))
}