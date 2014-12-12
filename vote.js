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

//document.cookie = "myVotes=; expires=Thu, 25 Dec 2013 23:59:59 UTC";

poll = {
	expires: 'expires=Thu, 25 Dec 2014 23:59:59 UTC',
	len: null,
	movies: null,
	
	build: function(mov){
		this.movies = mov;
		this.len = this.movies.length;
		
		this.loop(function(mov, idx){
			dom.poll.appendChild(poll.make_div(mov, idx));
			mov.el = document.getElementById(mov.id);
		});
		this.order();
	},
	get_votes: function(){
		var vals = (document.cookie=='') ? '' : document.cookie.split('=')[1];
		return (vals=='') ? [] : vals.split(',');
	},
	loop: function(callback){
		for(var x=0; x<this.len; x++){
			callback(this.movies[x], x);
		}
	},
	make_div: function(mov, idx){
		var div = document.createElement('div');
		div.setAttribute('id', mov.id);
		div.setAttribute('data-idx', idx);
		var cls = (this.voted_for(mov.id)) ? 'movie_vote selected': 'movie_vote';
		div.setAttribute("class", cls);
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
	order: function(){
		this.movies.sort(function(a,b){
			return b.attributes.votes - a.attributes.votes;
		});
		
		var top_score = this.movies[0].attributes.votes;
		var pos = 0;
		this.loop(function(mov, idx){
			mov.el.style.top = pos+'px';
			pos+=mov.el.offsetHeight+30;
			mov.el.setAttribute('data-idx', idx);
			mov.el.querySelector('.bar_total').style.width = (mov.attributes.votes / top_score * 100) +'%';
		});
		dom.poll.style.height = pos+'px';
	},
	vote: function(div){
		var idx = div.getAttribute('data-idx');
		var mov = this.movies[idx];
		var votes = this.get_votes();
		
		if(!this.voted_for(mov.id)){
			div.classList.add('selected');
			mov.increment('votes');
			votes.push(mov.id);
		}else{
			div.classList.remove('selected');
			mov.increment('votes', -1);
			var i = votes.indexOf(mov.id);
			votes.splice(i, 1);
		}
		
		mov.save();
		document.cookie = "myVotes="+ votes.join(',') +"; "+ this.expires;
		div.querySelector('.votes').innerHTML = mov.attributes.votes;
		this.order();
	},
	voted_for: function(mov_id){
		return poll.get_votes().indexOf(mov_id) >= 0 ;
	}
};