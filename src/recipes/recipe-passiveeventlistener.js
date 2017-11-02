/*
    RECIPE: Passive Event Listener
    -------------------------------------------------------------
    Author: alson
    Description: This counts any page that includes any script referecnces to passive event listener
    Scenraios:
    1. addEventListener(any, function, {passive:true}); -> /addEventListener\s*\(\s*\S*,\s*\S*,\s*\{\s*passive\s*:\s*\S*\s*\}\s*\)/g
    2. addEventListener(any, function, {passive:true, capture:true, once: true});
    3. addEventListener(any, function, option); var option = { passive: true }; this scenario is hard to have a perfect solution to detect
    4. addEventListener(any, function, passiveSupported ? { passive: true } : false);
    Also need to exclude this scenario:
    1. addEventListener(any, function, true)  this trade "true" as useCapture 

    Since there are so many different scenarios, here we just detect 
    a. if addEventListener is using a third parameter
    b. if "passive:" shows up in JS. This indicates a high chance that JS is at least trying to use passive event listener


*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function passiveEL( element, results) {

        results["use"] = results["use"] || { count: 0, errors: 0 };

        try {
            if (element.nodeName == "SCRIPT") {
                // inline script
                if (element.text !== undefined && element.innerText.indexOf("passive:") != -1) {
                    var matchCount = (element.innerText.match(/addEventListener\s*\(\s*\S*,\s*\S*,/g) || []).length;
                    if (matchCount > 0) {
                        results["use"].count++;
                    }
                }
                // download JS using xhr
                else if (element.src !== undefined && element.src != "" && element.src.indexOf("Recipe.min.js") == -1) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", element.src, false);
                    xhr.send();
                    if (xhr.status === 200 && xhr.responseText.indexOf("passive:") != -1) {
                        var matchCount = (xhr.responseText.match(/addEventListener\s*\(\s*\S*,\s*\S*,/g) || []).length;
                        if (matchCount > 0) {
                            results["use"].count++;
                        }
                    }
                }
            }
        }

        catch (err) {
            results["use"].errors++;
        }

        return results;
    });
}();

