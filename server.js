const express = require("express");
const app = express()

const port = 3000;

app.use(express.json())

const booksRouter = require('./routes/books/books');
app.use('/book', booksRouter);

app.get("*", (req, res) => { 
    res.json({massage: "PAGE NOT FOUND"});
  });

const errorHandler = (err, req, res, next) => {
    if(err.status) {
        return res.status(err.status).json({message: err.message})
    }
    res.sendStatus(500);
}

app.use(errorHandler)

app.listen(port, () => console.log(`Listening on port ${port}`));