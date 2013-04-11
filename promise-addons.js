/**
 * Wait for all these promises to complete. One failed => this fails too.
 */
Promise.when = function(all) {
	var promise = new this();
	var counter = 0;
	var results = [];

	for (var i=0;i<all.length;i++) {
		counter++;
		all[i].then(function(result) {
			results.push(result);
			counter--;
			if (!counter) { promise.fulfill(results); }
		}, function(reason) {
			counter = 1/0;
			promise.reject(reason);
		});
	}

	return promise;
}

/**
 * Promise-based version of setTimeout
 */
Promise.setTimeout = function(ms) {
	var promise = new this();
	setTimeout(function() { promise.fulfill(); }, ms);
	return promise;
}

/**
 * Promise-based version of addEventListener
 */
Promise.event = function(element, event, capture) {
	var promise = new this();
	var cb = function(e) {
		element.removeEventListener(event, cb, capture);
		promise.fulfill(e);
	}
	element.addEventListener(event, cb, capture);
	return promise;
}

/**
 * Promise-based version of XMLHttpRequest::send
 */
Promise.send = function(xhr, data) {
	var promise = new this();
	xhr.addEventListener("readystatechange", function(e) {
		if (e.target.readyState != 4) { return; }
		if (e.target.status == 200) {
			promise.fulfill(e.target);
		} else {
			promise.reject(e.target);
		}
	});
	xhr.send(data);
	return promise;
}
