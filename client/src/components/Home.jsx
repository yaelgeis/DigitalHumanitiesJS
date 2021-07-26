import React from "react";
import "./css/Home.css";

export var selectedMonth = "";

function Home() {
  let [data, setData] = React.useState(null);
  let [data2, setData2] = React.useState(null);

  let textInput = React.createRef();

  React.useEffect(() => {
    fetch('/getList')
      .then((res) => res.json())
      .then((data) => setData(data.cols));

    }, []);


  
  let newMonthClickHandler = (e) => {
    let str = textInput.current.value; 
    console.log("str = " + str);

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({url: `${str}`}),
      headers: {"Content-Type": "application/json"}
    }; 

    fetch("/url", requestOptions)
      .then((res) => res.json())
      .then((data2) => setData2(data2.items));
  };


    return (
      <div className="App">
        <header className="App-header">
          {!data ? <p> "טוען חודשים..."</p> :
          <> 
          <p class="pick-month">אנא בחר חודש לצפייה או הכנס כתובת של חודש אחר:</p> 
          <input ref={textInput} type="text" id="text-box" />
          <button class="n-btn" id="text-filter-btn" onClick={(e)=>{newMonthClickHandler(e)}}>העלה חודש</button><br></br>
          {getButtons(data)}
          </>}          
        </header>
      </div>
    );
}

const beautifyList = (data) => {
  return data.map(month => getMonthName(month))
}

const getMonthName = (month) => {
  const months = ['', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const arr = month.split("-");
  let idx = parseInt(arr[0]);
  const m = months[idx] + " " + arr[1];
  const dict = {"name": m, "collection": month}
  return dict;
}


const getButtons = (data) =>{
  const dictList = beautifyList(data);
  let filteredLists = sortByYears(dictList);
  return (
    <div>
    {getListByYear(filteredLists, "2023")}
    {getListByYear(filteredLists, "2022")}
    {getListByYear(filteredLists, "2021")}
    {getListByYear(filteredLists, "2020")}
    {getListByYear(filteredLists, "2019")}
    <br></br>
    <br></br>
    <br></br>
    </div>
  );
}

const getListByYear = (filteredLists, year) => {
  if (filteredLists[year].length !== 0){
    return (
    <div class= "year">
    <h1 class="year-header">{year}</h1>
    <div class="btn-group">
    <ul>{filteredLists[year].map((item) => <li><button onClick={(e)=>{monthClicker(e, item["collection"])}}>{item["name"]}</button></li>)}</ul>
    </div> </div>)
  }
}

const sortByYears = (dictList) =>{
  let filteredLists = {
    "2019": [],
    "2020": [],
    "2021": [],
    "2022": [],
    "2023": []
  };
  dictList.forEach(element => {
    if (element['name'].includes('2019')){
      filteredLists['2019'].push(element)
    }
    else if (element['name'].includes('2020')){
      filteredLists['2020'].push(element);
    }
    else if (element['name'].includes('2021')){
      filteredLists['2021'].push(element);
    }
    else if (element['name'].includes('2022')){
      filteredLists['2022'].push(element);
    }
    else if (element['name'].includes('2023')){
      filteredLists['2023'].push(element);
    } 
  });
  ["2019", "2020", "2021", "2022", "2023"].forEach(
    (element) =>
    filteredLists[element] = filteredLists[element].sort((a,b) => sortMonths(a,b)));
  return filteredLists;
}

const sortMonths  = (a,b) =>{
  let aa = parseInt((a['collection'].split("-"))[0]);
  let bb = parseInt((b['collection'].split("-"))[0]);
  return aa - bb;
}

const monthClicker = (e, item) => {
  selectedMonth = item;
  window.location.href=`/months?item=${item}`
}

export default Home;