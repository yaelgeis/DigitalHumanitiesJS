// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let [data, setData] = React.useState(null);
  React.useEffect(() => {

    function filterByStr (col, str){
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({filterStr: true, col: `${col}`, str: `${str}` }),
        headers: {"Content-Type": "application/json"}
      }; 
      console.log(requestOptions);
      return requestOptions;
    }

    const requestOptions =  filterByStr('כותרת', 'יעל');

    fetch(`/filter`, requestOptions)
      .then((res) => res.json())
      .then((data) => setData(data.items))
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : JSON.stringify(data)}</p>
      </header>
    </div>
  );

}

// function simplify(data){
//   console.log("type = " + typeof(data)); 
//   console.log(data);
//   let str = "[";
//   data.foreach((s) => str = str + s.toSring() +", ");
//   str = str.substr(0, str.length-2)
//   str += "]"
//   return str;

// }


export default App;