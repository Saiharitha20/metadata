const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const rawDir = 'D:/Downloads/thousand';
const jpgDir = 'C:/Users/SAI HARITHA/AppData/Local/Temp/haritha';

function copyMetadata(rawDir, jpgDir) {
  const startTime = Date.now(); // Record start time
  console.log('Starting metadata copy...');

  try {
    const rawFiles = fs.readdirSync(rawDir);
    const jpgFiles = fs.readdirSync(jpgDir);

    let processedFiles = 0;
    rawFiles.forEach((rawFile, index) => {
      const rawBase = path.basename(rawFile, path.extname(rawFile));
      const matchingJpg = jpgFiles.find(jpgFile => path.basename(jpgFile, '.jpg') === rawBase);

      if (matchingJpg) {
        const rawFilePath = path.join(rawDir, rawFile);
        const jpgFilePath = path.join(jpgDir, matchingJpg);

        exec(`exiftool -tagsFromFile "${rawFilePath}" -all:all "${jpgFilePath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error copying metadata from ${rawFilePath} to ${jpgFilePath}:`, stderr);
          } else {
            console.log(`Copied metadata from ${rawFilePath} to ${jpgFilePath}:`, stdout);
          }
          processedFiles++;
          if (processedFiles === rawFiles.length) {
            const endTime = Date.now(); // Record end time
            const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
            console.log(`Metadata copy completed in ${elapsedTime.toFixed(2)} seconds`);
          }
        });
      } else {
        console.warn(`No matching JPG found for RAW file ${rawFile}`);
        processedFiles++;
        if (processedFiles === rawFiles.length) {
          const endTime = Date.now(); // Record end time
          const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
          console.log(`Metadata copy completed in ${elapsedTime.toFixed(2)} seconds`);
        }
      }
    });
  } catch (error) {
    console.error('Error processing directories:', error.message);
    const endTime = Date.now(); // Record end time on error
    const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
    console.log(`Metadata copy failed after ${elapsedTime.toFixed(2)} seconds`);
  }
}

copyMetadata(rawDir, jpgDir);
