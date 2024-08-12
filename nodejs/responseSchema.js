const schema = {
  description: "Schema for analyzing images OF Food related items, edible items, or food-related elements (including drawings, illustrations, text, or objects with food imagery",
  type: "object",
  properties: {
    obtained_values_as_per_image: {
      type: "object",
      description: "Values obtained directly from the image",
      properties: {
        all_minerals: {
          type: "array",
          description: "List of all minerals found in the image",
          items: {
            type: "object",
            properties: {
              mineral_name: {
                type: "string",
                description: "Name of the mineral",
              },
              value_percentage: {
                type: "string",
                description: "Percentage of the mineral present",
              },
              safety_for_human_consumption: {
                type: "string",
                description: "Safety information for human consumption",
              },
              should_not_be_consumed_if: {
                type: "string",
                description:
                  "Conditions under which the mineral should not be consumed",
              },
              side_effects_if_consumed_more: {
                type: "string",
                description: "Side effects if consumed in excess",
              },
              banned_in_countries: {
                type: "string",
                description: "Countries where the mineral is banned",
              },
              further_comments: {
                type: "string",
                description: "Additional comments about the mineral",
              },
            },
            required: [
              "mineral_name",
              "value_percentage",
              "safety_for_human_consumption",
              "should_not_be_consumed_if",
              "side_effects_if_consumed_more",
              "banned_in_countries",
              "further_comments",
            ],
          },
        },
        all_vitamins: {
          type: "array",
          description: "List of all vitamins found in the image",
          items: {
            type: "object",
            properties: {
              vitamin_name: {
                type: "string",
                description: "Name of the vitamin",
              },
              value_percentage: {
                type: "string",
                description: "Percentage of the vitamin present",
              },
              safety_for_human_consumption: {
                type: "string",
                description: "Safety information for human consumption",
              },
              should_not_be_consumed_if: {
                type: "string",
                description:
                  "Conditions under which the vitamin should not be consumed",
              },
              side_effects_if_consumed_more: {
                type: "string",
                description: "Side effects if consumed in excess",
              },
              banned_in_countries: {
                type: "string",
                description: "Countries where the vitamin is banned",
              },
              further_comments: {
                type: "string",
                description: "Additional comments about the vitamin",
              },
            },
            required: [
              "vitamin_name",
              "value_percentage",
              "safety_for_human_consumption",
              "should_not_be_consumed_if",
              "side_effects_if_consumed_more",
              "banned_in_countries",
              "further_comments",
            ],
          },
        },
      },
      required: ["all_minerals", "all_vitamins"],
    },
    probable_values: {
      type: "object",
      description: "Probable values when not obtained from the image",
      properties: {
        all_minerals: {
          type: "array",
          description: "List of all minerals found in the image",
          items: {
            type: "object",
            properties: {
              mineral_name: {
                type: "string",
                description: "Name of the mineral",
              },
              value_percentage: {
                type: "string",
                description: "Percentage of the mineral present",
              },
              safety_for_human_consumption: {
                type: "string",
                description: "Safety information for human consumption",
              },
              should_not_be_consumed_if: {
                type: "string",
                description:
                  "Conditions under which the mineral should not be consumed",
              },
              side_effects_if_consumed_more: {
                type: "string",
                description: "Side effects if consumed in excess",
              },
              banned_in_countries: {
                type: "string",
                description: "Countries where the mineral is banned",
              },
              further_comments: {
                type: "string",
                description: "Additional comments about the mineral",
              },
            },
            required: [
              "mineral_name",
              "value_percentage",
              "safety_for_human_consumption",
              "should_not_be_consumed_if",
              "side_effects_if_consumed_more",
              "banned_in_countries",
              "further_comments",
            ],
          },
        },
        all_vitamins: {
          type: "array",
          description: "List of all vitamins found in the image",
          items: {
            type: "object",
            properties: {
              vitamin_name: {
                type: "string",
                description: "Name of the vitamin",
              },
              value_percentage: {
                type: "string",
                description: "Percentage of the vitamin present",
              },
              safety_for_human_consumption: {
                type: "string",
                description: "Safety information for human consumption",
              },
              should_not_be_consumed_if: {
                type: "string",
                description:
                  "Conditions under which the vitamin should not be consumed",
              },
              side_effects_if_consumed_more: {
                type: "string",
                description: "Side effects if consumed in excess",
              },
              banned_in_countries: {
                type: "string",
                description: "Countries where the vitamin is banned",
              },
              further_comments: {
                type: "string",
                description: "Additional comments about the vitamin",
              },
            },
            required: [
              "vitamin_name",
              "value_percentage",
              "safety_for_human_consumption",
              "should_not_be_consumed_if",
              "side_effects_if_consumed_more",
              "banned_in_countries",
              "further_comments",
            ],
          },
        },
      },
    },
    item_on_image: {
      type: "string",
      description: "Item recognized in the image",
    },
    percentage_of_confidence: {
      type: "number",
      description: "Confidence percentage for recognizing the item",
    },
    reason: {
      type: "string",
      description: "Reason for the confidence value",
    },
    banned_in_countries: {
      type: "array",
      description: "Countries where the item is banned",
      items: {
        type: "string",
      },
    },
    date_of_research_information: {
      type: "string",
      description: "Date of research information",
    },
    specific_warnings: {
      type: "string",
      description: "Specific warnings given for the item",
    },
  },
  required: [
    "obtained_values_as_per_image",
    "probable_values",
    "item_on_image",
    "percentage_of_confidence",
    "reason",
    "banned_in_countries",
    "date_of_research_information",
    "specific_warnings",
  ],
};

module.exports = schema