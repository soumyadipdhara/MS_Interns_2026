import React, { useState } from "react";

function ToggleTheme() {
  const [dark, setDark] = useState(false);

  return (
    <div style={{ background: dark ? "black" : "white", color: dark ? "white" : "black" }}>
      <h1>{dark ? "Dark Mode" : "Light Mode"}</h1>
      <button onClick={() => setDark(!dark)}>Toggle</button>
    </div>
  );
}

export default ToggleTheme;