var args = process.argv.slice(2);

var sum = args.reduce( (prev, curr) => +prev + +curr );

console.log(sum);