import { useState } from 'react';
import './App.css'

function Hooks() {
let [counter,SetCounter]=useState(15)

const AddValue=()=>{
counter=counter+1;
SetCounter(counter)
};

const removeValue=()=>{
  SetCounter(counter-1)
};

return(
<div className='container'>
<h1>Header</h1>
<h2>counter value {counter}</h2>
<button onClick={AddValue}>Add Value {counter}</button>
<br/>
<button onClick={removeValue}>remove value {counter}</button>
<p>footer: </p>
</div>
);
}

export default Hooks
