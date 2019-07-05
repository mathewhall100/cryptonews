// ------------------------------------Dependencies ----------------------------------

// require express & set up router middleware
var express = require("express");
var routerScrape = express.Router();

// Scraping tools (axios - a promise based http library, like Jquery)
var axios = require("axios");
var cheerio = require("cheerio");


// ====================================
// create routes with logic as required
// ===================================


// route for /

routerScrape.get("/", function (req, res) {

    var numRecords = 6;

    var data = fetchAll(req.query.term, numRecords) // (c.f. http://localhost:3000/scrape-mk/search?term=xyx)
        .then(function (hbsObj) {
            //console.log(hbsObj);
            return res.render("index", hbsObj);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
});



// ---------------------------------- Scraping routes --------------------------------

// A GET route for scraping all sites
routerScrape.get("/search/:term", function (req, res) {

    var data = searchAll(req.query.term, 25) // (c.f. http://localhost:3000/scrape-mk/search?term=xyx)
        .then(function (articleList) {

            var hbsObj = {
                articles: articleList,
                searchterm: req.query.term
            };
            console.log(hbsObj);
            return res.render("search_news", hbsObj);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
});


// A GET route for scraping the CNN website
routerScrape.get("/scrape-ccn/:term", function (req, res) {

    var data = fetchCcn(req.query.term, 25)
        .then(function (articleList) {
            var hbsObj = {
                articles: articleList,
                newssite: "Crypto Coin News"
            };
            //console.log(hbsObj);
            return res.render("site_news", hbsObj);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
});


// A GET route for scraping the coin telegraph website
routerScrape.get("/scrape-ctg/:term", function (req, res) {

    var data = fetchCtg(req.query.term, 25)
        .then(function (articleList) {
            var hbsObj = {
                articles: articleList,
                newssite: "Coin telegraph"
            };
            //console.log(hbsObj);
            return res.render("site_news", hbsObj);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
});


// A GET route for scraping the merkle website
routerScrape.get("/scrape-mkl/:term", function (req, res) {

    var data = fetchesMkl(req.query.term, 25)
        .then(function (articleList) {
            var hbsObj = {
                articles: articleList,
                newssite: "The Merkle"
            };
            //console.log(hbsObj);
            return res.render("site_news", hbsObj);
        }).catch(function (error) {
            console.error('ERROR', error)
        });
});


// A GET route for scraping brave new coin website
routerScrape.get("/scrape-bnc/:term", function (req, res) {

    var data = fetchBnc(req.query.term, 25)
        .then(function (articleList) {
            var hbsObj = {
                articles: articleList,
                newssite: "Brave New Coin"
            };
            //console.log(hbsObj);
            return res.render("site_news", hbsObj);
        }).catch(function (error) {
            console.error('ERROR', error)
        });

});




// ------------------------ Scraping functions ------------------------------------

// Async function to get and scape all sites
async function fetchAll(searchterm, numRecords) {

    let [ccn, ctg, mkl, bnc] = await Promise.all([
        fetchCcn,
        fetchCtg,
        fetchesMkl,
        fetchBnc

    ].map(fn => fn(searchterm, numRecords)))

    hbsObj = {
        resultsCcn: ccn,
        resultsCtg: ctg,
        resultsMkl: mkl,
        resultsBnc: bnc
    }

    //console.log(hbsObj);
    return hbsObj;
}

async function searchAll(searchterm, numRecords) {

    let [ccn, ctg, mkl, bnc] = await Promise.all([
        fetchCcn,
        fetchCtg,
        fetchesMkl,
        fetchBnc

    ].map(fn => fn(searchterm, numRecords)))

    hbsObj = [].concat(ccn, ctg, mkl, bnc);

    //console.log(hbsObj);
    return hbsObj;
}


// Async function to get and scape Coin Telegraph site
async function fetchCtg(searchterm, numRecords) {

    // Initialise an empty array to store all scraped objects
    var resultsCtg = [];
    var countRecords = 0;

    // Grab the body of the html with request
    var data = await axios.get("https://cointelegraph.com/tags/bitcoin").then(function (response) {
        // Then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Grab div tags with class "post boxed ", and do the following:
        $('article').each(function (i, element) {

            // Initialise empty result object
            var result = {};
            result.title = $(this)
                .children('div')
                .children('header')
                .children('div')
                .children('a')
                .children('span')
                .text();
            result.link = $(this)
                .children('a')
                .attr("href");
            result.description = $(this)
                .children('div')
                .children('main')
                .children('p')
                .text();
            result.image = $(this)
                .children('a')
                .children('figure')
                .children('div')
                .children('div')
                .children('img')
                .attr('src');
                console.log(result.image)
                
            result.date = $(this)
                .children('div')
                .children('header')
                .children('div')
                .children('time')
                .text();
            result.newssite_full = "Coin Telegraph";
            result.newssite_abbr = "CTG";
            result.id = countRecords;

            // If no searchterm then push result object to results array
            // If searchterm present then search artcile title for searchterm and push to array if found/match
            if (countRecords < numRecords) {
 
                if (!searchterm) {

                    resultsCtg.push(result);
                } else {
                    if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                        resultsCtg.push(result);
                    }
                }

                countRecords++
            }
        });

    });

    //console.log(resultsCtg);
    return resultsCtg;
}


// Async function to get and scape Cryptocoin News site
async function fetchCcn(searchterm, numRecords) {

    // Initialise an empty array to store all scraped objects
    var resultsCcn = [];
    var countRecords = 0;

    // Grab the body of the html with request
    var data = await axios.get("https://cryptocoin.news/category/news/").then(function (response) {
        // Then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Grab every article tag, and do the following:
        $('div[class="td-block-span6"]').each(function (i, element) {

            // Initialise empty result object
            var result = {};
            //console.log($(this))
            result.title = $(this)
                .children("div")
                .children("h3")
                .children("a")
                .attr("title");
            result.description = $(this)
                .children("div")
                .children("h3")
                .children("a")
                .attr("title");
            result.link = $(this)
                .children("div")
                .children("h3")
                .children("a")
                .attr("href");
            result.image = $(this)
                .children("div")
                .children("div")
                .children("div")
                .children("a")
                .children("img")
                .attr("data-img-url");
            result.internal_category = $(this)
                .children("header")
                .children("div")
                .children("span")
                .children("a")
                .attr("title");
            result.date = $(this)
                .children("div")
                .children("div")
                .children("span")
                .children("time")
                .text()
            result.newssite_full = "Crypto Coin News";
            result.newssite_abbr = "CNN";

            // If no searchterm then push result object to results array
            // If searchterm present then search artcile title for searchterm and push to array if found/match
            if (countRecords < numRecords) {

                if (!searchterm) {
                    resultsCcn.push(result);
                } else {
                    if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                        resultsCcn.push(result);
                    }
                }

                countRecords++
            }
        });
    });

    // return the results array
    // console.log(resultsCcn);
    return resultsCcn;
}


// Async function to get and scape each page in turn of first five pages of news articles from The Merkle.com
async function fetchesMkl(searchterm, numRecords) {

    // Initialise an empty array to store all scraped objects
    var resultsMkl = [];
    var countRecords = 0;

    // Number of pages to scrape
    var numPages = 3;

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
                result.newssite_abbr = "TMK";

                // If no searchterm then push result object to results array
                // If searchterm present then search artcile title for searchterm and push to array if found/match
                if (countRecords < numRecords) {
                    if (!searchterm) {
                        results.push(result);
                    } else {
                        if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                            results.push(result);
                        }
                    }

                    countRecords++;
                }
            });

            resultsMkl = resultsMkl.concat(results);
        });
    }
    //console.log(resultsMkl);
    return resultsMkl;
}

// Async function to get and scape Brave New Coin site
async function fetchBnc(searchterm, numRecords) {

    // Initialise an empty array to store all scraped objects
    var resultsBnc = [];
    var countRecords = 0;

    // Grab the body of the html with request
    var data = await axios.get("https://bravenewcoin.com/insights/latest/").then(function (response) {
        // Then, load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Grab div tags with class "post boxed ", and do the following:
        $('div[class="media-thumbnail"]').each(function (i, element) {

            // Initialise empty result object
            var result = {};

            result.title = $(this)
            console.log("result-title: ", result.title)
                .children('div')
                .children('div')
                .children('a')
                .attr("title");
                //console.log("result-title: ", result.title)
            result.link = "https://www.bravenewcoin.com" + $(this)
                .children('div')
                .children('div')
                .children('a')
                .attr("href");
            result.description = $(this)
                .children('span')
                .children('div[class="fader"]')
                .children('a')
                .children('p')
                .text();
            result.image = "https://www.bravenewcoin.com" + $(this)
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
            result.newssite_abbr = "BNC";

            // If no searchterm then push result object to results array
            // If searchterm present then search artcile title for searchterm and push to array if found/match
            if (countRecords < numRecords) {

                if (!searchterm) {
                    resultsBnc.push(result);
                } else {
                    if (result.title.toLowerCase().indexOf(searchterm.toLowerCase()) >= 0) {
                        resultsBnc.push(result);
                    }
                }

                countRecords++
            }
        });
    });

    //console.log(resultsBnc);
    return resultsBnc;
}


// export routes

module.exports = routerScrape;