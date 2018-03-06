// Dependencies

// require express & set up router middleware
var express = require("express");
var routerScrape = express.Router();

// Scraping tools (axios - a promise based http library, like Jquery)
var axios = require("axios");
var cheerio = require("cheerio");



// Scraping routes ----------------------------------------------------------------------------

// A GET route for scraping the CNN website
routerScrape.get("/scrape-cn/:term", function (req, res) {

    var data = fetchCcn(req.query.term) // e.g. http://localhost:3000/scrape-mk/search?term=Ink
        .then(function (result) {
            console.log(result);
            return res.json(result);
        }).catch(function (error) {
            console.error('ERROR', error)
        });

    async function fetchCcn(searchterm) {

        // Initialise an empty array to store all scraped objects
        var resultsCcn = [];

        // Grab the body of the html with request
        var data = await axios.get("https://www.ccn.com/").then(function (response) {
            // Then, load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Grab every article tag, and do the following:
            $("article").each(function (i, element) {

                // Initialise empty result object
                var result = {};

                result.title = $(this)
                    .children("div")
                    .children("a")
                    .attr("title");
                result.link = $(this)
                    .children("div")
                    .children("a")
                    .attr("href");
                result.image = $(this)
                    .children("div")
                    .children("a")
                    .children("img")
                    .attr("src");
                result.internal_category = $(this)
                    .children("header")
                    .children("div")
                    .children("span")
                    .children("a")
                    .attr("title");
                result.date = $(this)
                    .children("header")
                    .children("div")
                    .children("time")
                    .text();
                result.newssite_full = "Crypto Coin News";
                result.newsite_abbr = "CNN";

                // If no searchterm then push result object to results array
                // If searchterm present then search artcile title for searchterm and push to array if found/match
                if (!searchterm) {
                    resultsCcn.push(result);
                } else {
                    if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                        resultsCcn.push(result);
                    }
                }
            });
        });

        // return the results array
        console.log(resultsCcn);
        return res.json(resultsCcn);
    }
});

// A GET route for scraping the coin telegraph website
routerScrape.get("/scrape-ct/:term", function (req, res) {

    var data = fetchCtg(req.query.term) // e.g. http://localhost:3000/scrape-mk/search?term=Ink
        .then(function (result) {
            console.log(result);
            return res.json(result);
        }).catch(function (error) {
            console.error('ERROR', error)
        });

    async function fetchCtg(searchterm) {

        // Initialise an empty array to store all scraped objects
        var resultsCtg = [];

        // Grab the body of the html with request
        var data = await axios.get("https://www.cointelegraph.com").then(function (response) {
            // Then, load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Grab div tags with class "post boxed ", and do the following:
            $('div[class="post boxed "]').each(function (i, element) {

                // Initialise empty result object
                var result = {};

                result.title = $(this)
                    .children('a')
                    .children('span[class="postTitle"]')
                    .text();
                result.link = $(this)
                    .children('a')
                    .attr("href");
                result.description = $(this)
                    .children('div[class="image"]')
                    .children('a')
                    .children('p')
                    .text();
                result.image = $(this)
                    .children('div[class="image"]')
                    .children('a')
                    .children('img')
                    .attr('src');
                result.date = $(this)
                    .children('div')
                    .children('span[class="date"]')
                    .text();

                result.newssite_full = "Coin Telegraph";
                result.newsite_abbr = "CTG";

                // If no searchterm then push result object to results array
                // If searchterm present then search artcile title for searchterm and push to array if found/match
                if (!searchterm) {
                    resultsCtg.push(result);
                } else {
                    if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                        resultsCtg.push(result);
                    }
                }
            });
        });

        console.log(resultsCtg);
        return resultsCtg;
    }
});


// A GET route for scraping the merkle website
routerScrape.get("/scrape-mk/:term", function (req, res) {

    var data = fetchesMkl(req.query.term)
        .then(function (result) { // e.g. http://localhost:3000/scrape-mk/search?term=Ink
            console.log(result);
            return res.json(result);
        }).catch(function (error) {
            console.error('ERROR', error)
        });

    // Async function to get and scape each page in turn of first five pages of news articles 
    async function fetchesMkl(searchterm) {

        // Initialise an empty array to store all scraped objects
        var resultsMkl = [];
        // Number of pages to scrape
        var numPages = 5;

        for (var page = 1; page <= numPages; page++) {

            // Create url string
            var http = "https://www.themerkle.com/page/" + page + "/";

            // Fetch html 
            data = await axios.get(http).then(function (response) {
                // Then, load that into cheerio and save it to $ for a shorthand selector
                var $ = cheerio.load(response.data);

                // Initialise an empty array to store all scraped objects
                var results = [];

                // Grab article tags with class "latestPost excerpt ", and do the following:
                $('article').each(function (i, element) {

                    // Initialise empty result object
                    var result = {};

                    result.title = $(this)
                        .children('header')
                        .children('h2')
                        .text();
                    result.link = $(this)
                        .children('a')
                        .attr("href");
                    result.description = $(this)
                        .children('div[class="front-view-content"]')
                        .text().slice(17);
                    result.image = $(this)
                        .children('a')
                        .children('div')
                        .children('img')
                        .attr('src');
                    result.date = $(this)
                        .children('header')
                        .children('div[class="post-info"]')
                        .children('span[class="thetime date updated"]')
                        .children('span')
                        .text();
                    result.newssite_full = "The merkle";
                    result.newsite_abbr = "TMK";

                    // If no searchterm then push result object to results array
                    // If searchterm present then search artcile title for searchterm and push to array if found/match
                    if (!searchterm) {
                        results.push(result);
                    } else {
                        if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                            results.push(result);
                        }
                    }
                });

                resultsMkl = resultsMkl.concat(results);
            });
        }
        console.log(resultsMkl);
        return resultsMkl;
    }
});

// // A GET route for scraping the merkle website
// routerScrape.get("/scrape-mk/:term", function (req, res) {

//     fetchesMkl(req.query.term);  // e.g. http://localhost:3000/scrape-mk/search?term=Ink

//     // async function to get and scape each page of first five pages of news articles in turn
//     async function fetchesMkl(searchterm) {

//         try {

//             // Initialise an empty array to store all scraped objects
//             var resultsMkl = [];
//             var pages = ["", "/page/2/", "/page/3/", "/page/4/", "/page/5/"];

//             for (var page = 0; page < pages.length; page++) {

//                 var http = "https://www.themerkle.com" + pages[page];

//                 // 
//                 results = await axios.get(http).then(function (response) {
//                     // Then, load that into cheerio and save it to $ for a shorthand selector
//                     var $ = cheerio.load(response.data);

//                     // Initialise an empty array to store all scraped objects
//                     var results = [];

//                     // Grab article tags with class "latestPost excerpt ", and do the following:
//                     $('article').each(function (i, element) {

//                         // Initialise empty result object
//                         var result = {};

//                         result.title = $(this)
//                             .children('header')
//                             .children('h2')
//                             .text();
//                         result.link = $(this)
//                             .children('a')
//                             .attr("href");
//                         result.description = $(this)
//                             .children('div[class="front-view-content"]')
//                             .text().slice(17);
//                         result.image = $(this)
//                             .children('a')
//                             .children('div')
//                             .children('img')
//                             .attr('src');
//                         result.date = $(this)
//                             .children('header')
//                             .children('div[class="post-info"]')
//                             .children('span[class="thetime date updated"]')
//                             .children('span')
//                             .text();
//                         result.newssite_full = "The merkle";
//                         result.newsite_abbr = "TMK";

//                         // push each scraped result object onto results array

//                         if (!searchterm) {
//                             results.push(result);
//                         } else {
//                             if (result.title.indexOf(searchterm) >= 0) {
//                                 results.push(result);
//                             }
//                         }

//                     });

//                     resultsMkl = resultsMkl.concat(results)

//                 });

//             }

//             return res.json(resultsMkl)

//         } catch (error) {
//             console.log('ERROR', error)
//         }

//     }

// });



// export routes

module.exports = routerScrape;