// Monkey-patching element removal
Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

class SelectionBox {
  constructor(selection, id) {
    this.selection = selection;
    var domElem = document.getElementById(id);
    if(domElem !== null) domElem.remove();
    domElem = document.createElement('div');
    domElem.setAttribute('id', id);
    this.domElem = domElem;
  }

  setPosition() {
    var parentNode = this.selection.baseNode.parentNode
    var selectionRect = this.selection.getRangeAt(0).getBoundingClientRect();

    var parentRect = parentNode.getBoundingClientRect();
    var parentOffset = this.getOffset(parentNode);

    var leftMargin = selectionRect.right - parentRect.left + 5;
    var topMargin = selectionRect.top - parentRect.top + 2;

    this.domElem.style.position = "absolute";
    this.domElem.style.top = (parentOffset[0] + topMargin) + 'px';
    this.domElem.style.left = (parentOffset[1] + leftMargin) + 'px';
  }

  // Gets offset of the given element. Credits:
  // http://stackoverflow.com/a/3471664/3138171
  getOffset(el){
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
}

class Redbox extends SelectionBox {
  constructor(selection) {
    super(selection, 'redbox');
    this.domElem.style.width = '20px';
    this.domElem.style.height = '20px';
    this.domElem.style.backgroundColor = '#CEDCEB';
    this.domElem.style.borderRadius = '10px';
    this.domElem.style.textAlign = 'center';
    this.domElem.style.marginTop = '-3px';
    this.domElem.style.cursor = "pointer";

    this.infoText = document.createTextNode('?');
    this.domElem.appendChild(this.infoText);
    this.setPosition();
  }

  setLoading() {
    this.domElem.innerHTML = '...';
  }
}

class HoogleBox extends SelectionBox {
  constructor(selection) {
    super(selection, 'hoogleBox');
    this._setStyle();
    this.setPosition();
    this._addCloseButton();
  }

  _setStyle() {
    this.domElem.style.border = "1px solid black";
    this.domElem.style.backgroundColor = "#CEEBCF";
    this.domElem.style.maxWidth = "500px";
    this.domElem.style.maxHeight = "200px";
    this.domElem.style.overflow = "scroll";
  }

  _addCloseButton() {
    var button = document.createElement('button');
    button.innerHTML = 'X';
    button.style.border = "none";
    button.style.borderRadius = "10px";
    button.style.width = "20px";
    button.style.height = "20px";
    button.style.padding = "0px";
    button.style.backgroundColor = "#EB4646";
    button.style.color = "white";
    button.style.fontSize = "10px";
    button.style.cursor = "pointer";
    button.style.margin = "5px";

    var self = this;
    button.addEventListener('click', function(e) {
      self.domElem.remove();
    });
    this.domElem.appendChild(button);
  }

  injectContent(hoogleData) {
    var content = this._prepareContent(hoogleData);
    this._setContent(content);
  }

   _setContent(content) {
    if(this.domElem.children.length > 1) {
      this.domElem.removeChild(this.domElem.children[1]);
    }
    this.domElem.appendChild(content);
  }

  // Parses given hoogle data accordingly
   _prepareContent(hoogleData) {
    var content = document.createElement('ul');
    content.setAttribute('id', 'hoogleData');
    hoogleData.results.forEach(function(result) {
      var item = document.createElement('li');
      item.style.borderTop = "1px solid gray";
      var signature = document.createElement('a');
      signature.style.backgroundColor = "#F0F0F0";
      signature.style.padding = "5px";
      signature.style.display = "block";
      signature.innerHTML = result.self;
      signature.setAttribute('href', result.location);
      var docs = document.createElement('p');
      docs.style.padding = "5px";
      docs.innerHTML = result.docs;
      item.appendChild(signature);
      item.appendChild(docs);
      content.appendChild(item);
    });
    return content;
  }
}

window.addEventListener("mouseup", function(e) {
  var selection = document.getSelection();
  var selectedText = selection.toString();
  if(selectedText === '') return;

  var redbox = new Redbox(selection);
  var hoogleBox = new HoogleBox(selection);

  document.body.appendChild(redbox.domElem);
  redbox.domElem.addEventListener('click', function(e) {
    redbox.setLoading();
    getHoogleData(selectedText, function(hoogleData) {
      hoogleBox.injectContent(hoogleData);
      document.body.appendChild(hoogleBox.domElem);
      redbox.domElem.remove();
    });
  });
});

// Fetches data for the given query from hoogle
function getHoogleData(text, callback) {
  $.get('https://www.haskell.org/hoogle/?mode=json&hoogle=' + text + '&start=1&count=10', function(data) {
    callback(data);
  });
}
