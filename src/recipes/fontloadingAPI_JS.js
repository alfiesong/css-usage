/*
    JSAPI RECIPE: Font loading API
    -------------------------------------------------------------
    Author: alson
    Description: Find instances of Font loading APIs
*/

window.debugCSSUsage = true

window.apiCount = 0;
FontFace.prototype._oldLoad = FontFace.prototype.load;
FontFace.prototype.load = function() {
    console.log('In load function');
    window.apiCount++;
    this._oldLoad();
};

void function () {
    document.addEventListener('DOMContentLoaded', function () {
        var results = {};
        var recipeName = "font_loading_api_ready";

        if(window.apiCount > 0)
        {
            results[recipeName] = results[recipeName] || { count: 0, href: location.href };
            results[recipeName].count = window.apiCount;
        }
        else
        {
            results[recipeName] = results[recipeName] || { href: location.href };
        }


        appendResults(results);

        // Add it to the document dom
        function appendResults(results) {
            if (window.debugCSSUsage) console.log("Trying to append");
            var output = document.createElement('script');
            output.id = "css-usage-tsv-results";
            output.textContent = JSON.stringify(results);
            output.type = 'text/plain';
            document.querySelector('head').appendChild(output);
            var successfulAppend = checkAppend();
        }

        function checkAppend() {
            if (window.debugCSSUsage) console.log("Checking append");
            var elem = document.getElementById('css-usage-tsv-results');
            if (elem === null) {
                if (window.debugCSSUsage) console.log("Element not appended");
            }
            else {
                if (window.debugCSSUsage) console.log("Element successfully found");
            }
        }

    });
}();