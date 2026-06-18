import React, { useState } from "react";

function Search() {
  const data = ["Apple", "Banana", "Mango", "Orange"];
  const [search, setSearch] = useState("");

  const filtered = data.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
      {filtered.map((item, i) => (
        <p key={i}>{item}</p>
      ))}
    </div>
  );
}