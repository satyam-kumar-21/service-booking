const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Mock env vars for Partner.js
process.env.JWT_SECRET = 'test';

const modelsDir = path.join(__dirname, 'models');

fs.readdir(modelsDir, (err, files) => {
      if (err) {
            console.error('Could not list the directory.', err);
            process.exit(1);
      }

      let hasError = false;
      files.forEach((file, index) => {
            if (file.endsWith('.js')) {
                  try {
                        const modelPath = path.join(modelsDir, file);
                        console.log(`Testing require('${file}')...`);
                        require(modelPath);
                        console.log(`✅ ${file} loaded successfully.`);
                  } catch (e) {
                        console.error(`❌ Error loading ${file}:`, e.message);
                        hasError = true;
                  }
            }
      });

      if (hasError) {
            console.log('Finished with errors.');
            process.exit(1);
      } else {
            console.log('All models loaded successfully!');
            process.exit(0);
      }
});
