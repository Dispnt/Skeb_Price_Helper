// ==UserScript==
// @name         Skeb Price Helper
// @namespace    https://fofu.dispnt.com/
// @version      0.4
// @description  Get Price info in your Skeb's following creators Page
// @author       Dispnt
// @match        https://skeb.jp/*/following_creators*
// @icon         https://www.google.com/s2/favicons?domain=skeb.jp
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==



(function () {
    'use strict';
    function getArtistPrice() {
        var artist_cols = document.getElementsByClassName('column'); // get artist collections
        Array.prototype.forEach.call(artist_cols, function (artist_col) { // forEach
            if (artist_col.innerText.includes('Seeking')) { // Skip artist isn't seeking
                var artist_url = "https://skeb.jp" + artist_col.childNodes[0].getAttribute("href"); //concatenate url
                GM_xmlhttpRequest({ // get current artist's page
                    method: "GET",
                    url: artist_url,
                    onload: function (response) {
                        if (response.status == 200) {
                            let artist_page = new DOMParser().parseFromString(response.responseText, "text/html"); // parse text to html
                            let price = artist_page.getElementsByTagName("td")[3].innerText; // find price label
                            artist_col.setAttribute("price", price.replace(/[^0-9]/ig, "")); // set price integer to attribute
                            artist_col.getElementsByClassName("subtitle is-7")[0].innerText = price; //set subtitle to price
                        }
                    }
                });
                artist_col.getElementsByClassName("subtitle is-7")[0].style.color = "RED"; //set subtitle to red
            }
            else{
                artist_col.setAttribute("price",999999)
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
        var div = document.createElement("div");
        div.innerHTML = "<a class='is-active' style='color: #473C8B'>*Price*</a>";
        div.class = "level-item";
        var level = document.getElementsByClassName("level-right")[0];
        level.appendChild(div);
        div.addEventListener("click", function () {
            sortByPrice();
        });
    }

    setTimeout(function () {
        console.log('🦙 Skeb Price Helper is now running... 🦙');
        createPriceSortLabel()
        getArtistPrice();
    }, 1000);


})();