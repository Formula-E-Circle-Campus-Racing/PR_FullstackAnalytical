"use client";

import { useState, useEffect } from "react";
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

  // :: Get Data ::

  // error system (verboser)
  let [error, setError] = useState(null);

  // Old.
  // const queryTemplate = {
  //   baseUrl: "https://api.example.com/data",
  //   limit: 0,
  //   beginDate: "",
  //   endDate: "",
  //   liveUpdate: false
  // }

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

      // get every "key" and append it to the base URL
      for (let i = 3; i < e.target.length; i++) {
          apiURL += e.target[i].name + "=" + e.target[i].value + "&";
      }

      apiURL = apiURL.substring(0, apiURL.length - 1); // remove the last '&'

      // apiURL[apiURL.length - 1] = ""; // remove the last '&'
      // apiURL.at(apiURL.length - 1) = ""; // remove the last '&'
      console.log("apiURL: " + apiURL);
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

  return (
    <>
      <div className="mb-4">
        <label className="text-lg font-bold">Static URL</label>
        <input type="url" required={true} disabled={dataMethod} className="border-red-400 border-2 rounded-lg disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500" placeholder="URL to DB API goes here" />
      </div>
      <div>
        <label className="text-lg font-bold">Use Edtior instead </label>
        {/* Set  */}
        <input type="checkbox" onClick={(e) => { (e.target.checked) ? setDataMethod(1) : setDataMethod(0) }} />
        <div>
          {/* issue with URL or 'required' checking not working. */}
          <label type="url"  required={true} className="">Base URL</label>
          <input name="baseUrl" className="border-red-400 border-2 rounded-lg" placeholder="base URL to DB API goes here" />
        </div>
        <div className="mt-4">
          {/* For now, have static keys, and later have dynamic ones */}
          <div>
            <label for="limit">Data Limit</label>
            <input id="limit" name="limit" type="number" className="border-red-400 border-2 rounded-lg" placeholder="" />
          </div>
          <div>
            <label className="">Begin Date</label>
            <input name="beginDate" type="date" className="border-red-400 border-2 rounded-lg" placeholder="" />
          </div>
          <div>
            <label className="">End Date</label>
            <input name="endDate" type="date" className="border-red-400 border-2 rounded-lg" placeholder="" />
          </div>
          <div>
            <label className="">Live Update</label>
            <input type="checkbox" className="border-red-400 border-2 rounded-lg" placeholder="" />
          </div>
        </div>
      </div>
      <button className="mt-1 ml-3 b-5 bg-green-400 p-2 rounded-lg active:bg-green-600">Get Data</button>
    </>
  )
}