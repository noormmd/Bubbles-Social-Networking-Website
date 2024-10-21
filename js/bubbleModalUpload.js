// Get the button that opens the modal
var bubble = document.getElementById("bubblePopUp");
// Obtains modal
var bubbleModal = document.getElementById("bubbleModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close1")[0];

// When the user clicks the button, open the modal 
bubble.onclick = function() {
  bubbleModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  bubbleModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == bubbleModal) {
    bubbleModal.style.display = "none";
  }
}
