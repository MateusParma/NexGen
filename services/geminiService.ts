import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, Lead, ProjectIdea, ProposalData } from "../types";

// Função robusta para capturar a API Key em diferentes ambientes (Vite, Vercel, Local)
const getApiKey = (): string => {
  let key = "";

  // 1. Tentar via import.meta.env (Padrão Vite)
  // Usamos casting para 'any' para evitar erros de TS se os tipos do Vite não estiverem carregados
  try {
    const meta = (import.meta as any);
    if (meta && meta.env) {
      key = meta.env.VITE_API_KEY || meta.env.API_KEY || "";
    }
  } catch (e) {
    // Ignora erro se import.meta não existir
  }

  if (key) return key;

  // 2. Tentar via process.env (Fallback para Node/Vercel Serverless)
  try {
    if (typeof process !== 'undefined' && process.env) {
      key = process.env.API_KEY || process.env.VITE_API_KEY || "";
    }
  } catch (e) {
    // Ignora erro se process não estiver definido
  }

  return key;
};

const apiKey = getApiKey();

// Inicializa com a chave encontrada ou uma string vazia (o erro será tratado nas chamadas)
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });

// Definição da ferramenta para capturar leads
const createLeadTool: FunctionDeclaration = {
  name: 'createLead',
  description: 'Registra um novo lead (cliente interessado) no sistema quando o usuário fornece nome e contato.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: {
        type: Type.STRING,
        description: 'Nome do cliente.',
      },
      contact: {
        type: Type.STRING,
        description: 'Email ou telefone do cliente.',
      },
      interest: {
        type: Type.STRING,
        description: 'Resumo do interesse ou projeto do cliente.',
      },
    },
    required: ['name', 'contact', 'interest'],
  },
};

interface AiResponse {
  text: string;
  leadData?: Omit<Lead, 'id' | 'createdAt' | 'status'>;
}

export const getAiConsultation = async (
  currentMessage: string, 
  history: ChatMessage[],
  currentImage?: string
): Promise<AiResponse> => {
  // Verificação explícita da chave antes de tentar chamar a API
  if (!apiKey || apiKey === "MISSING_KEY") {
    console.error("API Key missing or invalid");
    return { text: "Erro de Configuração: A chave de API (VITE_API_KEY) não foi encontrada. Verifique as variáveis de ambiente no Vercel." };
  }

  try {
    // Constrói o conteúdo multimodal para a API
    const contents: any[] = history.map(msg => {
      const parts: any[] = [];
      
      if (msg.image) {
        // Remove prefixo data:image/jpeg;base64, se existir
        const base64Data = msg.image.split(',')[1] || msg.image;
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
            }
        });
      }
      
      if (msg.text && msg.text.trim()) {
        parts.push({ text: msg.text });
      }
      
      return {
        role: msg.role,
        parts: parts
      };
    });

    // Adiciona a mensagem atual
    const currentParts: any[] = [];
    
    if (currentImage) {
        const base64Data = currentImage.split(',')[1] || currentImage;
        currentParts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
            }
        });
    }

    if (currentMessage && currentMessage.trim()) {
        currentParts.push({ text: currentMessage });
    }

    // Se não houver conteúdo (ex: envio vazio), retorna erro
    if (currentParts.length === 0) {
        return { text: "Por favor, envie uma mensagem de texto ou uma imagem." };
    }

    contents.push({
        role: 'user',
        parts: currentParts
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        tools: [
            { functionDeclarations: [createLeadTool] },
            { googleSearch: {} } 
        ],
        systemInstruction: `Você é um Consultor Sênior da "NexGen Digital", agência de tecnologia.
        
        CAPACIDADES:
        1. Você pode VER imagens enviadas (analise designs, esboços, sites ou referências).
        2. Você pode NAVEGAR na web (usando Google Search) se o usuário pedir para analisar um site ou buscar tendências.

        DADOS DA EMPRESA:
        - Email: comercial.nexgen.iaestudio@gmail.com
        - Tel Portugal: +351 925 460 063
        - Tel Itália: +39 392 015 2416

        OBJETIVO:
        1. Analisar visualmente qualquer imagem que o usuário enviar e dar feedback técnico/criativo.
        2. Se o usuário mandar um link, use o Google Search para entender o contexto do site.
        3. CAPTURAR LEADS: Se houver interesse comercial, peça Nome e Contato e use a tool 'createLead'.

        TOM DE VOZ:
        Profissional, perspicaz, especialista em tecnologia e design.`,
        temperature: 0.7,
      }
    });

    let responseText = response.text || "";
    let leadData = undefined;
    
    // Tratamento de Grounding (Links do Google Search)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
        let links = "\n\n**Fontes consultadas:**\n";
        let hasLinks = false;
        groundingChunks.forEach((chunk: any) => {
            if (chunk.web?.uri) {
                links += `- [${chunk.web.title}](${chunk.web.uri})\n`;
                hasLinks = true;
            }
        });
        if (hasLinks) responseText += links;
    }

    // Verifica se houve chamada de função (Function Calling)
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'createLead') {
        leadData = call.args as any;
        if (!responseText) {
          responseText = "Perfeito! Registrei seus dados e nossa equipe entrará em contato em breve.";
        }
      }
    }

    return { text: responseText, leadData };

  } catch (error: any) {
    console.error("Erro ao chamar Gemini API:", error);
    // Mensagem de erro amigável dependendo do tipo de erro
    if (error.toString().includes("API key")) {
         return { text: "Erro de autenticação: Verifique se a chave da API (VITE_API_KEY) está correta." };
    }
    return { text: "Ocorreu um erro ao conectar com nosso consultor virtual. Tente novamente." };
  }
};

/**
 * Gera uma proposta comercial estruturada (JSON) baseada nos dados do projeto
 */
export const generateProposal = async (project: ProjectIdea): Promise<ProposalData | null> => {
  if (!apiKey || apiKey === "MISSING_KEY") {
    console.error("API Key not found");
    return null;
  }

  // Prepara o prompt com fallback se algum dado estiver faltando
  const prompt = `
    Aja como um Diretor de Criação e Vendas da NexGen Digital.
    Analise este projeto e crie os dados para uma proposta comercial premium estilo Apple/McKinsey.

    DADOS DO PROJETO:
    Projeto: ${project.title || 'Projeto Customizado'}
    Descrição: ${project.description || 'Desenvolvimento de solução digital sob medida.'}
    Features: ${project.features?.join(', ') || 'A definir na reunião técnica.'}
    Orçamento do Cliente: ${project.budgetRange || 'A definir'}
    
    Gere um JSON VÁLIDO seguindo estritamente este esquema:
    {
      "title": "Titulo Comercial Curto e Impactante",
      "executiveSummary": "Resumo executivo persuasivo (max 300 chars)",
      "solutionHighlights": ["Destaque 1", "Destaque 2", "Destaque 3"],
      "techStack": ["Tech 1", "Tech 2"],
      "timeline": [
        {"phase": "Fase 1", "duration": "2 semanas"},
        {"phase": "Fase 2", "duration": "4 semanas"}
      ],
      "investmentValue": "€ X.XXX,XX",
      "investmentDetails": "Frase curta justificando o valor (ROI, tecnologia, exclusividade)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            solutionHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            timeline: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  duration: { type: Type.STRING }
                }
              } 
            },
            investmentValue: { type: Type.STRING },
            investmentDetails: { type: Type.STRING },
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      console.error("Empty response from Gemini");
      return null;
    }
    
    return JSON.parse(jsonText) as ProposalData;

  } catch (error) {
    console.error("Erro ao gerar proposta:", error);
    return null;
  }
};