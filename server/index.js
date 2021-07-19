// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

// app.get("/api", (req, res) => {
//     res.json({ message: "Hello from server!" });
// });

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });


const dbURI = "mongodb+srv://Digital:igaleyaelgeis@cluster0.qofyt.mongodb.net/Recently-Uploaded-Files?retryWrites=true&w=majority";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect(dbURI);

app.get("/filter", (req, res) => { 
    filter(req,res);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

async function filter (req, res) {
    let questions = mongoose.model('question', 
        new Schema({ 
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
        {collection : 'June 2021'})
    );


    const str1 = 'יצחק בן-צבי';
    const regex = new RegExp(str1, 'i');
    const x = await questions.find({אישים: {$regex: regex}});
    res.json( {message: `${x}`})

    // x.then(()=> res.json( {message: `${x}`}));
    
    
}
