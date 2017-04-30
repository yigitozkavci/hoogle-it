class Redbox {
  constructor(selection) {
    var domElem = document.getElementById('redbox');
    if(domElem == null) {
      domElem = document.createElement('div');
      domElem.setAttribute('id', 'redbox');
      domElem.style.width = 10 + 'px';
      domElem.style.height = 10 + 'px';
      domElem.style.backgroundColor = 'red';
    }
    setPosition(selection, domElem);
    this.domElem = domElem;
  }
}

class HoogleBox {
  constructor(selection) {
    var domElem = document.getElementById('hoogleBox')
    if(domElem === null) {
      domElem = document.createElement('div');
      domElem.setAttribute('id', 'hoogleBox');
    }
    this.domElem = domElem;
    this.setStyle();
    setPosition(selection, domElem);
  }

  setStyle() {
    this.domElem.style.border = "1px solid black";
    this.domElem.style.backgroundColor = "gray";
    this.domElem.style.padding = "5px";
  }

  setContent(content) {
    if(this.domElem.firstChild !== null) {
      this.domElem.removeChild(this.domElem.firstChild);
    }
    this.domElem.appendChild(content);
  }
}

window.addEventListener("mouseup", function(e) {
  var selection = document.getSelection();
  if(selection.toString() === '') return;
  getHoogleData(selection.toString(), function(hoogleData) {

    var redbox = new Redbox(selection);

    // Create/fetch hoogle box element
    content = prepareContent(hoogleData);

    var hoogleBox = new HoogleBox(selection);
    hoogleBox.setContent(content);
    // Create / update hoogle box

    // Append the redbox
    document.body.appendChild(redbox.domElem);
    redbox.domElem.addEventListener('click', function(e) {
      document.body.appendChild(hoogleBox.domElem);
    });
  });
});

// Prepares styles for the hoogle box
function prepareHoogleBoxStyle(element) {
  element.style.border = "1px solid black";
  element.style.backgroundColor = "gray";
  element.style.padding = "5px";
}

// Sets the position of hoogle box
function setPosition(selection, element) {
  selectionRect = selection.getRangeAt(0).getBoundingClientRect();
  parentRect = selection.baseNode.parentNode.getBoundingClientRect();
  var leftMargin = selectionRect.right - parentRect.left + 5;
  var topMargin = selectionRect.top - parentRect.top + 2;
  console.log(leftMargin);

  var sel = selection.baseNode.parentNode;
  element.style.position = "absolute";
  offset = getOffset(sel);
  console.log(offset);
  element.style.top = (offset[0] + topMargin) + 'px';
  element.style.left = (offset[1] + leftMargin) + 'px';
}

// Parses given hoogle data accordingly
function prepareContent(hoogleData) {
  content = document.createElement('div');
  hoogleData.results.forEach(function(result) {
    paragraph = document.createElement('p');
    paragraph.innerHTML = result.self;
    content.appendChild(paragraph);
  });
  return content;
}

// Fetches data for the given query from hoogle
function getHoogleData(text, callback) {
  $.get('https://www.haskell.org/hoogle/?mode=json&hoogle=' + text + '&start=1&count=10', function(data) {
    callback(data);
  });
}

// Gets offset of the given element. Credits:
// http://stackoverflow.com/a/3471664/3138171
function getOffset(el){
    var el2 = el;
    var curtop = 0;
    var curleft = 0;
    if (document.getElementById || document.all) {
        do  {
            curleft += el.offsetLeft-el.scrollLeft;
            curtop += el.offsetTop-el.scrollTop;
            el = el.offsetParent;
            el2 = el2.parentNode;
            while (el2 != el) {
                curleft -= el2.scrollLeft;
                curtop -= el2.scrollTop;
                el2 = el2.parentNode;
            }
        } while (el.offsetParent);

    } else if (document.layers) {
        curtop += el.y;
        curleft += el.x;
    }
    return [curtop, curleft];
};
