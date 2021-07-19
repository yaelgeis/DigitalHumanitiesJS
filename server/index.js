// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded());

const dbURI = "mongodb+srv://Digital:igaleyaelgeis@cluster0.qofyt.mongodb.net/Recently-Uploaded-Files?retryWrites=true&w=majority";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(dbURI);

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
    {collection : 'yael-try'}
);

app.post("/filter", (req, res) => { 
    filterTable(req,res);
});



function filterTable (req, res) {
    const model = mongoose.model('question', schema);

    if (req.body.filterStr)
        filterStr(model, req.body.col, req.body.str, res);
    else
        filterDate(model, req.body.start, req.body.end, res);    
}

async function filterStr(model, col, str, res){
    const regex = new RegExp(str, 'i');
    let findExp = {};
    findExp[col] = {$regex: regex};
    const items = await model.find(findExp, {"_id":0});
    res.send({items: items});
}

async function filterDate(model, start, end, res){
    const startDate = new Date(start);
    const endDate = new Date(end);
    const findExp = {'תקופת החומר מ':  {"$gte": startDate}, 'תקופת החומר עד':  {"$lte": endDate} }
    const items = await model.find(findExp, {"_id":0});
    res.send({items: items});
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});