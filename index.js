const express = require('express');
const port = 8000;

const app = express();

app.listen(port, (err) => {
    if(err) {
        console.log(`Error : ${err}`);
        return;
    }
    console.log(`Server running on port: ${port}`);
});