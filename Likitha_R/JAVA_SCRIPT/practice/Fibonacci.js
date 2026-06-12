function fibonacci(num) {
  let a=0 , b=1;
    for (let i = 0; i < num; i++) {
        console.log(a);
        [a, b] = [b, a + b];
    }
}

console.log(fibonacci(10));