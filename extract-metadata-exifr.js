const exifr = require('exifr');
const fs = require('fs');
const path = require('path');

async function extractMetadataFromDirectory(directoryPath) {
  const startTime = Date.now(); // Record start time
  console.log('Starting metadata extraction...');

  const metadataList = [];

  try {
    const files = fs.readdirSync(directoryPath);
    console.log(`Found ${files.length} files in directory: ${directoryPath}`);

    for (const file of files) {
      if (file === 'metadata.json') continue;

      const filePath = path.join(directoryPath, file);
      if (isImage(filePath)) {
        try {
          const metadata = await exifr.parse(filePath);
          if (metadata) {
            metadataList.push({ file, metadata });
            console.log(`Metadata for ${file}:`, JSON.stringify(metadata, null, 2));
          } else {
            console.warn(`No metadata found for ${file}`);
          }
        } catch (error) {
          console.error(`Error extracting metadata from ${file}:`, error.message);
        }
      } else {
        console.warn(`${file} is not a supported image format`);
      }
    }

    const outputFilePath = path.join(directoryPath, 'metadata.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(metadataList, null, 2));
    console.log(`Metadata saved to ${outputFilePath}`);
    const endTime = Date.now(); // Record end time
    const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
    console.log(`Metadata extraction completed in ${elapsedTime.toFixed(2)} seconds`);
  } catch (error) {
    console.error('Error reading directory:', error.message);
    const endTime = Date.now(); // Record end time on error
    const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds
    console.log(`Metadata extraction failed after ${elapsedTime.toFixed(2)} seconds`);
  }
}

function isImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.tiff'].includes(ext);
}

const directoryPath = 'C:/Users/SAI HARITHA/AppData/Local/Temp/haritha';
extractMetadataFromDirectory(directoryPath);
