

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function fontloading( element, results) {

        results["use"] = results["use"] || { docFontsCount: 0, Count: 0, errors: 0 };

        try {
            if (element.nodeName == "SCRIPT") {

                var scriptText = "";

                // inline script
                if (element.text !== undefined) {
					if (element.innerText.indexOf("new FontFace") != -1) {
					    //scriptText = element.innerText;
					    results["use"].Count++;
                    }
                    if (element.innerText.indexOf("document.fonts") != -1) {
						//scriptText = element.innerText;
						results["use"].docFontsCount++;
                    }
				}

                // download JS using xhr

                else if (element.src !== undefined && element.src != "" && element.src.indexOf("Recipe.min.js") == -1) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", element.src, false); // third parameter, set it to sync otherwise it won't catch it
                    xhr.send();
                    if (xhr.status === 200 && xhr.responseText.indexOf("passive:") != -1) {
                        scriptText = xhr.responseText;
                    }
                }

				if (scriptText.indexOf("new FontFace") != -1) {
				    //scriptText = element.innerText;
				    results["use"].Count++;
                }
                if (scriptText.indexOf("document.fonts") != -1) {
					//scriptText = element.innerText;
					results["use"].docFontsCount++;
                 }
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

