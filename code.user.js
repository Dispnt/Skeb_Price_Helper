// ==UserScript==
// @name         Skeb Price Helper
// @namespace    https://fofu.dispnt.com/
// @version      0.7
// @description  Get Price info in your Skeb's following creators Page
// @author       Dispnt
// @match        https://skeb.jp/*/following_creators*
// @icon         https://www.google.com/s2/favicons?domain=skeb.jp
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==




(function () {
    function checkArtistColUpdate(){
        console.log(artist_cols)
        artist_cols = document.getElementsByClassName('column');
        console.log('----')
        console.log(artist_cols)
    }
    
    'use strict';
    function getArtistPrice() {
        console.log("getArtistPrice")
        artist_cols = document.getElementsByClassName('column');
        Array.prototype.forEach.call(artist_cols, function (artist_col) { // forEach
            if (artist_col.innerText.includes('Seeking')||artist_col.innerText.includes('募集')||artist_col.innerText.includes('모집 중')) { // Skip artist isn't seeking
                var artist_url = "https://skeb.jp" + artist_col.childNodes[0].getAttribute("href"); //concatenate url
                console.log(artist_col.childNodes[0].getAttribute("href"))
                GM_xmlhttpRequest({ // get current artist's page
                    method: "GET",
                    url: artist_url,
                    onload: function (response) {
                        if (response.status == 200) {
                            let artist_page = new DOMParser().parseFromString(response.responseText, "text/html"); // parse text to html
                            let price = artist_page.getElementsByTagName("td")[3].innerText; // find price label
                            artist_col.setAttribute("price", price.replace(/[^0-9]/ig, "")); // set price integer to attribute
                            artist_col.getElementsByClassName("subtitle")[0].innerText = price; //set subtitle to price
                            console.log(artist_col.childNodes[0].getAttribute("href") + ":" + price)
                        }
                        else{
                            console.log("err")
                        }
                    }
                });
                artist_col.getElementsByClassName("subtitle")[0].style.color = "RED"; //set subtitle to red
            }
            else {
                artist_col.classList.add("stopped")
                artist_col.setAttribute("price", 0);
            }
        });
    }

    function sortByPrice() {
        var artist_div = $('.columns');
        artist_div.find('.column').sort(function (a, b) {
            return +a.getAttribute('price') - +b.getAttribute('price');
        }).appendTo(artist_div);
    }


    function createPriceSortLabel() {
        console.log("creating Price Sort Label")
        var div = document.createElement("div");
        div.innerHTML = "<a class='is-active' style='background-color: #DCDCDC;'>2. Sort by Price</a>";
        div.className = "level-item";
        $(".level .is-mobile").append(div)
        div.addEventListener("click", function () {
            sortByPrice();
        });
    }

    function createPriceFetchLabel() {
        console.log("creating Price Fetch Label")
        var div = document.createElement("div");
        div.innerHTML = "<a class='is-active' style='background-color: #DCDCDC;margin-left:8px;'>1. Get Price of Current Page</a>";
        div.className = "level-item";
        $(".level .is-mobile").append(div)
        div.addEventListener("click", function () {
            getArtistPrice();
        });  
    }

    $(function () {
        console.log('🦙 Skeb Price Helper is now running... 🦙');
        artist_cols = document.getElementsByClassName('column');
        setTimeout(createPriceFetchLabel,1000)
        setTimeout(createPriceSortLabel,1000)
    })

})();