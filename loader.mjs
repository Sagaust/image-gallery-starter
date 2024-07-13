import { fetchAndSaveImages } from './scripts/testFetchImages.ts';

console.log('Starting the fetch and save images process...');

fetchAndSaveImages()
  .then(() => {
    console.log('Images fetched and saved successfully.');
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });
