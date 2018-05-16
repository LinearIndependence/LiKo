// code from https://www.sitepoint.com/get-url-parameters-with-javascript/

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}


$(document).ready(function () {
	var vocabsRef = firebase.database().ref('vocabs');
	var id = getAllUrlParams().word;

	vocabsRef.once('value').then(function (snapshot) {
			snapshot.forEach(function(context_snap) {
				var vocab = context_snap.val();
				if (vocab.id == id)
				{
					$('#vocab_box')[0].innerHTML =
					'<div class="inline">' + vocab.korean + 
					'</div><img src="Speaker_Icon.png" id="vocab_sound_icon" class="inline rightelement"><div>' +
					vocab.meaning + '</div>';
					return;
				}
			});
			//console.log($('#context_box')[0]);
			$('#context_box')[0].innerHTML = `<div class="inline largefont bold">Context 1 - First meeting</div><button class="inline rightelement">Jump to Context</button>
				<br>
				<br>
				<div>어머니께서는 저를 사랑하십니다.</div>`;
		}).then(function (snapshot) {
			var vocab_sound_icon = document.getElementById('vocab_sound_icon');

      if (vocab_sound_icon)
  			vocab_sound_icon.onclick = function () {
  				alert("This is not implemented in this prototype!");
  			};
		});
});