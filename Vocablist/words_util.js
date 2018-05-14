$(document).ready(function () {
	var contextsRef = firebase.database().ref('contexts');
	var vocabsRef = firebase.database().ref('vocabs');

	function getContextFromVocab(vocab_id) {
		var ret = [];
		contextsRef.once('value').then(function (snapshot) {
			snapshot.forEach(function(context_snap) {
				var context = context_snap.val();
				if (Object.values(context.vocabs).includes(vocab_id));
					ret.push(context);
			});
		});
	}

	amon = getContextFromVocab(31);
});