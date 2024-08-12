const { sendRequestToGeminiAI, uploadToGemini } = require("./googleAPIUtils");
const { GenerationConfig } = require("@google/generative-ai");
const fs = require("fs");
async function generatePrompt(userData, file, userText = null) {
  try {
     let totalText;
     let files;
     let imageortext;
    imageortext = "text";
    if (file != null) {
      files = [file];
      imageortext = "image";
    }else{
      totalText = `User said this text = ${userText}`
    }

   
    if (userData.name !== "") {
      totalText += `These are the user details we are giving information to. ${JSON.stringify(
        userData
      )}.
        customize all content to this users health details`;
    } else {
      totalText += `User is a generic user`;
    }

    const generalText = `
Determine if the ${imageortext} contains evidence of a food or drink item. Evidence can include:
* Explicit depictions of food or drink.
* Textual descriptions or labels or clothing indicating food or drink.
* Visual representations or symbols commonly associated with food or drink.

Reply in JSON ONLY NO SPECIAL CHARACTERS and do extensive research for all as this is regarding health. consider about cravings too.

If the ${imageortext} contains evidence of food or drink, return "valid-${imageortext}": true.
Otherwise, return "valid-${imageortext}": false and provide a specific "descriptive-reason" explaining why the ${imageortext} was deemed invalid. The reason should be clear and helpful to the user.

if ${imageortext} is valid you have 3 tasks

task 1:
analysis-item-identification object 
a) give items object(array of objects) and inside each object give "item-name", "percentage-of-confidence" for recognizing that item and calories-present-in-item/s = INT value of number of calories
b) reasons object (Array)
c)\"banned-in-countries\", (Array of objects, each object contains name and reason-to-be-banned. keep it empty if none)
d) "date-of-research-information",
e) recommendation(string), Whether the item is recommended
f) side-effects(String), Potential side effects of excessive consumption
g) warnings(String), Specific warnings for users related to the condition
h) advice(String), General nutritional advice related to the condition

task 2: 
nutrition-minerals-and-vitamins-good-and-bad object
research hard and create a array of object "list-of-minerals-and-vitamins" in that each object, include cooling oil etc those kind of items too and give 
"mineral/vitamin-name", 
"percentage-of-this-mineral/vitamin-in-item" // INT value from 1 - 100 no tailing %!.
"personalized-hexadecimal-color-code" // if the above "percentage-of-this-mineral/vitamin-in-item" of this item is good for health then retrun a  representing how good else shade of red
"reason-to-give-that-color":
"pros-of-this-vitamin/mineral":
"cons-of-this-vitamin/mineral":
"personalized-user-comments-on-this-viramin/mineral


task 3:
global-variations-healthier_versions object
we are in india, due to some Regulatory differences,Consumer preferences,Cost considerations and Market positioning etc, 
companies or manufacturers use different ingrediants. Research and create this array of object "global-variations-healthier-versions"
and give the list of countries where more healthier version is present and also include in what ingrediant/s is better.
each object should contain "country" specifiying name of the country  and "differences" mentioning item difference in that country
if its same everywhere then give me empty array

Here is the Example of a mcdonald ${imageortext} and response i want something like this example 

{
  "valid-${imageortext}": true,
  "analysis-item-identification": {
      "items": [{"item-name": "French Fries", "percentage-of-confidence": 92%}],
      "reasons": ["McDonald's logo, shape, color"]
      "banned-in-countries": [] //fill this array if anything is there 
      "date-of-research-information": "23-09-2023"
      "recommendation": "not recommended",
      "side-effects": "weight gain, digestive issues, exacerbation of B12 deficiency",//example specific to user 
      "warnings": "focus on B12 rich foods, consult a doctor or nutritionist", //example specific to user
      "advice": "prioritize foods aiding B12 absorption and overall health"//example specific to user
    },
    "nutrition-minerals-and-vitamins-good-and-bad": [
        {"name": "palm oil", "percentage-of-this-mineral/vitamin-in-item": "55%", 
        hexadecimal-color-code: #000000..., "reason-to-give-that-color":"its not good to have this much palm oil usage so i gave shade of red"}, //example
        {"name": "Vitamin C", "percentage-of-this-mineral/vitamin-in-item": "20%"
         hexadecimal-color-code: #05A5AA..., "reason-to-give-that-color":"its good to have this much so i gave shade of green"} //example
        {"name": "Potassium", "percentage-of-this-mineral/vitamin-in-item": "20%" 
        hexadecimal-color-code: #0FGII0...,"reason-to-give-that-color":"its rich but for this user its not good to i gave shade of red"} //example
      ]
    },
    "global-variations-healthier_versions": [
        {"country": "France", "differences": "Baked instead of fried, lower fat content"},
        {"country": "United States", "differences": "Larger portion sizes, higher calorie count"}
      ]
    }
  }
}

`;

    totalText += generalText;
    console.log(totalText);
    let parts = "";
    if (file != null) {
      parts = [
        {
          text: totalText,
        },
        { text: "Image: " },
        {
          fileData: {
            mimeType: files[0]?.mimeType,
            fileUri: files[0]?.uri,
          },
        },
      ];
    } else {
      parts = [
        {
          text: totalText,
        },
      ];
    }
    const result = await sendRequestToGeminiAI({
      contents: [{ role: "user", parts }],
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}




module.exports = { generatePrompt };