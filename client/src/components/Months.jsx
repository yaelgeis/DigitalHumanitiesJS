import React, {useState} from "react";

import "./css/Months.css";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


function Months() {
  let [data, setData] = React.useState(null);
  let [data2, setData2] = React.useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  let textInput = React.createRef(); 

  let collection = window.location.search.substr(6); // returns "?item=<collection>"

 
    React.useEffect(() => {
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({collection: `${collection}` }),
        headers: {"Content-Type": "application/json"}
      }; 
      fetch('/months/getTable', requestOptions)
        .then((res) => res.json())
        .then((data) => setData(data.items));

      }, []);
        

  let textFilterClickHandler = (e) => {
    let str = textInput.current.value; 
    let col = document.getElementById("col-dropdown").value;

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({filterStr: true, collection: `${collection}`, col: `${col}`, str: `${str}` }),
      headers: {"Content-Type": "application/json"}
    }; 
    fetch(`/months/filter`, requestOptions)
      .then((res) => res.json())
      .then((data) => setData(data.items));
  };


  let dateFilterClickHandler = (e) => {
    let start = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
    let end = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({filterStr: false, collection: `${collection}`, start: `${start}`, end: `${end}` }),
      headers: {"Content-Type": "application/json"}
    }; 


    fetch(`/months/filter`, requestOptions)
      .then((res) => res.json())
      .then((data) => setData(data.items));
  };

  let downloadClickHandler = (e) => {
    fetch(`/months/download`)
      .then((res) => res.json())
      .then((data2) => {
        setData2(data2.csv)

          // let hiddenElement = document.createElement('a');
          // hiddenElement.href = 'data:text/csv;charset=utf-8' + encodeURIComponent(data2.csv);
          // hiddenElement.target = '_blank';
          // hiddenElement.download = collection + ".csv";
          // console.log(data2.csv)
          // hiddenElement.click();  

          //---------------
          var blob = new Blob([data2.csv]);
          if (window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveBlob(blob, collection + ".csv");
          }
          else {
            var a = window.document.createElement("a");

            a.href = window.URL.createObjectURL(blob, {
              type: "text/plain"
            });
            a.download = collection + ".csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
      })
  };


  return (
    <>
    <div id="date-div">
      <p id="start-date">:?????????? ??????????</p>

        <Datepicker id="first-datepicker"
          selected={startDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat={'dd/MM/yyyy'}
          onChange={date => setStartDate(date)} />

          <br></br>

          <p id="end-date">:?????????? ????????</p>
        <Datepicker id="seconed-datepicker"
          selected={endDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat={'dd/MM/yyyy'}
          onChange={date => setEndDate(date)} />

         <br></br>
    <button class="n-btn" id="text-filter-btn" onClick={dateFilterClickHandler}>?????? ?????? ??????????????</button>
    </div>
    <div id="filter-div">
    {/* <div id="select-div"> */}
      <p id="col-dropdown-text">:?????? ??????</p>
      <select /*name="col-dropdown"*/ id="col-dropdown">
          <option value="??????????">??????????</option>
          <option value="?????????? ?????? ????????">?????????? ?????? ????????</option>
          <option value="??????????">??????????</option>
          <option value="?????? ????????">?????? ????????</option>
          <option value="???????? ?????? ??????">???????? ?????? ??????</option>
          <option value="?????????? ??????????">?????????? ??????????</option>
          <option value="???????? ?????? ????????????">???????? ?????? ????????????</option>
          <option value="??????????">??????????</option>
          <option value="??????????">??????????</option>
        </select><label for="col-dropdown"></label>
        {/* </div> */}
        <br></br>
        {/* <div id="text-input"> */}
        <p id="insert-text">:?????? ????????</p>
        <input ref={textInput} type="text" id="text-box2" ></input>
        {/* </div> */}
        {/* <div id="filter-text">       */}
        <br></br>
        <button class="n-btn" id="text-filter-btn" onClick={textFilterClickHandler}>?????? ?????? ????????????</button><br></br>
        {/* </div> */}
        </div>
      
    <br></br>
        <div id="container">
        <button class="n-btn" id="text-filter-btn" onClick={downloadClickHandler}>?????? ?????????? csv</button>
          {!data ? "Loading..." :
          <><h1>{getTableName(collection)}</h1>
          {buildTable(data)}
          </>
          }
          </div></>
  );

}

const getTableName = (collection) =>{
  const months = ['', '??????????', '????????????', '??????', '??????????', '??????', '????????', '????????', '????????????', '????????????', '??????????????', '????????????', '??????????'];
  const arr = collection.split("-");
  let idx = parseInt(arr[0]);
  return months[idx] + " " + arr[1];
}

function toDateStr(date){
  if (date === null)
      return "0/0/0000"
  let arr = date.substr(0, date.indexOf('T')).split('-');
  return arr[2] + '/' + arr[1] + '/' + arr[0];
}

function buildTable(data){
    return (
    <Table>
      <Thead>
        <Tr>
          <Th>??????????</Th>
          <Th>??????????</Th>
          <Th>???????? ?????? ????????????</Th>
          <Th>?????????? ??????????</Th>
          <Th>???????? ?????? ??????</Th>
          <Th>?????? ????????</Th>
          <Th>??????????</Th>
          <Th>??????????</Th>
          <Th>?????????? ?????????? ????</Th>
          <Th>?????????? ?????????? ??</Th>
          <Th>?????????? ?????? ????????</Th>
          <Th>??????????</Th>
        </Tr>
      </Thead>
      <Tbody>
      {data.map((item) => (
          <Tr>
            <Td>{item.??????????}</Td>
            <Td>{item.??????????}</Td>
            <Td>{item["???????? ?????? ????????????"]}</Td>
            <Td>{item["?????????? ??????????"]}</Td>
            <Td>{item["???????? ?????? ??????"]}</Td>
            <Td>{item["?????? ????????"]}</Td>
            <Td>{item.??????????}</Td>
            <Td><a href={item.??????????} target="_blank" rel="noreferrer">??????????</a></Td>
            <Td>{toDateStr(item["?????????? ?????????? ????"])}</Td>
            <Td>{toDateStr(item["?????????? ?????????? ??"])}</Td>
            <Td>{item["?????????? ?????? ????????"]}</Td>
            <Td>{item.??????????}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
  
}

export default Months;