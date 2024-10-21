// Functionality to show specific sections after hiding the welcome page (mainPage) section

  // To hide the mainPage section that's visible by default
  function hideMainPage() {
    document.getElementById('mainPage').style.display = 'none';
  }

  // To show the targeted section and hide the mainPage section once another section is selected
  function showSection(sectionId) {
    // Calling function that hides the mainPage section
    hideMainPage();
    // Updates the hash in the URL to show the targeted section
    window.location.hash = sectionId.substring(1);
  }