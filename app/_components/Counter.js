"use client";
import { useState } from "react";

// streaminng
export default function Counter({ users }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{users.length}</span>
      <button onClick={() => setCount((count) => count + 1)}>{count}</button>
    </div>
  );
}
