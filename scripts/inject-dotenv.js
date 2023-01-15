import {dirname, resolve} from 'https://deno.land/std@0.150.0/path/mod.ts'
import {parse} from 'https://deno.land/std@0.150.0/dotenv/mod.ts'

const path = Deno.args[0]
const file = await Deno.readTextFile(path)
const directory = dirname(path)

function replaceEnv(string, config) {
    Object
        .entries(config)
        .forEach(function([key, value]) {
            string = string.replaceAll(`Deno.env.get('${key}')`, `'${value}'`)
            string = string.replaceAll(`Deno.env.get("${key}")`, `"${value}"`)
        })

    return string
}

try {
    const dotenv = await Deno.readTextFile(resolve(directory, '.env'))
    const config = parse(dotenv)
    const injected = replaceEnv(file, config)

    await Deno.writeTextFile(path, injected)
}

catch(error) {
    if (error.name === 'NotFound') {
        try {
            const dotenv = await Deno.readTextFile('.env')
            const config = parse(dotenv)
            const injected = replaceEnv(file, config)

            await Deno.writeTextFile(path, injected)
        }

        catch(error) {
            if (error.name === 'NotFound') {
                throw 'No ".env" file found in the directory of the path or the root of the project'
            }

            else {
                throw error
            }
        }
    }

    else {
        throw error
    }
}
