const fs = require('fs')
const path = require('path')

let saveJson = (file, json) => {
    fs.writeFileSync(file, JSON.stringify(json, null, 2), 'utf8')
}

let exist = (file) => {
    return fs.existsSync(file)
}

/**
 * @param {string} p 
 */
let checkPaths = (p) => {
    if(!exist(p) && !p.endsWith('.json')) {
        fs.mkdirSync(p, {
            recursive:true
        })
    }
}

/**
 * create an item model
 * @param {string} main_path 
 * @param {string} model_type 
 * @param {string} model_path 
 * @param {{ layer0:string }} texture texture
 * @param {string} name Comment function
 */
let itemModel = (main_path, model_type, model_path, texture, name='itemModel') => {
    let json_model = {
        __comment:`Generated by generateResources.js function: ${name}`,
        parent:model_type,
        textures:texture
    }

    let join = path.join(main_path, `${model_path}.json`)
    // check the model path, if one of the folder in the path is missing, create it.
    checkPaths(join)

    saveJson(join, json_model)
}

let itemGenerated = (main_path, model_path, texture) => {
    itemModel(main_path, 'item/generated', model_path, { layer0:texture }, 'itemGenerated')
}

/**
 * Create a shaped recipe
 * @param {string} main_path 
 * @param {string} json_path 
 * @param {string[]} pattern 
 * @param {{}} key 
 * @param {string} result 
 * @param {number} count 
 */
let shapedRecipe = (main_path, json_path, pattern, key, result, count) => {
    let json = {
        __comment:'Generated by generateResources.js function: shapedRecipe',
        type: 'minecraft:crafting_shaped',
        pattern:pattern,
        key:key,
        result:{
            item:result,
            count:count
        }
    }

    // recipes path
    let recipe_path = path.join(main_path, 'recipes', json_path)
    // create the path if it doesn't exist
    let p = recipe_path.split('\\')
    p.pop()
    checkPaths(p.join('\\'))

    saveJson(recipe_path, json)
}

/**
 * TFC Shaped Brick Recipe
 * @param {string} main_path 
 * @param {string} json_path 
 * @param {string} input 
 * @param {string} output 
 */
let brickRecipe = (main_path, json_path, input, output) => {
    shapedRecipe(main_path, json_path, [ "XOX","OXO","XOX" ], {
        "O": {
          "type": "forge:ore_dict",
          "ore": "mortar"
        },
        "X": {
          "item": input
        }
      }, output, 4)
}

let dyeRecipe = (main_path, json_path, input1, input2, output) => {
    shapedRecipe(main_path, json_path, ["XXX", "XOX", "XXX"], {
        "X": input1,
        "O": input2
    }, output, 8)
}

let item = (name, count=1) => {
    return {
        'item':name,
        'count': count
    }
}

let oredict = (name, count=1) => {
    return {
        'type': 'forge:ore_dict',
        'ore':name,
        'count': count
    }
}

/**
 * translate a file
 * @param {string[]} keys 
 * @param {string[]} text 
 */
let translate = (keys, text) => {
    text.forEach((element, i, a) => {
        text[i] = capitalize(element)
    })
    return `${keys.join('.')}=${text.join(' ')}`
}

/**
 * Capitalize a string
 * @param {string} text 
 */
let capitalize = (text) => {
    if(text.includes('_')) {
        let array = text.split('_')
        array.forEach((element, i, a) => {
            array[i] = element.trim().replace(/^\w/, (c) => c.toUpperCase());
        })
        return array.join(' ')
    }
    return text.trim().replace(/^\w/, (c) => c.toUpperCase());
}

let getRockPart = (part, rock) => {
    if(part == 'mossy_bricks') {
        return [`mossy_${rock}_bricks`]
    }
    else if(part == 'cracked_bricks') {
        return [`cracked_${rock}_bricks`]
    }
    else if(part == 'mossy_cobble') {
        return [`mossy_${rock}_cobble`]
    }
    else if(part == 'raw_mud') {
        return [rock, 'mud']
    }
    return [rock, part]
}

/**
 * translatations for tfc decoration
 * @param {string} path_to_lang 
 * @param {string[]} rock_types 
 * @param {string[]} rock_parts 
 * @param {string[]} wood_types 
 * @param {string[]} wood_parts 
 */
let translateAll = (path_to_lang, rock_types, rock_parts, wood_types, wood_parts, createFile=false) => {
    let output = '# Generated by generateResources.js'

    output+='\n#Rock Blocks/Items'

    for(let rock_type of rock_types) {
        output+=`\n`
        for(let rock_part of rock_parts) {
            output+=`\n${translate(['tile', 'tfc_decoration', rock_part, rock_type, 'name'], getRockPart(rock_part, rock_type))}`
        }
        output+=`\n${translate(['item', 'tfc_decoration', 'mud_brick', rock_type, 'name'], [rock_type, 'mud_brick'])}`
        output+=`\n${translate(['item', 'tfc_decoration', 'mud_ball', rock_type, 'name'], [rock_type, 'mud_ball'])}`
    }

    output+='\n\n#Wood Blocks/Items'

    for(let wood_type of wood_types) {
        output+=`\n`
        for (let wood_part of wood_parts) {
            output+=`\n${translate(['tile', 'tfc_decoration', 'wood', wood_part, wood_type, 'name'], [wood_type, wood_part])}`
        }
    }

    let file = path.join(path_to_lang, 'en_us.lang')

    // create the file if createFile is true to make sure we don't accidently override it.
    if(createFile) fs.writeFileSync(file, output, 'utf8')
}

module.exports = {
    itemModel,
    itemGenerated,
    capitalize,
    translateAll,
    brickRecipe,
    dyeRecipe,
    shapedRecipe,
    item,
    oredict
}