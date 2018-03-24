//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			custom_utility.js
// 	Date Created: 	March 23, 2018
// 	Last Modified: 	March 23, 2018
// 	Details:
// 					This file contains custom utility functions that perform common, general tasks among all the server sub-applications.
// 	Dependencies:
// 					n/a

"use strict"
var settings = require("./settings");
var logger = require(`${settings.util}/logger`);



// Singleton Container
const cutil = {};



/*
	@function 	delintRequestBody
	@parameter 	body - the JSON object forming the POST request body
	@parameter 	callback - (optional) a callback function to run after delinting. It is passed the delinted request body object
	@returns 	If callback is undefined, returns the delinted request body object
	@details 	This function is intended for use on the ExpressJS request.body parameter. Since body-parser seems to allow the output JSON's keys to include the starting "?" from the querystring, it needs to be removed from the key. This function does precisely that by adding a new parameter to the object before returning it
	@note		The "?" seems to only appear in the first key passed, and always seems to start at the front of the key.
*/
cutil.delintRequestBody = function  (body, callback) {
	var handlerTag = {"src": "cutil.delintRequestBody"};
	logger.log(`Delinting ${JSON.stringify(body)}`, handlerTag);	// Debug
	var newBody = body;
	var newBodyKeys = Object.keys(newBody);	// array of keys
	for(var i = 0; i < newBodyKeys.length; i++) {
		var qmarkIndex = newBodyKeys[i].indexOf("?");
		if (qmarkIndex !== -1) {
			logger.log(`Lint found at ${newBodyKeys[i]} index ${qmarkIndex}`, handlerTag);	// Debug
			// If the key has a "?", create a new property without it.
			var newKeyName = newBodyKeys[i].substring(qmarkIndex+1);	// acquires the string without "?" in it
			newBody[newKeyName] = newBody[newBodyKeys[i]];		// copy the original value over
			// logger.log(`New key: ${typeof newKeyName} ${newKeyName}\nNew object: ${JSON.stringify(newBody)}`);	// Debug

			// Since we know there is only one key with the "?", we no longer need to go through the array
			if (typeof callback === "undefined") {
				return newBody;
			} else {
				callback(newBody);
			}
			break;
		}
	}
	// If lint was not found at all, simply return the untouched stuff
	logger.log(`Lint was not found!`, handlerTag);	// Debug
	if (typeof callback === "undefined") {
		return newBody;
	} else {
		callback(newBody);
	}
};

/*
	@function 	numerify
	@parameter 	obj - the JSON object to numerify
	@returns 	The numerified JSON object
	@details 	This function takes a JSON object and converts to numbers any (and all) string member-values whose characters are all numeric
*/
cutil.numerify = function (obj) {
	var handlerTag = {"src": "cutil.numerify"};

	try {
		// Convert obj to string first...
		var objAsString = JSON.stringify(obj);

		// Then reparse it with a reviver function
		var newObj = JSON.parse(objAsString,
			(key, value) => {
				var handlerTag = {"src": "bodyParser.json.Reviver"};
				// Attempt to convert string into number
				if (typeof value === "string" && Number.isNaN(Number(value)) === false) {
					logger.log(`Converting string ${value} into number ${Number(value)}`, handlerTag);
					return Number(value);
				} else {
					logger.log(`Leaving ${typeof value} ${(typeof value === "object") ? JSON.stringify(value) : value} as is`, handlerTag);
					return value;
				}
			}
		);
		return newObj;
	} catch (err) {
		logger.log(`Unable to numerify ${typeof obj} ${JSON.stringify(obj)}:\n${err}`, handlerTag);
		return obj;
	}
};

/*
	@function 	extractFromObjectArray
	@parameter 	arr - the array of JSON objects to extract from
	@parameter 	key - the string specifying the key to extract a value from
	@parameter 	callback - (optional) a callback function to run after extraction completes. It is passed the resulting array
	@returns 	If callback is undefined, returns the resulting array
	@details 	This function takes an array of JSON objects "arr" and iterates through it, extracting from each object the value associated with "key" and placing it into an array, which is either passed to the callback parameter (if defined), or returned to the caller. If the "arr" contains objects that do not have the same set of keys, any objects that do not have the member "key" will cause this function to populate the corresponding array index with "null". As an example, running this section of code:
		var myArrayOfObjects = [{"a":0, "b":1}, {"a":2, "b":3}, {"a":4, "c":5}, {"a":6, "b":7}];
		var theKeyToFind = "b"
		var result = extractFromObjectArray(myArrayOfObjects, theKeyToFind);
	will populate the result with the follwing array:
		[1,3,null,7]
	since myArrayOfObjects[2] does NOT contain a member "b". This is also the function's exact behavior when it encounters incorrectly-typed "arr" member (i.e. one that is NOT of type "object").
	@note 		This function returns an array whose values are placed in the order that the objects of "arr" are sequenced.
*/
cutil.extractFromObjectArray = function (arr, key, callback) {
	var result = [];
	for (var i = 0; i < arr.length + 1; i++) {
		switch (i) {
			case arr.length: {
				if (typeof callback === "function") {
					callback(result);
				} else {
					return result;
				}
				break;
			}
			default: {
				switch (typeof arr[i][key]) {
					case "object": {
						result[i] = arr[i][key];
						break;
					}
					default: {
						result[i] = null;
						break;
					}
				}
				break;
			}
		}
	}
}

/*
	@function 	hashString
	@parameter 	string - the string needing to be encoded
	@returns 	An encoded string used for hashing.
	@details 	This function takes a string and encrypts it using caesars cipher. This encryption is used for hashing.
	@warning	This hash function is NOT cryptographically secure, and should not be used to hash any sensitive information!
*/
cutil.hashString = function (unhashed_string) {
	
	// Make an output variable
	var output = '';

	//Declare number of letters to shift by
	var amount = 13;

	// Go through each character
	for (var i = 0; i < unhashed_string.length; i ++) {
		// Get the character we'll be appending
		var c = unhashed_string[i];
		// If it's a letter...
		if (c.match(/[a-z]/i)) {
			// Get its code
			var code = unhashed_string.charCodeAt(i);
			// Uppercase letters
			if ((code >= 65) && (code <= 90))
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
			// Lowercase letters
			else if ((code >= 97) && (code <= 122))
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
		}
		// Append
		output += c;
	}

	// All done!
	return output;
};

/*
	@object 	introSorter
	@details 	This object contains code that performs introsort on our custom array of objects
*/
var introSorter = (function () {
	/*
		@function 	swap
		@parameter 	arr - the array to sort
		@parameter 	a - index a
		@parameter 	b - index b
		@returns 	n/a
	*/
	function swap (arr, a, b) {
		var temp = arr[a];
		arr[a] = arr[b];
		arr[b] = temp;
	}

	/*
		@function 	partition
		@parameter 	arr - the array to sort
		@parameter 	low - the lower bound of the array
		@parameter 	high - the higher bound of the array
		@parameter 	options - (optional) a JSON object specifying any or all of the following special control paramters:
			{
				msMode: ...,
				reverse: ...
			}
		where "msMode" is a boolean for Mean Skills Mode (performs special comparison on MeanSkills skillmatch object arrays), and "reverse" is a boolean that, if true, orders the array in DESCENDING order.
		@returns 	The index of the pivot after partitioning occurs
		@details	
	*/
	function partition(arr, low, high, options) {
		var pivotIndex = 0;
		var pivotValue = 0;
		var smallIndex;
		var ptrIndex;
		var pivotNewIndex = low;

		// Determine pseudo-random pivot index
		pivotIndex = Math.floor(Math.random() * (high - low) + low);

		// Get value of pivot
		pivotValue = (options.msMode === true) ? arr[pivotIndex].total : arr[pivotIndex];

		// console.log(`Parititioning ${((high - low + 1) % 2) ? "odd" : "even"} Arr[${low}:${high}] ${arr} @ pivotIndex ${pivotIndex}`);
		
		// Swap pivot with 0'th element of the (sub)array
		swap(arr, low, pivotIndex);

		// Start small index at pivot's position
		smallIndex = pivotNewIndex;

		// Paritition (sub)array into two sublists
		for (var i = low; i <= high; i++) {
			ptrIndex = i;

			var compareVal = ((options.msMode === true) ? arr[ptrIndex].total : arr[ptrIndex]);

			if ((options.reverse === true) ? (pivotValue < compareVal) : (compareVal < pivotValue)) {
				smallIndex++;
				swap(arr, ptrIndex, smallIndex);
			}
		}

		// Return pivot to small Index position
		swap(arr, low, smallIndex);

		// Update new position of pivot
		pivotNewIndex = smallIndex;

		return pivotNewIndex;
	}

	/*
		@function 	introSort
		@parameter 	arr - the array to sort
		@parameter 	start - starting index of the array/subarray
		@parameter 	end - ending index of the array/subarray
		@parameter 	depth - the depth at which to switch from quicksort to heapsort
		@parameter 	options - a JSON object specifying any or all of the following special control parameters in the partition() function's options argument. Read that description for more details
		@returns 	n/a
		@details 	This function is called recursively to sort an array introspectively
	*/
	function introSort(arr, start, end, depth, options) {
		console.log(`introsorting Array[${start}:${end}] ${arr} (${depth} lvls above limit)`);
		
		if (start < end) {	// base case: if start greater than or equal to end, don't do this
			if (depth > 0) {	// if we have yet to reach depth limit, continue with quicksort
				var pivotIndex = partition(arr, start, end, options);
				introSort(arr, start, pivotIndex - 1, depth - 1, options);
				introSort(arr, pivotIndex + 1, end, depth - 1, options);
			} else {
				console.log("Switching to HeapSort");
				heapSorter.heapSort(arr);
			}
		}
	}

	return {
		introSort: introSort
	};
})();


/*
	@object 	heapSorter
	@details 	This object contains code that performs a MIN heaport (to sort array in DESCENDING order) on our custom array of objects
*/
var heapSorter = (function() {
	/*
		@function 	heapSort
		@parameter 	arr - the array to sort
		@returns 	n/a
		@details 	This function performs a heapsort on an array by first building a max heap, and recursively calling maxHeapify on a continuously decreasing recorded array size.
	*/
	function heapSort (arr) {
		// buildMaxHeap(arr);
		// for (var i = arr.length - 1; i >= 0; i--) {
		// 	swap(arr, 0, i);
		// 	maxHeapify(arr, 0, i);
		// }

		buildMinHeap(arr);
		for (var i = arr.length - 1; i >= 0; i--) {
			swap(arr, 0, i);
			minHeapify(arr, 0, i);
		}
	}

	/*
		@function 	buildMaxHeap
		@parameter 	arr - the array to build into a max heap
		@returns 	n/a
		@details	This function builds a max heap out of an array of elements
	*/
	function buildMaxHeap (arr) {
		for (var i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
			maxHeapify(arr, i, arr.length);
		}
	}

	/*
		@function 	buildMinHeap
		@parameter 	arr - the array to build into a min heap
		@returns 	n/a
		@details	This function builds a min heap out of an array of elements
	*/
	function buildMinHeap (arr) {
		for (var i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
			minHeapify(arr, i, arr.length);
		}
	}

	/*
		@function 	maxHeapify
		@parameter 	arr - the array to max-heapify
		@parameter 	index - the index to start from (i.e. the root reference)
		@parameter 	n - The last index of the arr
		@returns 	n/a
		@details 	?
	*/
	function maxHeapify (arr, index, n) {
		var largestChildIndex = index;
		var leftChildIndex = lchild(index);
		var rightChildIndex = rchild(index);
		
		// Look for largest child between index and its left child
		if (leftChildIndex < n && arr[leftChildIndex].total > arr[largestChildIndex].total) {
			largestChildIndex = leftChildIndex;
		}

		// Look for largest child between the current largest and index's right child
		if (rightChildIndex < n && arr[rightChildIndex].total > arr[largestChildIndex].total) {
			largestChildIndex = rightChildIndex;
		}

		// Final check to see if node i is larger than its direct children
		if (largestChildIndex !== index) {
			swap(arr, index, largestChildIndex);
			maxHeapify(arr, largestChildIndex, n);
		}
	}

	/*
		@function 	minHeapify
		@parameter 	arr - the array to min-heapify
		@parameter 	index - the index to start from (i.e. the root reference)
		@parameter 	n - The last index of the arr
		@returns 	n/a
		@details 	?
	*/
	function minHeapify (arr, index, n) {
		var smallestChildIndex = index;
		var leftChildIndex = lchild(index);
		var rightChildIndex = rchild(index);
		
		// Look for largest child between index and its left child
		if (leftChildIndex < n && arr[leftChildIndex].total < arr[smallestChildIndex].total) {
			smallestChildIndex = leftChildIndex;
		}

		// Look for largest child between the current largest and index's right child
		if (rightChildIndex < n && arr[rightChildIndex].total < arr[smallestChildIndex].total) {
			smallestChildIndex = rightChildIndex;
		}

		// Final check to see if node i is larger than its direct children
		if (smallestChildIndex !== index) {
			swap(arr, index, smallestChildIndex);
			minHeapify(arr, smallestChildIndex, n);
		}
	}

	/*
		@function 	swap
		@parameter 	arr - the array to sort
		@parameter 	a - index a
		@parameter 	b - index b
		@returns 	n/a
	*/
	function swap (arr, a, b) {
		var temp = arr[a];
		arr[a] = arr[b];
		arr[b] = temp;
	}

	/*
		@function 	lchild
		@parameter 	index - the array index of the node to acquire a left child from
		@returns 	The index of the left child for node i
		@details 	?
	*/
	function lchild (index) {
		return 2*index + 1;
	}

	/*
		@function 	rchild
		@parameter 	index - the array index of the node to acquire a right child from
		@returns 	The index of the right child for node i
		@details 	?
	*/
	function rchild (index) {
		return 2*index + 2;
	}

	/*
		@function 	parent
		@parameter 	index - the index to acquire a parent from
		@returns 	The index of the parent for node i
		@details 	?
	*/
	function parent (index) {
		return Math.floor((i - 1) / 2);
	}

	return {
		heapSort: heapSort
	};
})();



Object.freeze(cutil);
module.exports = cutil;
// END custom_utility.js
