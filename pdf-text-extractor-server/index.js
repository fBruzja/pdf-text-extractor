const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const getText = require("./readPdfText");

const app = express();

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024 //10MB max file size
    },
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

const port = process.env.PORT || 3001;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

app.post('/extract-pdf-text', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No pdf uploaded'
            });
        } else {
            let pdf = req.files.pdf;
            const filePath = `./uploads/${pdf.name}`;
            await pdf.mv(filePath);

            getText(filePath).then(function(text) {
                res.send({
                    status: true,
                    message: 'Pdf is uploaded',
                    data: {
                        name: pdf.name,
                        size: pdf.size,
                        text
                    }
                });
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});