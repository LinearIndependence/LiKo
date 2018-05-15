//$(document).ready(function () {
	var contextsRef = firebase.database().ref('contexts');
	var vocabsRef = firebase.database().ref('vocabs');	

	function vocabFromID (id, callback) {
		vocabsRef.orderByChild('id').equalTo(id).once('value').then(function (snapshot) {
			//console.log(snapshot.val());
			callback(Object.values(snapshot.val())[0]);
		});

		// Example
		// vocabFromID(31, vocab => alert(vocab.korean)); // '사랑하다'가 출력됨
	}

	function isVocabInList (context_chapter, vocab_id, callback) {
		contextsRef.orderByChild('chapter').equalTo(context_chapter).once('value').then(function (snapshot) {
			callback(Object.values(Object.values(snapshot.val())[0].vocabs).indexOf(vocab_id) > -1);
		});

		// Example
		// isVocabInList(1, 31, includes => alert(includes)); // True 또는 False가 출력됨
	}

	//isVocabInList(1, 31, includes => console.log(includes));
	/*
	function getContextFromVocab(vocab_id) {
		var ret = [];
		contextsRef.once('value').then(function (snapshot) {
			snapshot.forEach(function(context_snap) {
				var context = context_snap.val();
				if (Object.values(context.vocabs).includes(vocab_id))
					ret.push(context);
			});
		});
		return ret;
	}

	function getVocabFromID(vocab_id) {
		var ret = null;
		vocabsRef.once('value').then(function (snapshot) {
			snapshot.forEach(function(context_snap) {
				var vocab = context_snap.val();
				console.log(vocab);
				if (vocab.id == vocab_id)
				{
					ret = vocab_id;
					return;
				}
			});
		});
		
		return ret;
	}
	*/
	//console.log(getContextFromVocab(31));
	//console.log(getVocabFromID(31));
//});