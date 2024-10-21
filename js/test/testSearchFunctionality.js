// Import necessary modules
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import fs from 'fs';

// Load the HTML file containing the functionality
const html = fs.readFileSync('../public/main.html', 'utf8');

// Describe the test suite
describe('Search Bar Functionality', () => {
  let window;

  // Before each test case, create a new virtual DOM
  beforeEach(() => {
    return JSDOM.fromFile('../public/main.html', { runScripts: 'dangerously' })
      .then((dom) => {
        window = dom.window;
        return window.eval(fs.readFileSync('../js/searchMenu.js', 'utf8'));
      });
  });

  // Test case for searchBarFunctionality when search input is not empty
  it('should filter search items based on input', () => {
    // Setup input and items
    const searchBar = window.document.getElementById('searchBar');
    const searchItems = window.document.getElementById('searchItems');
    const items = searchItems.getElementsByTagName('li');

    // Set search input value
    searchBar.value = 'test';

    // Call searchBarFunctionality
    window.searchBarFunctionality();

    // Check if items are filtered correctly
    Array.from(items).forEach((item) => {
      const a = item.querySelector('a');
      if (a.innerHTML.toUpperCase().includes('test')) {
        expect(item.style.display).to.equal('');
      } else {
        expect(item.style.display).to.equal('none');
      }
    });
  });

  // Test case for searchBarFunctionality when search input is empty
  it('should display all items when search input is empty', () => {
    // Setup input and items
    const searchBar = window.document.getElementById('searchBar');
    const searchItems = window.document.getElementById('searchItems');
    const items = searchItems.getElementsByTagName('li');

    // Set search input value to empty
    searchBar.value = '';

    // Call searchBarFunctionality
    window.searchBarFunctionality();

    // Check if all items are displayed
    Array.from(items).forEach((item) => {
      expect(item.style.display).to.equal('');
    });
  });
});
