import React from 'react';

const Marquee = () => {
  return (
    <div
      className="line-with-text"
      style={{
        position: 'relative',
        left: 0,
        right: 0,
        backgroundColor: 'yellow',
      }}
    >
      <p
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '0 10px', // Adjust the padding to place the text properly
          backgroundColor: 'white', // Change this to match your background
        }}
      >
        This is your text on the line
      </p>
      <div
        className="line"
        style={{
          width: '100%',
          height: '2px', // Adjust this to change line thickness
          backgroundColor: 'black', // Change this to your desired color
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
};

export default Marquee;
