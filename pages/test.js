import React, { useState, useEffect } from "react";

function ExampleComponent() {
  // useState example
  const [count, setCount] = useState(0);

  // useEffect example
  useEffect(() => {
    // This function runs after every render
    console.log("Effect ran!");
    // Clean-up function (optional) can be returned here
    // It runs before the next effect and on unmount
    return () => {
      console.log("Clean-up function ran!");
    };
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <div className="text-black">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default ExampleComponent;
