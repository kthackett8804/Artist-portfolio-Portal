import { AzureKeyCredential } from '@azure/core-auth';
import createClient from '@azure-rest/ai-vision-image-analysis';

// In Vite/browser environment, use import.meta.env instead of process.env
const endpoint = import.meta.env.VITE_VISION_ENDPOINT;
const key = import.meta.env.VITE_VISION_KEY;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = [
  'Caption',
  'Read',
  'Tags',
  'People'
];

async function analyzeImageFromUrl(imageUrl) {
  try {
    const result = await client.path('/imageanalysis:analyze').post({
      body: {
        url: imageUrl
      },
      queryParameters: {
        features: features
      },
      contentType: 'application/json'
    });

    const iaResult = result.body;

    const analysisResults = {
      caption: null,
      tags: [],
      text: [],
      peopleCount: 0,
      people: []
    };

    if (iaResult.captionResult) {
      analysisResults.caption = {
        text: iaResult.captionResult.text,
        confidence: iaResult.captionResult.confidence
      };
    }

    if (iaResult.tagsResult) {
      analysisResults.tags = iaResult.tagsResult.values.map(tag => ({
        name: tag.name,
        confidence: tag.confidence
      }));
    }

    if (iaResult.readResult) {
      iaResult.readResult.blocks.forEach(block => {
        block.lines.forEach(line => {
          analysisResults.text.push(line.text);
        });
      });
    }

    if (iaResult.peopleResult?.values) {
  analysisResults.people = iaResult.peopleResult.values.map(person => ({
    confidence: person.confidence
  }));

  analysisResults.peopleCount = analysisResults.people.length;
}

    return analysisResults;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export default { analyzeImageFromUrl };