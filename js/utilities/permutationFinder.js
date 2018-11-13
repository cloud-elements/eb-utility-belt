function setValue(body) {
  var outputMsg = document.getElementById('outputMsg-permutation');
  if (body && body.length > 0) {
    let strOut = body.filter(arr => arr.length > 0).map(s => `${s.split('').join(',')}`).join('\n');
    outputMsg.value = strOut;
  } else {
    outputMsg.value = `Failed to generate permutations`;
  }
}

function* permute(a, n = a.length) {
  if (n <= 1) yield a.slice();
  else
    for (let i = 0; i < n; i++) {
      yield* permute(a, n - 1);
      const j = n % 2 ? 0 : i;
      [a[n - 1], a[j]] = [a[j], a[n - 1]];
    }
}

const getPermutations = () => {
  let inputMsg = document.getElementById('inputMsg-permutation').value;

  chrome.storage.sync.set({
    "inputMsg-permutation": inputMsg
  });

  setValue(Array.from(permute(inputMsg.split(''))).map(perm => perm.join('')));
};

window.onload = function () {
  chrome.storage.sync.get("inputMsg-permutation", function (items) {
    if (!chrome.runtime.error) {
      console.log('items', items);
      if (items['inputMsg-permutation'])
        document.getElementById("inputMsg-permutation").value = items['inputMsg-permutation'];
    }
  });
}

function copyOutput() {
  var element = document.getElementById('outputMsg-permutation')
  element.select();
  document.execCommand("copy");
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("copyoutput").addEventListener("click", copyOutput);
  document.getElementById('findPermutations').addEventListener('click', getPermutations);
}, false);