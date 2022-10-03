import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import "./index.css";

/**
 * Available layouts
 * https://github.com/hodgef/simple-keyboard-layouts/tree/master/src/lib/layouts
 */
// import layout from "simple-keyboard-layouts/build/layouts/chinese";

let keyboard = new Keyboard({
  onKeyPress: (button) => onKeyPress(button),
  newLineOnEnter: true,
});

keyboard.setOptions({
  layout: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - =",
      "q w e r t y u i o p {bksp}",
      "{lock} a s d f g h j k l : ' {enter}",
      "{lang} z x c v b n m , . / @",
      "{space}"
    ],
    caps: [
      "` 1 2 3 4 5 6 7 8 9 0 - =",
      "Q W E R T Y U I O P {bksp}",
      "{lock} A S D F G H J K L : ' {enter}",
      "{lang} Z X C V B N M < > ? @",
      "{space}"
    ],
    chinese: [
      "ㄅ ㄉ ˇ ˋ ㄓ ˊ ˙ ㄚ ㄞ ㄢ ㄦ {bksp}",
      "ㄆ ㄊ ㄍ ㄐ ㄔ ㄗ ㄧ ㄛ ㄟ ㄣ",
      "ㄇ ㄋ ㄎ ㄑ ㄕ ㄘ ㄨ ㄜ ㄠ ㄤ {enter}",
      "{lang} ㄈ ㄌ ㄏ ㄒ ㄖ ㄙ ㄩ ㄝ ㄡ ㄥ {>} {<}",
      "{space}"
    ]
  },
  display: {
    "{lang}": "中/英",
    "{lock}": "大小寫",
    "{bksp}": "Backspace",
    "{enter}": "Enter",
    "{space}": "Space",
    "{>}": "上一頁", 
    "{<}": "下一頁",
  },
  preventMouseDownDefault: true
});

JSZhuyinServerIframeLoader.prototype.IFRAME_URL =
  "https://timdream.org/jszhuyin/lib/frame.html";

var webIME = new JSZhuyinWebIME({
  composition: document.getElementById("composition"),
  candidatesList: document.getElementById("candidates"),
});

console.log(keyboard);

//按鍵觸發處理
function onKeyPress(button) {
  console.log("Button pressed", button);

  if (
    !["{bksp}", "{lang}", "{enter}", "{lock}", "{space}", "{>}", "{<}"].includes(
      button
    )
  ) {
    //文字處理
    onChange(button);
  } 
  else {
    console.log(46)
    handleBtn(button)
  }
}

function onChange(input) {
  var reg = /[\u3105-\u3129\u02CA\u02C7\u02CB\u02D9]/;
  if (reg.test(input)) {
    webIME.handleKey(input);
  } else {
    handleInsertPos(input)
  }

  console.log("Input changed", input);
}



function handleBtn(button) {
  switch (button) {
    case '{bksp}':
      if (webIME.jszhuyin.symbols === "") {
        handleInsertPos("slice")
      } else {
        webIME.handleKey("Backspace");
      }
      break;
    case '{enter}':
      handleInsertPos("\n")
      break;
    case '{space}':
      handleInsertPos(" ")
      break;
    case '{>}':
      webIME.candidatesList.goForwardPage();
      break;
    case '{<}':
      webIME.candidatesList.goBackPage();
      break;
    case '{lang}':
      handleLang();
      break;
    case '{lock}':
      handleCapsLock();
      break;
    default:
      
  }
}

function handleInsertPos(input) {
  var pos = keyboard.getCaretPosition();
  var el = focusInput;
  if (input !== 'slice') {
    el.value = el.value.slice(0, pos) + input + el.value.slice(pos);
    el.setSelectionRange(pos+1, pos+1);
  } else {
    var tmp = el.value.slice(0, pos);
    el.value = tmp.slice(0, -1) + el.value.slice(pos)
    el.setSelectionRange(pos-1, pos-1);
  }
}

function handleLang() {
  let currentLayout = keyboard.options.layoutName;
  let lang = "default";
  
  
  if (currentLayout === "default" || currentLayout === "caps") {
    lang = "chinese";
  }
  setKeyboardOption(lang)
}

function handleCapsLock() {
  let currentLayout = keyboard.options.layoutName;
  let toggle = "default";

  if (currentLayout === "default") {
    toggle = "caps";
  }
  setKeyboardOption(toggle)
}

function setKeyboardOption(layout) {
  keyboard.setOptions({
    layoutName: layout
  });
}



var btn = document.getElementsByClassName("keyboard");
var focusInput;

document.querySelectorAll('.keyboard').forEach(function(item, index){
  if (item.id === '') {
    item.id = 'k' + index;
  }
    
  item.addEventListener('focus', event => {
    document.querySelector(".simple-keyboard").style.display = "block";
    document.querySelector(".simple-keyboard").style.bottom = "15px";
    webIME.elements.input = event.target;
    webIME.handleKey("Escape")
    webIME.candidatesList.setCandidates([])
    console.log(event.target.id)
    console.log(webIME)
    focusInput = event.target
    keyboard.setOptions({
      inputName: event.target.id
    });
  })
  item.addEventListener('blur', event => {
    document.querySelector(".simple-keyboard").style.display = "none";
    document.querySelector(".simple-keyboard").style.bottom = "0px";
  })
})