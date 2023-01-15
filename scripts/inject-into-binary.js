import {dirname, resolve} from 'https://deno.land/std@0.144.0/path/mod.ts'
import {parse} from 'https://deno.land/std@0.144.0/dotenv/mod.ts'
import {indexOfNeedle, concat} from 'https://deno.land/std@0.144.0/bytes/mod.ts'

const compiled = Deno.args[0]
const directory = dirname(compiled)

const dotenv = await Deno.readTextFile(resolve(directory, '.env'))
const envObject = parse(dotenv)

let arrayBuffer = await Deno.readFile(compiled)

function encode(string) {
    return new TextEncoder().encode(string)
}

function replace(source, pattern, replacement) {
    const index = indexOfNeedle(source, pattern)

    if (index === -1) {
        return source
    }

    else {
        const end = index + pattern.length

        return concat(
            source.slice(0, index),
            replacement,
            source.slice(end)
        )
    }
}

Object
    .entries(envObject)
    .forEach(function([key, value]) {
        arrayBuffer = replace(
            arrayBuffer,
            encode(`Deno.env.get('${key}')`),
            encode(`'${value}'`)
        )
    })

await Deno.writeFile(
    compiled,
    arrayBuffer
)
