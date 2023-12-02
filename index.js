const input = process.argv[2];
await import(new URL(`./day-${input.padStart(2, "0")}/index.js`, import.meta.url))