const pdfJsLib = require("pdfjs-dist/es5/build/pdf.js");

function getText(pdfUrl) {
    const loadingTask = pdfJsLib.getDocument(pdfUrl);

    return loadingTask.promise
        .then(function (doc) {
            const numPages = doc.numPages;

            let promises; // will hold chained promises
            promises = doc.getMetadata().then(); // need to resolve the pdf metadata in order to proceed with the pages

            const loadPage = function (pageNum) {
                return doc.getPage(pageNum).then(function (page) {
                    return page
                        .getTextContent()
                        .then(function (content) {
                            const strings = content.items.map(function (item) {
                                return item.str;
                            });
                            return strings.join(" ");
                        })
                        .then(function (textContent) {
                            return textContent;
                        });
                });
            };

            for (let i = 1; i <= numPages; i++) {
                promises = promises.then(loadPage.bind(null, i));
            }
            return promises;
        })
        .then(
            function (textContent) {
                return textContent;
            },
            function (err) {
                console.error("Error: " + err);
            }
        );
}

module.exports = getText;
