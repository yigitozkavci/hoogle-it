window.addEventListener("mouseup", function(e) {
  var text = document.getSelection();
  if(text.toString() === '') return;
  getHoogleData(text.toString(), function(hoogleData) {

    var redbox = document.getElementById('redbox');
    if(redbox == null) {
      redbox = document.createElement('div');
      redbox.setAttribute('id', 'redbox');
      redbox.style.width = 10 + 'px';
      redbox.style.height = 10 + 'px';
      redbox.style.backgroundColor = 'red';
    }
    setPosition(text, redbox);


    // Create/fetch hoogle box element
    var element = document.getElementById('hoogleBox')
    if(element === null) {
      element = document.createElement('div');
      element.setAttribute('id', 'hoogleBox');
      prepareHoogleBoxStyle(element);
    }
    content = prepareContent(hoogleData);

    // position element
    setPosition(text, element);

    // Create / update hoogle box
    if(element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
    element.appendChild(content);

    // Append the redbox
    // document.body.appendChild(redbox);
    document.body.appendChild(element);
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
