import OpenAI from "openai";
import { Website } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type WebsiteGenerationRequest = {
  description: string;
  name?: string;
};

type WebsiteGenerationResponse = {
  html: string;
  css: string;
  js: string;
  name: string;
};

export async function generateWebsite(request: WebsiteGenerationRequest): Promise<WebsiteGenerationResponse> {
  try {
    const prompt = `
      Generate a complete, responsive website based on the following description: "${request.description}".

      Please provide a complete, functional website structured as a JSON object with the following properties:
      - html: The full HTML content of the webpage (include doctype, html, head, and body tags)
      - css: The complete CSS styling for the webpage (include all necessary styles for responsiveness)
      - js: Any JavaScript needed for interactivity
      - name: A suitable name for this website

      Make sure the website is:
      1. Responsive and mobile-friendly
      2. Modern and visually appealing
      3. Accessible
      4. Well-structured with semantic HTML
      5. Using CSS variables for consistent styling
      6. Including basic interactive elements where appropriate
      
      Return only the JSON object with these properties and nothing else.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional web developer who creates complete, responsive websites with modern design principles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    const websiteData = JSON.parse(content) as WebsiteGenerationResponse;
    
    // If name was provided in the request and not empty, use it instead
    if (request.name && request.name.trim() !== '') {
      websiteData.name = request.name;
    }
    
    return websiteData;
  } catch (error) {
    console.error("Error generating website:", error);
    throw new Error(`Failed to generate website: ${error.message}`);
  }
}

export async function updateWebsiteCode(websiteId: number, updates: {
  html?: string;
  css?: string;
  js?: string;
  instruction?: string;
  currentWebsite: Website;
}): Promise<Partial<WebsiteGenerationResponse>> {
  try {
    // If direct code updates are provided, return them without calling OpenAI
    if ((updates.html || updates.css || updates.js) && !updates.instruction) {
      return {
        html: updates.html,
        css: updates.css,
        js: updates.js
      };
    }

    // If instruction is provided, use OpenAI to modify the website
    if (updates.instruction) {
      const prompt = `
        Update the existing website based on the following instruction: "${updates.instruction}".
        
        Current website code:
        HTML:
        ${updates.currentWebsite.htmlContent}
        
        CSS:
        ${updates.currentWebsite.cssContent}
        
        JavaScript:
        ${updates.currentWebsite.jsContent || '// No JavaScript'}
        
        Please provide the updated code as a JSON object with the following properties:
        - html: The updated HTML content
        - css: The updated CSS content
        - js: The updated JavaScript content
        
        Apply the requested changes while maintaining the overall structure and functionality of the website.
        Return only the JSON object with these properties and nothing else.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional web developer who modifies websites based on user instructions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content returned from OpenAI");
      }

      return JSON.parse(content) as Partial<WebsiteGenerationResponse>;
    }

    throw new Error("Neither direct code updates nor instruction provided");
  } catch (error) {
    console.error("Error updating website code:", error);
    throw new Error(`Failed to update website code: ${error.message}`);
  }
}
