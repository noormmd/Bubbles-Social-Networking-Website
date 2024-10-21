// Obtains modal
var modal = document.getElementById("newPost-Modal");
// Get the button that opens the modal
var btn = document.getElementById("newPost");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}


// Event listener for closing the modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});