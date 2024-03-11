import React from "react";

const Notification = ({ message }) => {
    console.log("i have been triggered")
  return (
    <div style={{position: 'absolute', backgroundColor: 'white', top: '40px', left: '82%', zIndex: '2'}}>
      {/* Display the notification message */}
      <div>{message}</div>
    </div>
  );
};

export default Notification;