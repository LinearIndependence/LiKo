$(document).ready(function () {

	var contextsRef = firebase.database().ref('contexts').orderByChild('chapter');
	var context_container_box = document.getElementById('context_container_box');

	function renderContainerContents(snapshot) {
		while (context_container_box.firstChild) {
			context_container_box.removeChild(context_container_box.firstChild);
		}
		snapshot.forEach(function(context_snap) {
			yee = context_snap;
			var context = context_snap.val();
			var context_box = document.createElement("div");
			context_container_box.appendChild(context_box);

			context_box.className = "box context_box ";
			var label = document.createElement("div");
			context_box.appendChild(label);
			label.className = "inline largefont bold ";
			label.innerHTML = "Context " + context.chapter + " - " + context.name;
			var test_button = document.createElement("button");
			context_box.appendChild(test_button);
			test_button.className = "inline rightelement ";
			test_button.setAttribute('onclick', "firebase.database().ref('contexts/" + context_snap.key + "/vocabs/').push(prompt('단어 id 내놔'));");
			test_button.innerHTML = "테스트용 버튼 - 현재 맥락에 단어 추가";
			context_box.innerHTML += "<br>";
			for (var vocab in context.vocabs) {
				var vocab_box = document.createElement("a");
				context_box.appendChild(vocab_box);
				vocab_box.className = "inline box vocab_box bold ";
				vocab_box.innerHTML = context.vocabs[vocab];
				oooo = vocab;
				vocab_box.href = "inspect_word.html?word=" + context.vocabs[vocab];
			}
		});
	}

	contextsRef.on('value', function(snapshot) { renderContainerContents(snapshot); });
});