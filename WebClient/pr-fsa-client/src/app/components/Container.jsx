import { React, useState} from 'react';

/**
 * 
 * Container component for the app []
 * 
 * @param {*} props 
 * @returns 
 */
const Container = (props) => {

  // keeping track of container name
  const [containerName, setcontainerName] = useState(props.defaultStr);

  // keeping track of pages on container
  // get back to this []
  const [page, setPage] = useState(0);

  const handleChange = (event) => {
    setcontainerName(event.target.value);
  };

  return (
    <div className='bg-cBackground custom-shadow text-black h-[32vh] w-[32vw] relative top-[8vh] left-[8vw]'>
      {/* top area */}
      <div className='custom-border bg-cForeground 
                      h-[6vh]
                      flex justify-center items-center
                      w-[17vw]
                      absolute
                      right-5
                  '>
        <textarea
          className='pr-4 font-Ubuntu font-regular text-[2rem] resize-none bg-transparent h-[5vh] max-w-[30vw]  overflow-hidden text-right'
          value={containerName}
          onChange={handleChange}
          rows="5" cols="33"
          contentEditable="true"
          spellCheck='false' />
      </div>
      {/* content */}
      <div className='mt-[6vh] p-2 pt-[7vh]'>
        {props.children}
      </div>
    </div>
  );
};

export default Container;