// server/index.js

const express = require("express");
const {spawn} = require('child_process');
const mongooseToCsv = require("mongoose-to-csv");

const app = express();
app.use(express.json());
app.use(express.urlencoded());

const PORT = 3001;
const dbURI = "mongodb+srv://Digital:igaleyaelgeis@cluster0.qofyt.mongodb.net/Recently-Uploaded-Files?retryWrites=true&w=majority";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(dbURI);

var col_names = []
mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //trying to get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        names.forEach(function(name){
            col_names.push(name['name'])
          });
        module.exports.Collection = names;
    });
})

var last_items = undefined;

var schema = new Schema(
    { 
        סוג_התיק: String,
        מיקום_גוף_יוצר:String,
        מספר_תיק_ישן:String, 
        סטטוס_חשיפה:String,
        מספר_מסמכים_בתיק:String,
        גופים:String,
        תקופת_החומר_עד:String,
        תקופת_החומר_מ:String,
        תיאור:String,
        אישים:String,
        כותרת:String,
        קישור:String 
    }, 
    {strict: false}
);
schema.plugin(mongooseToCsv, {
    headers:'סוג_התיק מיקום_גוף_יוצר מספר_תיק_ישן סטטוס_חשיפה מספר_מסמכים_בתיק גופים תקופת_החומר_עד תקופת_החומר_מ תיאור אישים כותרת קישור'
});

app.get("/getList", (req, res) => { 
    res.json({cols: col_names});
});


app.post("/months/filter", (req, res) => { 
    filterTable(req,res);
});

app.post("/months/getTable", (req, res) => { 
    getTable(req, res);
    
});

app.post("/url", (req, res) => { 
    console.log("received url " + req.body.url)
    const python = spawn('python', ['script.py', req.body.url]);
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });
    res.send("החודש יטען בשלמותו בעוד כ30~ דק'. ניתן לצפות בחודשים אחרים")
});


app.get("/months/download", (req, res) => { 
    exportToCsv(req, res);
    
});

async function getTable(req, res){
    console.log("getting table for " + req.body.collection);
    const model = mongoose.model(req.body.collection, schema);
    const items = await model.find({},{"_id":0});    
    last_items = items;
    res.send({items: items});
}


async function filterTable (req, res) {
    const model = mongoose.model(req.body.collection, schema);

    if (req.body.filterStr)
        await filterStr(model, req.body.col, req.body.str, res);
    else
        await filterDate(model, req.body.start, req.body.end, res);    
}

async function filterStr(model, col, str, res){
    const regex = new RegExp(str, 'i');
    let findExp = {};
    findExp[col] = {$regex: regex};
    const items = await model.find(findExp, {"_id":0});
    last_items = items;
    res.send({items: items});
}

async function filterDate(model, start, end, res){
    const startDate = new Date(start);
    const endDate = new Date(end);
    const findExp = {'תקופת החומר מ':  {"$gte": startDate}, 'תקופת החומר עד':  {"$lte": endDate} }
    const items = await model.find(findExp, {"_id":0});
    last_items = items;
    res.send({items: items});
}

function exportToCsv(req,res){
    let a = true;
    let csv = "סוג התיק\tמיקום גוף יוצר\tמספר תיק ישן\tסטטוס חשיפה\tגופים\tתקופת החומר עד\tתקופת החומר מ\tתיאור\tאישים\tכותרת\tקישור\n"
    last_items.forEach((element) => {csv += getAsCsv(element)})
    console.log(csv)
    res.send({csv: csv})

  
    
}

const getAsCsv = (temp) => {
    const headers = ["סוג התיק","מיקום גוף יוצר","מספר תיק ישן","סטטוס חשיפה" ,"גופים","תקופת החומר עד","תקופת החומר מ","תיאור","אישים","כותרת","קישור"];
    let dict = JSON.parse(JSON.stringify({temp : temp}))["temp"] //to bypass the date issue

    let str = "";
    headers.forEach((element) =>{
        if (dict[element] === null || dict[element] === undefined)
            str += "null\t"
        else{
            if (element === "תקופת החומר מ" || element === "תקופת החומר עד"){
                let arr = dict[element].substr(0, dict[element].indexOf('T')).split('-');
                str +=  (arr[2] + '/' + arr[1] + '/' + arr[0]) + "\t";
            }
            else
                str += (dict[element]).replace(/\n/g,",") + "\t";
                
        }
    });
    return str.slice(0, -1) +"\n";
}


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});