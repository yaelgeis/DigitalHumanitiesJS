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

          let hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8' + encodeURIComponent(data2.csv);
          hiddenElement.target = '_blank';
          hiddenElement.download = collection + ".csv";
          console.log(data2.csv)
          hiddenElement.click();  
      })
  };


  return (
    <>
    <div id="select-div">
      <p id="col-dropdown-text">:בחר סנן</p>
      <select name="col-dropdown" id="col-dropdown">
          <option value="כותרת">כותרת</option>
          <option value="מיקום גוף יוצר">מיקום גוף יוצר</option>
          <option value="גופים">גופים</option>
          <option value="סוג התיק">סוג התיק</option>
          <option value="מספר תיק ישן">מספר תיק ישן</option>
          <option value="סטטוס חשיפה">סטטוס חשיפה</option>
          <option value="מספר תיק לציטוט">מספר תיק לציטוט</option>
          <option value="תיאור">תיאור</option>
          <option value="אישים">אישים</option>
        </select><label for="col-dropdown"></label>
        <p id="insert-text">:הזן טקסט</p>
        <input ref={textInput} type="text" id="text-box" />
        <button class="n-btn" id="text-filter-btn" onClick={{textFilterClickHandler}}>סנן לפי מחרוזת</button><br></br>
      </div>
      <div id="date-div">
      <p id="start-date">:תאריך התחלה</p>

        <Datepicker id="first-datepicker"
          selected={startDate}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat={'dd/MM/yyyy'}
          onChange={date => setStartDate(date)} />

          <br></br>

          <p id="end-date">:תאריך סיום</p>
        <Datepicker id="seconed-datepicker"
          selected={endDate}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat={'dd/MM/yyyy'}
          onChange={date => setEndDate(date)} />

         <br></br>
    <button class="n-btn" id="text-filter-btn" onClick={dateFilterClickHandler}>סנן לפי תאריכים</button>
    </div>
    <br></br>
        <div id="container">
        <button class="n-btn" id="text-filter-btn" onClick={downloadClickHandler}>יצא לקובץ csv</button>
          {!data ? "Loading..." :
          <><h1>{getTableName(collection)}</h1>
          {buildTable(data)}
          </>
          }
          </div></>
  );

}

const getTableName = (collection) =>{
  const months = ['', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
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
          <Th>אישים</Th>
          <Th>תיאור</Th>
          <Th>מספר תיק לציטוט</Th>
          <Th>סטטוס חשיפה</Th>
          <Th>מספר תיק ישן</Th>
          <Th>סוג התיק</Th>
          <Th>גופים</Th>
          <Th>קישור</Th>
          <Th>תקופת החומר עד</Th>
          <Th>תקופת החומר מ</Th>
          <Th>מיקום גוף יוצר</Th>
          <Th>כותרת</Th>
        </Tr>
      </Thead>
      <Tbody>
      {data.map((item) => (
          <Tr>
            <Td>{item.אישים}</Td>
            <Td>{item.תיאור}</Td>
            <Td>{item["מספר תיק לציטוט"]}</Td>
            <Td>{item["סטטוס חשיפה"]}</Td>
            <Td>{item["מספר תיק ישן"]}</Td>
            <Td>{item["סוג התיק"]}</Td>
            <Td>{item.גופים}</Td>
            <Td><a href={item.קישור} target="_blank" rel="noreferrer">קישור</a></Td>
            <Td>{toDateStr(item["תקופת החומר עד"])}</Td>
            <Td>{toDateStr(item["תקופת החומר מ"])}</Td>
            <Td>{item["מיקום גוף יוצר"]}</Td>
            <Td>{item.כותרת}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
  
}

export default Months;