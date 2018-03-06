// Dependencies

// require express & set up router middleware
var express = require("express");
var routerScrape = express.Router();

// Scraping tools (axios - a promise based http library, like Jquery)
var axios = require("axios");
var cheerio = require("cheerio");



// Scraping routes ----------------------------------------------------------------------------

// A GET route for scraping all sites
routerScrape.get("/scrape-all/:term", function (req, res) {

    var data = fetchAll(req.query.term) // e.g. http://localhost:3000/scrape-mk/search?term=Ink
        .then(function (result) {
            console.log(result);
            return res.json(result);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
});


// A GET route for scraping the CNN website
routerScrape.get("/scrape-cn/:term", function (req, res) {

    var data = fetchCcn(req.query.term) // e.g. http://localhost:3000/scrape-mk/search?term=Ink
        .then(function (result) {
            console.log(result);
            return res.json(result);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
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
});


// A GET route for scraping xxxx website
routerScrape.get("/scrape-bnc/:term", function (req, res) {

    var data = fetchBnc(req.query.term)
        .then(function (result) { // e.g. http://localhost:3000/scrape-mk/search?term=Ink
            console.log(result);
            return res.json(result);
        }).catch(function (error) {
            console.error('ERROR', error)
        });

});




// Functions ----------------------------------------------------------------------------

// Async function to get and scape all sites
async function fetchAll(searchterm) {

    var resultsAll = [];

    var data = await fetchCcn(searchterm);
    resultsAll = resultsAll.concat(data);

    var data = await fetchCtg(searchterm);
    resultsAll = resultsAll.concat(data);

    var data = await fetchesMkl(searchterm);
    resultsAll = resultsAll.concat(data);

    var data = await fetchBnc(searchterm);
    resultsAll = resultsAll.concat(data);

    console.log(resultsAll);
    return resultsAll;
}


// Async function to get and scape Coin telegraph site
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


// Async function to get and scape cryptocoin news site
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
    return resultsCcn;
}


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

// Async function to get and scape Coin telegraph site
async function fetchBnc(searchterm) {

    // Initialise an empty array to store all scraped objects
    var resultsBnc = [];

    // Grab the body of the html with request
    var data = await axios.get("https://www.bravenewcoin.com/news").then(function (response) {
        // Then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Grab div tags with class "post boxed ", and do the following:
        $('li[class="BlogSummaryNews"]').each(function (i, element) {

            // Initialise empty result object
            var result = {};

            result.title = $(this)
                .children('span')
                .children('div[class="fader"]')
                .children('h3')
                .children('a')
                .text();
            result.link = $(this)
                .children('span')
                .children('a')
                .attr("href");
            result.description = $(this)
                .children('span')
                .children('div[class="fader"]')
                .children('a')
                .children('p')
                .text();
            result.image = $(this)
                .children('span')
                .children('a')
                .children('img')
                .attr('src');
            result.date = $(this)
            .children('span')
            .children('div[class="fader"]')
            .children('p')
            .text().slice(-11);

            result.newssite_full = "Brave New Coin";
            result.newsite_abbr = "BNC";

            // If no searchterm then push result object to results array
            // If searchterm present then search artcile title for searchterm and push to array if found/match
            if (!searchterm) {
                resultsBnc.push(result);
            } else {
                if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                    resultsBnc.push(result);
                }
            }
        });
    });

    console.log(resultsBnc);
    return resultsBnc;
}


// export routes

module.exports = routerScrape;