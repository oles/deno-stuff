import {parse} from 'https://deno.land/std@0.150.0/flags/mod.ts'
import {parse as parsePath, basename, format} from 'https://deno.land/std@0.150.0/path/mod.ts'

async function run(...command) {
    const process = await Deno.run({
        cmd: command
    })

    const status = await process.status()

    if (status.success === false) {
        Deno.exit(0)
    }
}

function fail(message) {
    if (message) {
        console.warn('Error: ' + message)
    }

    Deno.exit(0)
}

const parsedArgs = parse(Deno.args, {boolean: ['allow-net']})
const script = parsedArgs._[0]

if (script === undefined) {
    fail('No source file provided in the arguments')
}

const {dir, name, ext} = parsePath(script)
const output = parsedArgs.output || name === 'script' ? basename(dir) : name

const bundle = format({dir, name: name + '.temp-bundle', ext})
const copy = format({dir, name: name + '.temp-copy', ext})

const args = Deno.args.reduce(function(accumulator, argument) {
    if (argument === script) {
        if (parsedArgs.output === undefined) {
            accumulator.push('--output', output)
        }

        accumulator.push(bundle)
    }

    else {
        accumulator.push(argument)
    }

    return accumulator
}, [])

try {
    await Deno.copyFile(script, copy)
    await run('deno-remove-dotenv-import', copy)
    await run('deno', 'bundle', copy, bundle)
    await run('deno-inject-dotenv', bundle)
    await run('deno', 'compile', ...args)
}

catch(error) {
    fail(error)
}

finally {
    await Promise.all([Deno.remove(bundle), Deno.remove(copy)])
}
