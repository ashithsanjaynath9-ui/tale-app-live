/**
 * High-fidelity, customized natural language generator for employer narratives.
 * Integrates dynamic input values with recruiting narratives for Sovereign Talent Group's brand voice.
 */

export function generateMockNarrative(
  clientName: string,
  values: string,
  benefits: string,
  mission: string,
  competitorLandscape?: string,
  targetProfile?: string
): { title: string; content: string; matchScore: number } {
  // Parse inputs into arrays or clean lists
  const valList = values ? values.split(',').map(s => s.trim()).filter(Boolean) : ['Excellence', 'Autonomy', 'Innovation'];
  const benList = benefits ? benefits.split(',').map(s => s.trim()).filter(Boolean) : ['Flexible schedules', 'Health insurance', 'Uncapped growth'];
  
  const formattedValues = valList.map(v => `*   **${v}**: We embody this philosophy through self-directed, rigorous attention to detail.`).join('\n');
  const formattedBenefits = benList.map(b => `*   **${b}**: Curated to protect our team's intellectual energy and long-term wellness.`).join('\n');

  const title = `${clientName}: Engineered For Significance`;
  
  // Calculate a match score based on details provided. Greater detail = higher score.
  let baseScore = 75;
  if (values && values.length > 20) baseScore += 5;
  if (benefits && benefits.length > 20) baseScore += 5;
  if (mission && mission.length > 30) baseScore += 5;
  if (competitorLandscape && competitorLandscape.length > 15) baseScore += 4;
  if (targetProfile && targetProfile.length > 15) baseScore += 4;
  
  // Cap at 98%
  const matchScore = Math.min(baseScore, 98);

  const content = `### THE NARRATIVE ARCHETYPE FOR ${clientName.toUpperCase()}

**THE FOUNDING THESIS**
${mission ? mission : `To define the standard of execution in our category by empowering individuals of extraordinary capability.`} 

**OUR HUMAN TENETS & VALUES**
${formattedValues}

${competitorLandscape ? `
**THE DEVIANCE FROM BASELINE COMPETITION**
Unlike competitors who are constrained by ${competitorLandscape}, we choose another coordinates entirely. We believe the path to absolute performance is through focus, not high-volume noise.
` : `
**THE DEVIANCE FROM BASELINE COMPETITION**
Where our competitors seek standard linear benchmarks, we focus on outlier performance. We do not hire for consensus; we hire to disrupt categories.
`}

**THE HIGH-ENERGY PROTOCOLS (BENEFITS)**
${formattedBenefits}

${targetProfile ? `
**THE IDEAL PROTO-CANDIDATE OUTLINE**
Our narrative points uniquely to: *${targetProfile}*. 
We predict individuals of this specific caliber will see an immediate alignment of incentives and values, translating to a projected 24% reduction in first-year operational onboarding delays.
` : ''}

---
*// TODO: Connect to OpenAI/Groq API for actual generation. Under TALE Enterprise, this model uses a server-side @google/genai pipeline powered by gemini-2.5-pro.*`;

  return {
    title,
    content,
    matchScore
  };
}
