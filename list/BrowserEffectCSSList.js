(function(anim) {

	var BrowserEffectCSSList = anim.BrowserEffectCSSList = function BrowserEffectCSSList() {
		this.list = {};
	}
	var effectCSSList = BrowserEffectCSSList.list = {"origin" : "transform-origin:?", "transition":"transition:?"}
	
	BrowserEffectCSSList.has = function(name) {
		return effectCSSList.hasOwnProperty(name);
	}
	daylight.extend(true, BrowserEffectCSSList.prototype, $CSSList.prototype);
	BrowserEffectCSSList.prototype.get = function(prefix) {
		var list = this.list;
		var value;
		var sStyle = "";
		var length = 0;
		var effectCSS;
		for(var name in list) {
			value = list[name];
			if(!effectCSSList.hasOwnProperty(name))
				continue;
				
			effectCSS = effectCSSList[name];
			sStyle += "{prefix}" +  effectCSS.replace("?", list[name]) +";";
			++length;
		}
		
		if(length === 0)
			return "";
			
		return anim.prefixToBrowser(sStyle, prefix);
	};
	
	
	daylight.defineGlobal("$BrowserEffectCSSList", BrowserEffectCSSList);
	
})(daylight.animation);
