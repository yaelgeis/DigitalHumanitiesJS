// client/src/App.js

import React, {useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  let [data, setData] = React.useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  let textInput = React.createRef();  // React use ref to get input value
  let textFilterClickHandler = (e) => {
    let str = textInput.current.value; 
    let col = document.getElementById("col-dropdown").value;

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({filterStr: true, col: `${col}`, str: `${str}` }),
      headers: {"Content-Type": "application/json"}
    }; 

    fetch(`/filter`, requestOptions)
      .then((res) => res.json())
      .then((data) => setData(data.items));
  };


  let dateFilterClickHandler = (e) => {

    let start = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
    let end = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + endDate.getDate();
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({filterStr: false, start: `${start}`, end: `${end}` }),
      headers: {"Content-Type": "application/json"}
    }; 


    fetch(`/filter`, requestOptions)
      .then((res) => res.json())
      .then((data) => setData(data.items));
  };

  return (
    <><div>
      <Datepicker
        selected={startDate}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat={'dd/MM/yyyy'}
        onChange={date => setStartDate(date)} />
        <br></br>
      <Datepicker
        selected={endDate}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        dateFormat={'dd/MM/yyyy'}
        onChange={date => setEndDate(date)} />
    </div>
    <button onClick={dateFilterClickHandler}>סנן לפי תאריכים</button>
    <br></br><select name="col-dropdown" id="col-dropdown">
        <option value="כותרת">כותרת</option>
        <option value="מיקום גוף יוצר">מיקום גוף יוצר</option>
        <option value="גופים">גופים</option>
        <option value="סוג התיק">סוג התיק</option>
        <option value="מספר מסמכים בתיק">מספר מסמכים בתיק</option>
        <option value="מספר תיק ישן">מספר תיק ישן</option>
        <option value="סטטוס חשיפה">סטטוס חשיפה</option>
        <option value="מספר תיק לציטוט">מספר תיק לציטוט</option>
        <option value="תיאור">תיאור</option>
        <option value="אישים">אישים</option>
      </select><label for="col-dropdown">:בחר סנן</label><br></br><><input ref={textInput} type="text" />
      <button onClick={textFilterClickHandler}>סנן לפי מחרוזת</button><br></br>
        <div className="container">{!data ? "Loading..." :
          <><h1>יוני 2021</h1><table class="styled-table">
            <thead>
              <tr>
                <th>אישים</th>
                <th>תיאור</th>
                <th>מספר תיק לציטוט</th>
                <th>סטטוס חשיפה</th>
                <th>מספר תיק ישן</th>
                <th>מספר מסמכים בתיק</th>
                <th>סוג התיק</th>
                <th>גופים</th>
                <th>קישור</th>
                <th>תקופת החומר עד</th>
                <th>תקופת החומר מ</th>
                <th>מיקום גוף יוצר</th>
                <th>כותרת</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={beautify(item.אישים)} class="active-row">
                  <td>{beautify(item.אישים)}</td>
                  <td>{beautify(item.תיאור)}</td>
                  <td>{beautify(item["מספר תיק לציטוט"])}</td>
                  <td>{beautify(item["סטטוס חשיפה"])}</td>
                  <td>{beautify(item["מספר תיק ישן"])}</td>
                  <td>{beautify(item["מספר מסמכים בתיק"])}</td>
                  <td>{beautify(item["סוג התיק"])}</td>
                  <td>{beautify(item.גופים)}</td>
                  <td>{beautify(item.קישור)}</td>
                  <td>{toDateStr(item["תקופת החומר עד"])}</td>
                  <td>{toDateStr(item["תקופת החומר מ"])}</td>
                  <td>{beautify(item["מיקום גוף יוצר"])}</td>
                  <td>{beautify(item.כותרת)}</td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table></>}</div></></>
  );

}

function toDateStr(date){
  let arr = date.substr(0, date.indexOf('T')).split('-');
  return arr[2] + '/' + arr[1] + '/' + arr[0];
}

const beautify = (str) => {return str === null ? str : str.substring(1, str.length-1) }



export default App;