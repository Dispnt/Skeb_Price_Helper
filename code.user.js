// ==UserScript==
// @name         Skeb Price Checker
// @namespace    https://fofu.dispnt.com/
// @version      0.1
// @description  Get Price info in your Skeb's following creators Page
// @author       Dispnt
// @match        https://skeb.jp/*
// @icon         https://www.google.com/s2/favicons?domain=skeb.jp
// @grant        GM_xmlhttpRequest
// ==/UserScript==



(function () {
    'use strict';
    function getArtistPrice() {
        var artist_cols = document.getElementsByClassName('column');
        Array.prototype.forEach.call(artist_cols, function (artist_col) {
            if (artist_col.innerText.includes('Seeking')) {
                var artist_url = "https://skeb.jp" + artist_col.childNodes[0].getAttribute("href");
                GM_xmlhttpRequest({
                    method: "GET",
                    url: artist_url,
                    onload: function (response) {
                        if (response.status == 200) {
                            let artist_page = new DOMParser().parseFromString(response.responseText, "text/html");
                            let price = artist_page.getElementsByTagName("td")[3].innerText;
                            artist_col.getElementsByClassName("subtitle is-7")[0].innerText = price;
                        }
                    }
                });
                artist_col.getElementsByClassName("subtitle is-7")[0].style.color = "RED";
            }
        });
    }
    setTimeout(function () {
        // createButton();
        getArtistPrice();
        console.log('🦙 now running... 🦙');
    }, 1000);


})();