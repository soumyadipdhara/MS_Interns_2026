let str = "JavaScript";
let count = 0;

for (let char of str.toLowerCase()) {
    if ("aeiou".includes(char)) {
        count++;
    }
}

console.log("Vowels =", count);