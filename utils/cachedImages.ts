import cloudinary from "./cloudinary";

let cachedResults: any; // Or provide a more specific type if known

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.search // Removed 'v2' here
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by("public_id", "desc")
      .max_results(400)
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
