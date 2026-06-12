let text = "";

for (let i = 1; i < 10; i++) {
  if (i === 3) { continue; }
  text += i*10 + "<br>";
}
console.log(text);