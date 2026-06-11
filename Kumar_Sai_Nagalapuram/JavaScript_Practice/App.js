//Creating and nesting components
function MyButton(){
    return (
        <button>I am a button
        </button>
    )
}
export default function MyApp(){
    return (
        <div>
            <h1>Hello World</h1>
            <MyButton />
        </div>
    )
}
//Writing markup with JSX
const user={
    name:'Brendan Eich',
    imageUrl:'https://share.google/YhC8Am2XxCBK8xoWA',
    imageSize:90,
};
export default function Profile(){
    return (
        <>
        <h1>{user.name}</h1>
 //Adding styles 
<img 
className="avatar"
src={user.imageUrl}
alt={'photo of'+user.name}
style={{
    width:user.imageSize,
    height:user.imageSize
}}
/>
</>
    );
}    
//Conditional rendering 
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
//Displaying data 
return (
  <div>
    {content}
  </div>
);
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
//Rendering lists 
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
//Responding to events & updating the screen
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
//Using Hooks 
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
