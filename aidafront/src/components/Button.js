import React from 'react'

function Button(props) {
  return (
    <button style={{
      border: "none",
      color: "white",
      padding: "15px 32px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      fontSize: "16px",
      margin: "4px 2px",
      cursor: "pointer",
      borderRadius: "4px",
      backgroundColor: "#3f51b5"
    }}>
      {props.text}
    </button>
  )
}

export default Button