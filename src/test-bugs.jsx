// Test file: Intentional bugs for AI Code Review validation

// ❌ BUG #1: Unescaped JSX - will cause runtime error
function BuggyRenderUserName({ name }) {
  const message = "Welcome " + <strong>{name}</strong>;
  return <div>{message}</div>;
}

// ❌ BUG #2: No error handling on async call
function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = response.json();
  return data;
}

// ❌ BUG #3: Hardcoded secret/API key
const API_KEY = "sk-proj-1234567890abcdef_secret_key_exposed";
const DATABASE_PASSWORD = "admin123";

// ❌ BUG #4: Missing dependency in useEffect
import { useState, useEffect } from 'react';

function BuggyComponentWithEffect() {
  const [count, setCount] = useState(0);
  const name = "Test User";
  
  useEffect(() => {
    console.log("Name is: " + name); // name is missing from dependency array
  }, []);
  
  return <div>{count}</div>;
}

// ❌ BUG #5: Direct DOM manipulation instead of React
function BuggyDOMManipulation() {
  function handleClick() {
    const element = document.getElementById("my-div");
    element.innerHTML = "<strong>Unsafe HTML injection</strong>"; // XSS vulnerability
  }
  
  return <div id="my-div" onClick={handleClick}>Click me</div>;
}

// ✅ GOOD: Proper implementation (for contrast)
function GoodRenderUserName({ name }) {
  if (!name || typeof name !== 'string') {
    return <div>Invalid name</div>;
  }
  return <div>Welcome <strong>{name}</strong></div>;
}

function GoodFetchUserData(userId) {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

function GoodComponentWithEffect() {
  const [count, setCount] = useState(0);
  const name = "Test User";
  
  useEffect(() => {
    console.log("Name is: " + name);
  }, [name]); // name is in dependency array
  
  return <div>{count}</div>;
}

function GoodStateBasedRendering() {
  const [content, setContent] = useState("Click me");
  
  function handleClick() {
    // Use React state instead of direct DOM manipulation
    setContent("<strong>Safe HTML via React</strong>");
  }
  
  return <div onClick={handleClick}>{content}</div>;
}

export {
  BuggyRenderUserName,
  fetchUserData,
  BuggyComponentWithEffect,
  BuggyDOMManipulation,
  GoodRenderUserName,
  GoodFetchUserData,
  GoodComponentWithEffect,
  GoodStateBasedRendering
};
