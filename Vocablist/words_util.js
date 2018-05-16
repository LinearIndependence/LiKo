// (By H)
// words_util.js가 다른 파일에 의존하지 않고 독립적으로 작동하도록 수정했습니다.
// HTML에 아래의 두 줄
// <script src="https://www.gstatic.com/firebasejs/5.0.2/firebase.js"></script>
// <script type="text/javascript" src="../Vocablist/words_util.js"></script>
// 만 추가하면 WordsUtil.(함수 이름) 형태로 바로 사용이 가능합니다.


var WordsUtil = (function () {
    'use strict';

    // 네임스페이스.
    var wu = {};

    // -------------------- Private. --------------------

    var db = firebase.initializeApp(
        // Config.
        {
            apiKey: "AIzaSyCzCLfk8yqwdxamEEFx3PRrRyhOcTL1IUk",
            authDomain: "liko-665bd.firebaseapp.com",
            databaseURL: "https://liko-665bd.firebaseio.com",
            projectId: "liko-665bd",
            storageBucket: "liko-665bd.appspot.com",
            messagingSenderId: "133340779007"
        },
        // 중복 오류 방지용 이름.
        'WordsUtil'
    ).database();

    var contextsRef = db.ref('contexts');
    var vocabsRef = db.ref('vocabs');

    // -------------------- Public. --------------------

    wu.vocabFromID = function (id, callback) {
        vocabsRef.orderByChild('id').equalTo(id).once('value').then(function (snapshot) {
            //console.log(snapshot.val());
            callback(Object.values(snapshot.val())[0]);
        });

        // Example
        // vocabFromID(31, vocab => alert(vocab.korean)); // '사랑하다'가 출력됨
    };

    // vocabFromID()의 id 여러 개 버전.
    wu.vocabsFromIDs = function (ids, callback) {
        vocabsRef.orderByChild('id').once('value').then(function (snapshot) {
            var vocabMap = {};

            snapshot.forEach(function (ref) {
                var vocab = ref.val();

                if (ids.indexOf(vocab.id) !== -1) {
                    vocabMap[vocab.id] = vocab;
                }
            });

            callback(vocabMap);
        });

        // Example
        // vocabsFromIDs([3, 31], function(vocabMap) {
        //     alert(vocabMap[3].korean);
        //     alert(vocabMap[31].korean);
        // });
    };

    wu.isVocabInList = function (context_chapter, vocab_id, callback) {
        contextsRef.orderByChild('chapter').equalTo(context_chapter).once('value').then(function (snapshot) {
        	var inList = false;
        	var vocabs = Object.values(snapshot.val())[0].vocabs;
            if (snapshot.val() && vocabs) {
                for (var key in vocabs) {
                    console.log(vocabs[key].id);
            		if (vocabs[key] && vocabs[key].id == vocab_id) {
            			inList = true;
            			break;
            		}
            	} 
            }
            callback(inList);
        });

        // Example
        // isVocabInList(1, 31, includes => alert(includes)); // True 또는 False가 출력됨
    };

    wu.doesIDExist = function(vocab_id, callback) {
    	vocabsRef.orderByChild('id').equalTo(vocab_id).once('value').then(function (snapshot) {
    		callback(Boolean(snapshot.val()));
    	});

    	// Example
    	//doesIDExist(31, exists => alert(exists)); // 별 일 없으면 True
    };

    wu.addVocabData = function(korean, meaning, shortmeaning, id_callback = Function.prototype) {
    	var i = 0;
    	var push = function (exists) {
    		if (exists) {
    			i++;
    			wu.doesIDExist(i, push);
    		}
    		else {
		    	vocabsRef.push({
		    		id: i,
		    		korean: korean,
		    		meaning: meaning, 
		    		shortmeaning: shortmeaning,
		    	}, error => id_callback(i));
		    }
    	};
    	wu.doesIDExist(i, push);

    	// Example
    	// wu.addVocabData("나", "self", "I", alert); // 새 단어가 추가되고 그 단어의 id가 alert로 출력됨
    };

    wu.addVocabToContext = function (context_chapter, vocab_id, sentence = "이 문장은 테스트 문장입니다.") {
    	contextsRef.orderByChild('chapter').equalTo(context_chapter).once('value').then (function (snapshot) {
    		wu.isVocabInList(context_chapter, vocab_id, function (isInList) {
    			console.log(Object.keys(snapshot.val())[0]);
    			if (!isInList)
    				db.ref('contexts/' + Object.keys(snapshot.val())[0] + '/vocabs/').push({id: vocab_id, sentence: sentence});
    		});    		
    	});

    	// Example
    	// wu.addVocabToContext(1, 0, "나는 나쁜 교수입니다."); // 챕터 1에 "교수" 단어가 추가되고 문장으로 저게 추가됨.
    	// 이미 같은 단어가 같은 컨텍스트에 있으면 스킵됨.
	};

    return wu;
}());

// 기존의 Vocablist 코드들 작동을 위해... 전역 변수로도 풀어놓습니다.
var vocabFromID = WordsUtil.vocabFromID;
var vocabsFromIDs = WordsUtil.vocabsFromIDs;
var isVocabInList = WordsUtil.isVocabInList;

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
