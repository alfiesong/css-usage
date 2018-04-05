/*
    RECIPE: Passive Event Listener
    -------------------------------------------------------------
    Author: alson
    Description: This counts any page that includes any script referecnces to passive event listener
    Scenraios:
    1. addEventListener(any, function, {passive:true}); -> /addEventListener\s*\(\s*\S*,\s*\S*,\s*\{\s*passive\s*:\s*\S*\s*\}\s*\)/g
    2. addEventListener(any, function, {passive:true, capture:true, once: true});
    Above two scenario, we use /addEventListener\s*\(\s*\S*,\s*\S*,\s*\{\s*passive\s*:/g    just to detect "addEventListener(any, function, {passive:"
    here ignore the case when passive is not the first parameter, because it would probably make it too complicated
    3. addEventListener(any, function, passiveSupported ? { passive: true } : false);
    /addEventListener\s*\(\s*\S*,\s*\S*,\s*\S*\s*\?\s*{\s*passive\s*:/g

    Also we have below scenarios:
    4. addEventListener(any, function, option); var option = { passive: true }; this scenario is hard to have a perfect solution to detect
    Also need to exclude this scenario:
    5. addEventListener(any, function, true)  this trade "true" as useCapture

    Since there are so many different situations for 4 and 5, here we just detect
    a. if addEventListener is using a third parameter
    b. if "passive:" shows up in JS. This indicates a high chance that JS is at least trying to use passive event listener
    And treat this alone as "extendedCount", which covers all scenarios.

    In the result, if the count number > 0, then indicate the page probably uses passive event listener
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function passiveEL( element, results) {

        results["use"] = results["use"] || { docFontsCount: 0, fontFaceCount: 0, errors: 0 };

        try {
            if (element.nodeName == "SCRIPT") {

                var scriptText = "";

                // inline script
                if (element.text !== undefined) {
					if (element.innerText.indexOf("new FontFace") != -1) {
					    //scriptText = element.innerText;
					    results["use"].fontFaceCount++;
                    }
                    if (element.innerText.indexOf("document.fonts") != -1) {
						//scriptText = element.innerText;
						results["use"].docFontsCount++;
                    }
				}

                // download JS using xhr
                /*
                else if (element.src !== undefined && element.src != "" && element.src.indexOf("Recipe.min.js") == -1) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", element.src, false); // third parameter, set it to sync otherwise it won't catch it
                    xhr.send();
                    if (xhr.status === 200 && xhr.responseText.indexOf("passive:") != -1) {
                        scriptText = xhr.responseText;
                    }
                }*/
   				/*
                // 1,2,3
                var matchCount1 = (scriptText.match(/addEventListener\s*\(\s*\S*,\s*\S*,\s*\{\s*passive\s*:/g) || []).length;
                var matchCount2 = (scriptText.match(/addEventListener\s*\(\s*\S*,\s*\S*,\s*\S*\s*\?\s*{\s*passive\s*:/g) || []).length;
                if (matchCount1 > 0 || matchCount2 > 0) {
                    results["use"].Count++;
                }
                // 4, 5

                var matchCount = (scriptText.match(/addEventListener\s*\(\s*\S*,\s*\S*,(?!\s*true\s*\))(?!\s*false\s*\))/g) || []).length; // it has a third parameter, but not "true" or "false"
                if (matchCount > 0) {
                    results["use"].extendedCount++;
                }
                */
            }
        }

        catch (err) {
            results["use"].errors++;
        }

        return results;
    });
}();

