// Search bar that allows you to search and filter options and display a list of items
function searchBarFunctionality() {
  const searchBar = document.getElementById("searchBar");
  const filter = searchBar.value.trim().toUpperCase(); // Filter functionality
  const searchList = document.getElementById("searchItems"); // Items to be displayed
  const searchItems = searchList.getElementsByTagName("li");

  // Functionality for filtering results and displaying
  for (let i = 0; i < searchItems.length; i++) {
    const anchor = searchItems[i].querySelector("a");
    const itemText = anchor.textContent.trim().toUpperCase();
    searchItems[i].style.display = itemText.includes(filter) ? "" : "none";
  }
}
