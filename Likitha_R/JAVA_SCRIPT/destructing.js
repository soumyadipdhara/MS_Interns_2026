constuser={ name:"Harry", age:30, city:"Bangalore" };
const name=user.name;
const age=user.age;
const city=user.city;

//object destructuring
const { name, age, city } = user;
console.log(name);
console.log(age);
console.log(city);

//array destructuring
const numbers=[1,2,3,4,5];
const [first, second, third] = numbers;
console.log(first);
console.log(second);
console.log(third);