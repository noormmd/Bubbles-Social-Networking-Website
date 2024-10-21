// Import necessary modules
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import fs from 'fs';

// Load the HTML file containing the functionality
const html = fs.readFileSync('../public/main.html', 'utf8');

// Describe the test suite
describe('Show Section Functionality', () => {
  let window;

  // Before each test case, create a new virtual DOM
  beforeEach(() => {
    return JSDOM.fromFile('../public/main.html', { runScripts: 'dangerously' })
      .then((dom) => {
        window = dom.window;
        return window.eval(fs.readFileSync('../js/showSection.js', 'utf8'));
      });
  });

  // Test case for hiding the mainPage section
  it('should hide the mainPage section', () => {
    const mainPageSection = window.document.getElementById('mainPage');
    // Call the hideMainPage function
    window.hideMainPage();
    // Check if the mainPage section is hidden
    expect(mainPageSection.style.display).to.equal('none');
  });

  // Test case for showing a specific section and hiding the mainPage section
  it('should show the targeted section and hide the mainPage section', () => {
    const sectionId = '#timeline'; // Example section ID
    const mainPageSection = window.document.getElementById('mainPage');
    // Call the showSection function
    window.showSection(sectionId);
    // Check if the mainPage section is hidden
    expect(mainPageSection.style.display).to.equal('none');
    // Check if the hash in the URL is updated to show the targeted section
    expect(window.location.hash).to.equal(sectionId);
  });
});
