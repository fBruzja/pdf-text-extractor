import './App.css';
import FileUpload from "./components/FileUpload";
import {useState} from "react";

const url = "http://localhost:3001/extract-pdf-text";

function App() {
    const [pdfText, setPdfText] = useState(null);

    const handleUploadedFile = (file) => {
        let formData = new FormData();
        formData.append("pdf", file[0], file[0].name);
        formData.append("Content-Type", "application/pdf");

        const requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => {
                const parsedResult = JSON.parse(result);
                setPdfText(parsedResult.data.text);
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className="container">
            <div className="upload-section">
                <p className="title">
                    Upload a .pdf file to extract its text
                </p>
                <FileUpload
                    accept=".pdf"
                    updateFileCb={handleUploadedFile}
                />
            </div>
            <div className="extracted-text-section">
                {pdfText && pdfText.map((page, index) => <p key={index}>{page}</p>)}
            </div>
        </div>
    );
}

export default App;
