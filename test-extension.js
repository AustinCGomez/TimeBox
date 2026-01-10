// test-extension.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const extensionPath = __dirname;

async function testExtension() {
  console.log('Starting extension tests...');
  
  const manifestPath = path.join(extensionPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('✗ manifest.json not found');
    return;
  }
  
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ]
    });

    const page = await browser.newPage();
    await page.goto('chrome://extensions/');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const extensionId = await page.evaluate(() => {
      const extensions = document.querySelector('extensions-manager')
        ?.shadowRoot.querySelector('extensions-item-list')
        ?.shadowRoot.querySelectorAll('extensions-item');
      
      for (let ext of extensions || []) {
        const name = ext.shadowRoot.querySelector('#name')?.textContent;
        if (name && name.includes('Timebox')) {
          return ext.id;
        }
      }
      return null;
    });

    if (!extensionId) {
      console.error('✗ Extension not found');
      return;
    }

    const popupUrl = `chrome-extension://${extensionId}/frontend.html`;
    await page.goto(popupUrl);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // === YOUR TESTS START HERE ===
    
    console.log('\n--- Testing Navigation Buttons ---');
    
    // Test Log Hours button
    await page.waitForSelector('#btn-open-logger', { visible: true });
    await page.click('#btn-open-logger');
    await new Promise(resolve => setTimeout(resolve, 500));
    const loggerVisible = await page.evaluate(() => {
      return !document.getElementById('view-logger').classList.contains('hidden');
    });
    console.log(loggerVisible ? '✓ Log Hours button works' : '✗ Log Hours button failed');
    
   
    // Fill in the form
    await page.type('#StartTime', '13:00');
    await page.type('#EndTime', '17:00');
    await page.type('#Date', '2026-01-15');
    await page.type('#TasksCompleted', 'Built automated tests for TimeBox extension');
    
    console.log('✓ Form filled successfully');
    
    // Save the entry
    await page.click('#btn-save-data');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if data was saved (alert appears)
    console.log('✓ Save button clicked');
    
    // Verify data is in storage
    const savedData = await page.evaluate(async () => {
      return new Promise((resolve) => {
        chrome.storage.local.get('tasks', (result) => {
          resolve(result.tasks || []);
        });
      });
    });
    
    if (savedData.length > 0) {
      console.log('✓ Data saved to storage:', savedData[savedData.length - 1]);
    } else {
      console.log('✗ No data found in storage');
    }



    console.log(settingsVisible ? '✓ Settings button works' : '✗ Settings button failed');

    console.log('\n===================');
    console.log('Tests completed!');
    console.log('===================');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
  }
}

testExtension();