"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const getRecordData = async(queryObj, useStateUpdater, setError) => {
  // validate the query object
  if(queryObj.baseUrl == null) {
    // The base URL is null when the user first loads.
    return;
  }

  if(queryObj.baseUrl  === "") {
    setError("Base URL is required!");
    return;
  }
  
  // make URL to fetch data
  const apiURL = queryObj.baseUrl; // for now.
  console.log(apiURL);

  // make the API request
  axios.get(apiURL).then((res) => {
    setError('');
    useStateUpdater(res.data);
  }).catch((err) => {
    setError(err);
  });
}

export default function Home() {

  // :: Get Data ::

  // error system (verboser)
  let [error, setError] = useState(null);

  // query object for making API requests
  let [queryObj, setQueryObj] = useState({
    baseUrl: "", // random garbage to stop queries
    limit: 5,
    beginDate: "1-5-25",
    endDate: "1-12-25",
    liveUpdate: false // Feature needs to be implemented before actual usage.
  });
  
  // record data (data to analyze)
  const [recordData, setRecordData] = useState(null);

  // to refresh data
  const [refresh, setRefresh] = useState(false);

  // allow data to be fetched on page load
  useEffect(() => {
    console.info("Attempting to fetch data...");
    console.log(queryObj)
    getRecordData(queryObj, setRecordData, setError);
  }, [refresh])

  return (
    <div>
      {/* https://react.dev/reference/react-dom/components/input */}
      <h1 className="text-3xl font-bold underline">Get data</h1>
      <div>
        {/* Get a URL and send it */}
        <input className="border-red-400 border-2 rounded-lg" placeholder="URL to DB API goes here" onChange={e => setQueryObj({baseUrl: e.target.value})}/>
        <input type="checkbox" value="blah blah blah"/>

        <button className="ml-3 b-5" onClick={() => setRefresh(!refresh)}>Refresh</button>
        <div>
          <h1>Data:</h1>
          {error && <p className="text-red-500">{error}</p>}
          {recordData && <pre>{JSON.stringify(recordData.data, null, 2)}</pre>}
          {!recordData && !error && <p>No data yet.</p>}
        </div>
        </div>   
    </div>
  );
}

