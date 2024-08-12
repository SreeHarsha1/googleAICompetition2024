const path = require("path");
const {
  GoogleGenerativeAI,
  GenerationConfig,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const schema = require('./responseSchema')

require("dotenv").config({
  path: path.resolve(__dirname, "./config.env"),
});

const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);



const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 10,
    topP: 0.9,
    maxOutputTokens: 2000,
    response_mime_type: "application/json",
    //responseSchema: schema,
  },
});


async function countTokens(text) {
  try {
    const tokenInfo = await geminiModel.countTokens(text);
    return tokenInfo.totalTokens;
  } catch (e) {
    console.log(`Token counting error: ${e}`);
    return null;
  }
}

function checkSafetyRatings(result) {
  const safetyRatings = result.response.candidates[0].safetyRatings;
  for (const rating of safetyRatings) {
    if (rating.probability !== "NEGLIGIBLE" && rating.probability !== "LOW") {
      throw new Error(
        `Did not pass safety ratings: ${rating.category} is ${rating.probability}`
      );
    }
  }
  console.log("All safety ratings are negligible or low.");
}

async function generateContentWithSafetyCheck(
  parts,
  maxRetries = 2,
  retryDelay = 10000
) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const result = await geminiModel.generateContent(parts);

      checkSafetyRatings(result);

      return result.response.text();
    } catch (e) {
      if (
        e.message.includes("500 An internal error has occurred") ||
        e.message.includes("Did not pass safety ratings")
      ) {
        console.log(`Internal server error occurred: ${e}`);
        retries++;
        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      } else {
        console.log(`An error occurred: ${e}`);
        return null;
      }
    }
  }

  console.log(`Failed after ${maxRetries} retries.`);
  return null;
}

async function sendRequestToGeminiAI(parts) {
  try {
    const response = await generateContentWithSafetyCheck(parts);
    if (response) {
      const tokensUsed = await countTokens(response);
      console.log(`Tokens used: ${tokensUsed}`);
      return response;
    } else {
      throw new Error("Internal error 1");
    }
  } catch (e) {
    console.log(e);
    return "Internal error 2";
  }
}

async function uploadToGemini(path, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (e) {
    console.log("Error in uploading file to gemini ", e);
    return null;
  }
}

module.exports = { sendRequestToGeminiAI, uploadToGemini };

