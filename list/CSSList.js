(function(anim) {
	
	var CSSList = anim.CSSList = function AnimationList(list) {
		this.list = list || {};
	}
	CSSList.prototype = {
		add: function(name, value) {
			this.list[name] = value;
		},
		push: function(name, value) {
			this.list[name] = value;			
		},
		get: function(prefix) {
			var list = this.list;
			var value;
			var sStyle = "";
			for(var name in list) {
				value = list[name];
				sStyle += name + ": " + value +";";
			}
			return sStyle;
		},
		has: function(name) {
			return this.list.hasOwnProperty(name);
		}
		
	};

	daylight.defineGlobal("$CSSList", CSSList);
	
})(daylight.animation);
//@{Transform.js}
//@{Filter.js}
//@{BrowserEffectCSSList.js}