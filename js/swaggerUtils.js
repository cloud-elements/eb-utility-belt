window.onload = function() {
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
}


function copyOutput() {
    var element = document.getElementById('outputMsg-swagger')
    var range = document.createRange();
    range.selectNode(element);
    window.getSelection().addRange(range);
    document.execCommand("copy");
}
