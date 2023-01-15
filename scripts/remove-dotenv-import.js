const file = Deno.args[0]

let string = await Deno.readTextFile(file)

string = string.replace(
    /import .*deno\.land\/std.*dotenv\/.*/,
    ''
)

await Deno.writeTextFile(
    file,
    string
)
