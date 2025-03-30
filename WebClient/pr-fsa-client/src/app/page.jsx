"use client";

import { useState, useEffect, useRef } from "react";
import axios, { isAxiosError } from "axios";

const getRecordData = async (apiURL, useStateUpdater, setError) => {
  // validate the query object
  if (!apiURL) {
    setError("Base URL is required!");
    return;
  }

  // reset error
  setError('');

  console.log("Going...");
  // make the API request
  axios.get(apiURL).then((res) => {
    console.log("Data received: ", res.data);
    useStateUpdater(res.data);
  }).catch((err) => {
    useStateUpdater(null);
    console.log(err);
    setError(err);
  });
}



export default function Home() {

  // NOTE
  // Needs a useTransition hook to handle the loading state for data presentation pieecs
  // (https://react.dev/reference/react/useTransition)

  // also take a look at this:
  // https://react.dev/reference/react/useActionState


  // :: Get Data ::

  // error system (verboser)
  let [error, setError] = useState(null);

  // record data (data to analyze)
  const [recordData, setRecordData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form...");

    let apiURL = "";
    // assuming user selects static URL option:
    if (!e.target[1].checked) {
      apiURL = e.target[0].value;
    }
    else {
      // build the the apiURL from form data
      apiURL = e.target[2].value; // base URL
      // console.log("e", e);

      // would've been nice if we havd a better data structure ;-;
      
      // loop through the form data starting from the first parameter key
      // structure:
      // - Checkbox for inclusion
      // - Parameter name
      // - Parameter value
      // the first parameter starts at i = 3 (the checkbox)
      for(let i = 3; i < e.target.length - 3; i += 3) {
        // check if the checkbox is checked
        // console.log(e.target[i].checked);
        if (e.target[i].checked && e.target[i + 1].value) {
          // get the parameter name and value
          let paramName = e.target[i + 1].value;
          let paramValue = e.target[i + 2].value;

          // add the parameter to the apiURL
          apiURL += "&" + paramName + "=" + paramValue;
        }
      }

      apiURL = apiURL.substring(0, apiURL.length - 1); // remove the last '&'
      // console.log("apiURL: " + apiURL);
      // return;
    }

    getRecordData(apiURL, setRecordData, setError);
  }

  return (
    <div>
      {/* https://react.dev/reference/react-dom/components/input */}
      <h1 className="text-3xl font-bold underline">Get data</h1>
      <div className="flex flex-col">
        {/* Get a URL and send it */}
        <div>
          <form onSubmit={handleSubmit} className="mb-4">
            <DataQueryUI />
          </form>
        </div>
        {/* present the data */}
        <div>
          {error && (
            <div className="bg-red-200 text-red-800 p-2 rounded-lg">
              <h1 className="text-lg font-bold">
                {isAxiosError(error) ? (error.code + " (" + error.message + ")") : error}
              </h1>
            </div>)
          }
        </div>
        <h1>Data:</h1>
        <pre>
          <code className="text-sm text-gray-700">
            {recordData && JSON.stringify(recordData.data, null, 2)}
          </code>
        </pre>
      </div>
    </div >
  );
}

const DataQueryUI = () => {
  // determine get method
  // (if it is checked, then just use the static URL)
  const [dataMethod, setDataMethod] = useState(0);

  const [paramItems, setParamItems] = useState([
    // default parameters
    {
      param: "limit",
      type: "number",
      value: 0
    },
    {
      param: "beginDate",
      type: "date",
    },
    {
      param: "endDate",
      type: "date",
    }
  ]);

  let paramDiv = useRef(null);

  function handleAddition(){
    // add a new parameter to the list
    setParamItems([...paramItems, { param: "", type: "text" }]);
  }

  return (
    <>
      <div className="mb-4">
        <label className="text-lg font-bold">Static URL</label>
        <input type="url" required={true} disabled={dataMethod} className="border-red-400 border-2 rounded-lg disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500" placeholder="URL to DB API goes here" />
      </div>
      <div>
        <label className="text-lg font-bold">Use Edtior instead </label>
        {/* Set  */}
        <input type="checkbox" onClick={(e) => { setDataMethod(!dataMethod) }} />
        <div hidden={!dataMethod}>
          {/* issue with URL or 'required' checking not working. */}
          <label type="url" required={true} className="">Base URL</label>
          <input name="baseUrl" className="border-red-400 border-2 rounded-lg" placeholder="base URL to DB API goes here" />
        </div>
        <div hidden={!dataMethod} className="mt-4" ref={paramDiv}>
          {/* add template keys */}
          {paramItems.map((value, key) => {
            return (
              <FormPars key={key} param={value.param} type={value.type} />
            )
          }
          )}
          {/* user-defined keys () */}
          <div className="mt-4 ml-3 b-5 bg-green-400 p-2 rounded-lg active:bg-green-600" onClick={handleAddition}>Add Key</div>

        </div>
      </div>
      <button className="mt-1 ml-3 b-5 bg-green-400 p-2 rounded-lg active:bg-green-600">Get Data</button>
    </>
  )
}

// >> adjustable keys (can be deleted, added, or made optional)
const FormPars = (props) => {
  // needs:
  // - key
  // - param name
  // - (optional) type

  const [param, setParam] = useState((props.param) ? props.param : "");
  const [includeStatus, setIncludeStatus] = useState(1);
  return (
    <div className="mt-4">
      {/* 
          - If checked, include this in APIURL
          - Otherwise, disable it.
        */}
      <input name="include" type="checkbox" className="border-red-400 border-2 rounded-lg " placeholder="" onChange={(e) => { setIncludeStatus(!includeStatus) } } checked={includeStatus}/>
      <input disabled={!includeStatus} name="param" type="text" className="border-red-400 border-2 rounded-lg disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500" placeholder={"Parameter Name"} value={param} onChange={(e) => setParam(e.target.value)} />
      <input disabled={!includeStatus} name={param} type={(props.type) ? props.type : "text"} className="border-red-400 border-2 rounded-lg disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500" placeholder="" />
    </div>
  )

}