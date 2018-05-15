/*
    RECIPE: Web Animation API
    -------------------------------------------------------------
    Author: alson
    Description: This counts any page that includes any script referecnces to web animnation API
    Scenraios:
    1. h1.animate(keyframes, options)
    2. var aliceChange = document.getElementById('alice').animate(
		  [
			{ transform: 'translate(-50%, -50%) scale(.5)' },
			{ transform: 'translate(-50%, -50%) scale(2)' }
		  ], {
			duration: 8000,
			easing: 'ease-in-out',
			fill: 'both'
		  });
    3. If a script section has: <script src="https://rawgit.com/web-animations/web-animations-js/master/web-animations.min.js"></script>
       Then it is using polyfill.

    Have to do a regex parsing because JS API crawling does not support Chrome. But have to use Chrome to get the real usage of this API.
    Will do a polyfill run on Edge.

	In the result you may see for a URL, 4 rows, extendedCount Count Poly and errors. If Poly > 0, ignore the rest, this is poly.
	if Poly == 0 but extendedCount or Count > 0, this is web animation API usage
	if it has TweenMax or TweenLite, that means GreenSock library
	jquery has a simiar function, needs to record it
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function webanimation( element, results) {

        results["use"] = results["use"] || { Count: 0, Poly: 0, GS: 0, jquery: 0 };

        try {
            if (element.nodeName == "SCRIPT") {

                var scriptText = "";

                // inline script
                if (element.text !== undefined && element.innerText.indexOf(".animate") != -1) {
                    scriptText = element.innerText;
                }
                // download JS using xhr
                else if (element.src !== undefined && element.src != "" ) {
					if(element.src.indexOf("web-animations.min.js") != -1) { // this is a polyfill, record and return
						results["use"].Poly++;
						return results;
					}
					else if(element.src.indexOf("TweenMax.min.js") != -1 || element.src.indexOf("TweenLite.min.js") != -1 ) { // this is a greensock
						results["use"].GS++;
						return results;
					}
					else if (element.src !== undefined && element.src.toLowerCase().indexOf("jquery") != -1 ) {
						results["use"].jquery++;
						return results;
					}

                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", element.src, false); // third parameter, set it to sync otherwise it won't catch it
                    xhr.send();
                    if (xhr.status === 200 && xhr.responseText.indexOf(".animate") != -1  ) {
						if(xhr.responseText.indexOf("jquery") != -1 || xhr.responseText.indexOf("jQuery") != -1){ // if jquery not exist
                        	results["use"].jquery++;
                        	return results;
						}
                        if(xhr.responseText.indexOf("web-animations.min.js") != -1){
                        	results["use"].Poly++;
                        	return results;
                        }
                        if(xhr.responseText.indexOf("TweenMax") != -1 || xhr.responseText.indexOf("TweenLite") != -1){
                        	results["use"].GS++;
                        	return results;
                        }
                        scriptText = xhr.responseText;
                    }
                }

                var matchCount = (scriptText.match(/\.animate\s*\(\s*\S*\s*,\s*\S*\s*\)/g) || [] ).length; // .animate    ( keyframes   ,  options )
                if (matchCount > 0) {
                    results["use"].Count++;
                }

             //   var matchCount1 = (scriptText.match(/\.animate\s*\(\s*\S*/g)  || [] ).length; // this is .animate (
             //   if (matchCount1 > 0) {
             //       results["use"].extendedCount++;
             //  }

            }
        }

        catch (err) {
            return results;
        }
        return results;
    });
}();

