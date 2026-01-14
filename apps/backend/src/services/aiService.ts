import type {AISuggestion, AISuggestionRequest} from "../types/index.js";

// Simple rule-based AI for hackathon (can be replaced with OpenAI)
/**
 * Generates a suggestion for tipping based on the provided request context and bill amount.
 *
 * @param {AISuggestionRequest} request - The input object containing bill details and contextual information.
 * @param {number} request.billAmount - The total bill amount used to calculate the tip suggestion.
 * @param {Object} [request.context] - Additional context to refine the tip suggestion.
 * @param {string} [request.context.serviceQuality] - The quality of service (e.g., "excellent", "good", "average", "poor").
 * @param {string} [request.context.restaurantType] - The type of restaurant (e.g., "fine dining", "fast food", "bar").
 * @param {number} [request.context.partySize] - The size of the party for which the bill is being paid.
 * @param {string} [request.context.timeOfDay] - The time of day (e.g., "late_night") during which the service occurred.
 *
 * @return {Promise<AISuggestion>} A promise that resolves to an object containing the tip suggestion.
 * @return {number} return.suggestedPercentage - The recommended tip percentage.
 * @return {number} return.suggestedAmount - The calculated tip amount based on the bill.
 * @return {string} return.reasoning - The explanation behind the suggested tip percentage.
 * @return {number} return.confidence - The confidence level of the suggestion.
 */
export async function getAISuggestion(
    request: AISuggestionRequest
): Promise<AISuggestion> {
    const {billAmount, context} = request;

    let suggestedPercentage = 15; // Default
    let confidence = 0.8;
    let reasoning = "Standard tip recommendation";

    // Adjust based on service quality
    if (context?.serviceQuality) {
        switch (context.serviceQuality) {
            case "excellent":
                suggestedPercentage = 20;
                reasoning = "Excellent service deserves a generous tip";
                confidence = 0.9;
                break;
            case "good":
                suggestedPercentage = 18;
                reasoning = "Good service merits an above-average tip";
                confidence = 0.85;
                break;
            case "average":
                suggestedPercentage = 15;
                reasoning = "Standard tip for average service";
                confidence = 0.8;
                break;
            case "poor":
                suggestedPercentage = 10;
                reasoning = "Reduced tip reflects service quality";
                confidence = 0.75;
                break;
        }
    }

    // Adjust based on restaurant type
    if (context?.restaurantType) {
        const type = context.restaurantType.toLowerCase();

        if (type.includes("fine") || type.includes("upscale")) {
            suggestedPercentage = Math.max(suggestedPercentage, 20);
            reasoning = "Fine dining typically warrants higher tips";
        } else if (type.includes("fast") || type.includes("casual")) {
            suggestedPercentage = Math.min(suggestedPercentage, 15);
        } else if (type.includes("bar") || type.includes("pub")) {
            suggestedPercentage = Math.max(suggestedPercentage, 18);
        }
    }

    // Adjust for party size (larger parties often get auto-gratuity)
    if (context?.partySize && context.partySize >= 6) {
        suggestedPercentage = Math.max(suggestedPercentage, 18);
        reasoning = "Larger parties typically include 18%+ gratuity";
    }

    // Adjust for time of day (late night service)
    if (context?.timeOfDay === "late_night") {
        suggestedPercentage += 2;
        reasoning = "Late night service often deserves extra appreciation";
    }

    // Calculate suggested amount
    const suggestedAmount =
        Math.round(billAmount * (suggestedPercentage / 100) * 100) / 100;

    return {
        suggestedPercentage,
        suggestedAmount,
        reasoning,
        confidence,
    };
}

// OpenAI-powered suggestion (for production)
/**
 * Generates an AI-based tipping suggestion using OpenAI's GPT-3.5-turbo model, or falls back to rule-based logic
 * if the API key is missing or the OpenAI request fails.
 *
 * @param {AISuggestionRequest} request - Contains the bill amount and optional contextual data such as service quality,
 *                                         restaurant type, party size, and time of day, which are used to influence
 *                                         the tip suggestion.
 * @return {Promise<AISuggestion>} A promise that resolves to an object containing the suggested tip percentage,
 *                                 calculated tip amount, reasoning behind the suggestion, and confidence level of
 *                                 the AI model.
 */
export async function getAISuggestionWithOpenAI(
    request: AISuggestionRequest
): Promise<AISuggestion> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        // Fallback to rule-based if no API key
        return getAISuggestion(request);
    }

    try {
        const {default: OpenAI} = await import("openai");
        const openai = new OpenAI({apiKey});

        const prompt = `
      You are a tipping advisor. Based on the following information, suggest an appropriate tip percentage.
      
      Bill Amount: $${request.billAmount}
      ${
            request.context?.serviceQuality
                ? `Service Quality: ${request.context.serviceQuality}`
                : ""
        }
      ${
            request.context?.restaurantType
                ? `Restaurant Type: ${request.context.restaurantType}`
                : ""
        }
      ${
            request.context?.partySize
                ? `Party Size: ${request.context.partySize}`
                : ""
        }
      ${
            request.context?.timeOfDay
                ? `Time of Day: ${request.context.timeOfDay}`
                : ""
        }
      
      Respond with a JSON object containing:
      - suggestedPercentage: number (10-25)
      - reasoning: string (brief explanation)
      - confidence: number (0.0-1.0)
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a helpful tipping advisor. Always respond with valid JSON.",
                },
                {role: "user", content: prompt},
            ],
            temperature: 0.3,
            max_completion_tokens: 150
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        const parsed = JSON.parse(content);
        const suggestedAmount =
            Math.round(
                request.billAmount * (parsed.suggestedPercentage / 100) * 100
            ) / 100;

        return {
            suggestedPercentage: parsed.suggestedPercentage,
            suggestedAmount,
            reasoning: parsed.reasoning,
            confidence: parsed.confidence,
        };
    } catch (error) {
        console.error("OpenAI suggestion failed, using rule-based:", error);
        return getAISuggestion(request);
    }
}


/**
 * Calculates tipping options based on the provided bill amount.
 *
 * @param {number} billAmount The total bill amount to calculate tip options for.
 * @return {Object} An object containing an array of tip options and a rounded-up option:
 * - `options`: An array of objects, each containing:
 *   - `percentage`: The tip percentage.
 *   - `amount`: The calculated tip amount.
 *   - `total`: The total amount (bill + tip).
 * - `roundUp`: An object containing:
 *   - `amount`: The rounded-up total amount.
 *   - `tipAmount`: The rounded-up tip amount.
 *   - `total`: The rounded-up total (equal to rounded-up amount).
 */
export function calculateTipOptions(billAmount: number): {
    options: Array<{ percentage: number; amount: number; total: number }>;
    roundUp: { amount: number; tipAmount: number; total: number };
} {
    const percentages = [10, 15, 18, 20, 25];

    const options = percentages.map((percentage) => {
        const amount = Math.round(billAmount * (percentage / 100) * 100) / 100;
        return {
            percentage,
            amount,
            total: Math.round((billAmount + amount) * 100) / 100,
        };
    });

    // Calculate round up option
    const roundUpTotal = Math.ceil(billAmount);
    const roundUpTipAmount = Math.round((roundUpTotal - billAmount) * 100) / 100;

    return {
        options,
        roundUp: {
            amount: roundUpTotal,
            tipAmount: roundUpTipAmount,
            total: roundUpTotal,
        },
    };
}
