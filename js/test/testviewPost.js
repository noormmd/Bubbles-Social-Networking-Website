// Import necessary modules
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import fs from 'fs/promises'; // Using fs/promises for async file reading

// Define the paths to the HTML and JS files
const htmlFilePath = '../public/main.html';
const jsFilePath = '../js/bubblePostModal.js';

// Load the HTML file containing the modal functionality
async function loadHTML() {
    try {
        const html = await fs.readFile(htmlFilePath, 'utf8');
        return html;
    } catch (error) {
        console.error('Error reading HTML file:', error);
        throw error; // Rethrow the error for handling in the calling code
    }
}

// Load the JavaScript file
async function loadJS() {
    try {
        const js = await fs.readFile(jsFilePath, 'utf8');
        return js;
    } catch (error) {
        console.error('Error reading JS file:', error);
        throw error; // Rethrow the error for handling in the calling code
    }
}

// Describe the test suite
describe('Modal functionality', () => {
    let window;
    let modal;
    let btn;
    let span;

    // Before each test case, create a new virtual DOM
    beforeEach(async () => {
        const [html, js] = await Promise.all([loadHTML(), loadJS()]);
        const { window: virtualWindow } = new JSDOM(html, { runScripts: 'dangerously' });
        window = virtualWindow;
        modal = window.document.getElementById('newPost-Modal');
        btn = window.document.getElementById('newPost');
        span = window.document.getElementsByClassName('close')[0];
        // Execute the loaded JavaScript
        window.eval(js);
    });

    // After each test case, close the virtual window
    afterEach(() => {
        window.close();
    });

    // Test case for opening the modal
    it('should open the modal when the button is clicked', () => {
        // Simulate a button click event
        btn.click();
        // Check if the modal is displayed
        expect(modal.style.display).to.equal('block');
    });

    // Test case for closing the modal using the close button
    it('should close the modal when the close button is clicked', () => {
        // Simulate a button click event
        span.click();
        // Check if the modal is hidden
        expect(modal.style.display).to.equal('none');
    });

});
