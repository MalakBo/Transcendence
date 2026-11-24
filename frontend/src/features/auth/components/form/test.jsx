"use client";
import { useState } from "react";


function Test() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="login-card">
                {count}
            </div>

            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </>
    );
}

export default Test;