Parse.initialize("120wGaChy6suUEGhVWVZbe4lDSxS6JqILXNWVHSN", "BrIOqwMczDQchO6AqNh45s1cfMGhwh5DKBTDCsdM");

var Movie = Parse.Object.extend("Movie");
var query = new Parse.Query(Movie);
query.ascending("title");
query.find({
	success: function(results){
		poll.build(results);
	}
});

dom = {
	poll: document.getElementById('poll')
};

poll = {
	len: null,
	movies: null,
	
	build: function(mov){
		this.movies = mov;
		this.len = this.movies.length;
		
		this.loop(function(mov){
			dom.poll.appendChild(poll.make_div(mov));
		});
	},
	loop: function(callback){
		for(var x=0; x<this.len; x++){
			callback(this.movies[x], x);
		}
	},
	make_div: function(mov){
		var div = document.createElement('div');
		div.setAttribute('id', mov.id);
		div.setAttribute("class", "movie_vote");
		div.addEventListener('click', function(){ poll.vote(this); });
		
		var bar = document.createElement("div");
		bar.setAttribute("class", "bar")
		
		var bar_total = document.createElement("div");
		bar_total.setAttribute("class", "bar_total");
		bar.appendChild(bar_total);
		
		var h2 = document.createElement('h2');
		h2.setAttribute("class", "title");
		var txt = document.createTextNode(mov.attributes.title);
		h2.appendChild(txt);
		
		var h3 = document.createElement('h3');
		h3.setAttribute("class", "votes");
		var v_txt = document.createTextNode(mov.attributes.votes);
		h3.appendChild(v_txt);
		
		div.appendChild(bar);
		div.appendChild(h2);
		div.appendChild(h3);
		
		return div;
	},
	vote: function(div){
		div.classList.add('selected');
		console.log(div);
	}
};