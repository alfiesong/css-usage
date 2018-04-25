/*
    RECIPE: FontFace in Media query
    -------------------------------------------------------------
    Author: Alfie Song
    Description: Find use of FontFace in Media query.
    This method only works for Chrome.
    In Edge we don't support font-face in media query so Edge would not have font-face text in cssText property
*/

void function() {
    window.CSSUsage.StyleWalker.recipesToRun.push( function mediaqueryFontFace(/*HTML DOM Element*/ element, results) {

        results["use"] = results["use"] || { count: 0};

        // return if we already have a result.
        // This mediaqueryFontFace function will be called for every element
        // and our function only need to be called once, it will return all of them
        if(results["use"].count > 0)
        	return results;

    //    if (element.nodeName === "STYLE" || (element.nodeName === "LINK" && element.rel === "stylesheet")) {
			for(var i=0; i < document.styleSheets.length; i++) {
				//var text = document.styleSheets[i].cssText; this cssText only applies to Edge
				var ruleList;

				// here have to catch the error because document.styleSheets[i].hasOwnProperty('rules') always return false;
				// refer to https://github.com/odoo/odoo/issues/22517
				try {
				    ruleList = document.styleSheets[i].rules;
				}
				catch(err) {
				    console.log("no rules for this style: " + err);
				    continue;
				}

				for(var j=0; j < ruleList.length; j++) {
					/* MEDIA_RULE is 4. Constant
						cssRuleReference.UNKNOWN_RULE 0
						cssRuleReference.STYLE_RULE 1
						cssRuleReference.CHARSET_RULE 2
						cssRuleReference.IMPORT_RULE 3
						cssRuleReference.MEDIA_RULE 4
						cssRuleReference.FONT_FACE_RULE 5
						cssRuleReference.PAGE_RULE 6
						*/
					if(ruleList[j].type == ruleList[j].MEDIA_RULE) {
						console.log("inside media rule: i" + i + " j " + j);
						// within the media rule, if there's a font-face, then record it
						if(ruleList[j].cssText.indexOf("@font-face") != -1){
							results["use"].count++;
							console.log("fount it: i " + i + " j " + j);
							console.log(ruleList[j].cssText);
						}
					}
				}
			}
   //     }

        return results;
    });
}();