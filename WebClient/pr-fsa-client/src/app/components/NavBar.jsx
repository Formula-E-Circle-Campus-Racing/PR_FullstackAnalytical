import React, { Children, useEffect, useState } from 'react';

/**
 * FOR LATER
 * 
 * 
 * @returns 
 */
const NavBar = () => {

  const [projectName, setProjectName] = useState('Room Environment Module');

  const handleChange = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <nav className='p-2 bg-primary text-black h-[8vh] absolute w-full'>
      <div className='absolute top-1/2 transform -translate-y-1/2'>
        <label className='text-xs absolute italic font-medium italic text-white text-shadow top-[-0.5vh]'

          htmlFor="textarea"
        >PR name:</label>
        <textarea
          className='pl-4 font-Ubuntu font-medium italic text-[2rem] resize-none bg-transparent h-[5vh] max-w-[30vw]  overflow-hidden'
          value={projectName}
          onChange={handleChange}
          rows="5" cols="33"
          contentEditable="true"
          name='textarea'
          spellCheck='false' />
      </div>
    </nav>
  );
};
