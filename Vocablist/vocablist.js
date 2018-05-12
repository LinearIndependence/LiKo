$(document).ready(function () {
	function render_container_contents() {
		var context_box = document.createElement("div");
		context_container_box.appendChild(context_box);

		context_box.className = "box context_box ";
		var label = document.createElement("div");
		context_box.appendChild(label);
		label.className = "inline largefont bold ";
		label.innerHTML = "Context 1 - Yee";
		var test_button = document.createElement("button");
		context_box.appendChild(test_button);
		test_button.className = "inline rightelement ";
		test_button.innerHTML = "테스트용 버튼 - 현재 맥락에 단어 추가";
		test_button.onclick = () => {alert('미구현')};
		context_box.innerHTML += "<br>";

		var vocab_box = document.createElement("div");
		context_box.appendChild(vocab_box);
		vocab_box.className = "inline box vocab_box bold ";
		vocab_box.innerHTML = "YEE";
	}

	var context_container_box = document.getElementById('context_container_box');

	render_container_contents();
});