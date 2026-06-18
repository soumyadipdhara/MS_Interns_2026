//map ()
const num=[1,2,3,4,5];
const square=num.map((x)=>x*x);
console.log(square);

const users = [
    {name: "Harry", age: 15},
    {name: "Ron", age: 16},
    {name: "Hermione", age: 15}
];
const names=users.map((user)=>user.name);
console.log(names);


//filter ()
const even=num.filter((x)=>x%2===0);
console.log(even);


const products=[
    {name: "Laptop", price: 1000,instock: true},
    {name: "Phone", price: 500, instock: false} ,  
    {name: "Tablet", price: 300, instock: true},  
];
const available=products.filter((product)=>product.instock);
const affordable=products.filter((product)=>product.price<800);
console.log(available);
console.log(affordable);


//reduce ()
const num=[1,2,3,4,5];
const sum=num.reduce((accumulator,currentValue)=>accumulator+currentValue,0);
console.log(sum);

const words=["Hello","World"];
const sentence=words.reduce((accumulator,currentValue)=>accumulator+" "+currentValue);
console.log(sentence);