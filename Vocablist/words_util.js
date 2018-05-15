$(document).ready(function () {
	var contextsRef = firebase.database().ref('contexts');
	var vocabsRef = firebase.database().ref('vocabs');	

	var vocabFromID = function (id, callback) {
		vocabsRef.orderByChild('id').equalTo(id).once('value').then(function (snapshot) {
			callback(Object.values(snapshot.val())[0]);
		});
	};

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
});