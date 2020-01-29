const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const wordFile = "./translations/word.txt";
const idFile = "./translations/id.txt";

const readFile = (inputWord, lang) => {
    let fileName = "./translations/SE.txt";
    let translateTo;
    let translateFrom;

    if (lang === "EN") {
        translateTo = "./translations/EN.txt";
        translateFrom = "./translations/SE.txt";
    } else {
        translateTo = "./translations/SE.txt";
        translateFrom = "./translations/EN.txt";
    }

    const wordIndex = fs.readFile(translateFrom, "utf8", (error, words) => {
        if (error) return reject(error);
        let wordArray = [];
        words.split("\r\n").map((word, index) => {
            wordArray.push({ word, index });
        });
        // .filter(word => word === inputWord);
        let word_match = wordArray.filter(arr => arr.word === inputWord);
        if (!word_match) {
            return null;
        } else {
            console.log(word_match[0]);
            console.log("Returning from Wordindex");
            return word_match[0].index;
        }
    });

    return new Promise((res, reject) => {
        fs.readFile(translateTo, "utf8", (error, words) => {
            if (error) return reject(error);
            let wordArray = [];
            words.split("\r\n").map((word, index) => {
                wordArray.push({ word, index });
            });

            
            console.log(wordArray[1]);
            console.log(wordIndex);
            // console.log(word_match[0]);
            return res(wordArray[wordIndex]);
        });
    });
};

app.use(express.json());

app.get("/", (req, res) => res.send("Learning Node JS in 4hrs!"));

app.get("/api/v1/translations", async (req, res) => {
    const { text, lang } = req.body;
    if (!text || !lang) {
        res.statusCode = 400;
        return res.send("Missing parameters");
    }

    const response = await readFile(text, lang)
        .then(word => {
            if (!word) return "Not found";
            return word;
        })
        .catch(err => {
            console.log(err);
            return "Not found";
        });

    // const correctWord = await [...response].filter(word => word === text);
    // console.log(correctWord);

    return res.send(response);
});

// fs.readFile(idFile, "utf8", (error, id) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(id);
//     }
// });

app.post("/api/v1/translations", (req, res) => {
    const { text, id } = req.body;
    if (!text || !id) {
        res.statusCode = 400;
        return res.send("Missing paramters");
    }

    // Save to file

    res.send("Saved to file");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
