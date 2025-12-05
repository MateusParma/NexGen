
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, Lead, ProjectIdea, ProposalData } from "../types";

// --- SISTEMA DE DIAGNÓSTICO DE CHAVE DE API ---

const getApiKey = (): string => {
  let key = "";
  
  // 1. Tenta via VITE_API_KEY (Padrão Vite)
  // @ts-ignore
  if (import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    key = import.meta.env.VITE_API_KEY;
  } 
  
  // 2. Tenta via process.env (Fallback / Node)
  if (!key && typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_API_KEY) key = process.env.VITE_API_KEY;
    else if (process.env.API_KEY) key = process.env.API_KEY;
  }

  return key;
};

const apiKey = getApiKey();

// Inicializa o cliente apenas se tiver chave, senão deixa null para tratar no erro
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

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
  
  // --- DIAGNÓSTICO EM TEMPO REAL ---
  if (!ai || !apiKey) {
    console.error("API Key missing");
    
    // Coleta dados para debug (sem expor a chave inteira se existir parcial)
    const envCheck = {
      hasImportMeta: typeof import.meta !== 'undefined',
      // @ts-ignore
      hasViteEnv: typeof import.meta !== 'undefined' && !!import.meta.env,
      // @ts-ignore
      viteKeyFound: typeof import.meta !== 'undefined' && !!import.meta.env?.VITE_API_KEY,
      processEnvFound: typeof process !== 'undefined' && !!process.env,
    };

    return { 
      text: `⛔ **ERRO CRÍTICO DE CONFIGURAÇÃO** ⛔\n\n` +
            `O sistema não conseguiu encontrar a CHAVE DA API.\n\n` +
            `**Diagnóstico Técnico:**\n` +
            `- Ambiente Vite (import.meta): ${envCheck.hasImportMeta ? 'OK' : 'Ausente'}\n` +
            `- Variável VITE_API_KEY: ${envCheck.viteKeyFound ? 'Encontrada' : 'NÃO ENCONTRADA'}\n` +
            `- Process.env (Node): ${envCheck.processEnvFound ? 'OK' : 'Ausente'}\n\n` +
            `**Solução para Vercel:**\n` +
            `1. Vá em Settings > Environment Variables.\n` +
            `2. Adicione a chave com o nome exato: **VITE_API_KEY**\n` +
            `3. O valor deve começar com "AIza..."\n` +
            `4. **IMPORTANTE:** Faça um REDEPLOY (Reconstrução) do projeto após salvar a chave.` 
    };
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
            // { functionDeclarations: [createLeadTool] }, // DESATIVADO: Conflito com Google Search
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
        3. CAPTAÇÃO DE LEAD/ORÇAMENTO: Se o cliente quiser um orçamento, explique que existem duas opções e guie-o:
           
           - **Opção 1 (Recomendada para Projetos): Área do Cliente (Login)**
             Explique que ele deve clicar em "Login" no menu. Lá ele pode criar uma conta, cadastrar a ideia do projeto detalhadamente (com imagens, arquivos) e enviar um pedido de orçamento formal direto pelo painel.
           
           - **Opção 2 (Rápida): Formulário de Contato**
             Para dúvidas rápidas, ele pode usar o formulário no final da página ou clicar no botão "Orçamento".

           NÃO tente coletar os dados automaticamente pelo chat.

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

    // Verifica se houve chamada de função (Function Calling) - CÓDIGO MANTIDO MAS NÃO SERÁ ACIONADO
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
    
    // Tratamento de Erros Detalhado para o Usuário
    let errorMsg = "Ocorreu um erro desconhecido.";
    const errorString = error.toString();

    if (errorString.includes("API key")) {
        errorMsg = "❌ **Erro de Chave de API (403/400):**\nA chave configurada é inválida ou foi rejeitada pelo Google. Verifique se copiou corretamente.";
    } else if (errorString.includes("404")) {
        errorMsg = "❌ **Erro de Modelo (404):**\nO modelo 'gemini-2.5-flash' não está disponível para esta chave ou região.";
    } else if (errorString.includes("500") || errorString.includes("503")) {
        errorMsg = "⚠️ **Erro no Servidor do Google:**\nO Gemini está temporariamente indisponível. Tente novamente em alguns segundos.";
    } else if (errorString.includes("INVALID_ARGUMENT")) {
        errorMsg = "⚠️ **Erro de Configuração:**\nConflito de ferramentas (Search vs Function Calling). Contacte o admin.";
    } else {
        errorMsg = `⚠️ **Erro Técnico:**\n${error.message || errorString}`;
    }

    return { text: errorMsg };
  }
};

/**
 * Gera uma proposta comercial SIMPLIFICADA E RÁPIDA (JSON)
 */
export const generateProposal = async (project: ProjectIdea): Promise<{ success: boolean; data?: ProposalData; error?: string }> => {
  if (!ai) {
    return { success: false, error: "Chave de API não configurada no sistema." };
  }

  // Prompt simplificado e direto para evitar timeouts
  const prompt = `
    Aja como um Vendedor Sênior. Gere uma Proposta Comercial JSON para este projeto.
    
    PROJETO: ${project.title || 'Novo Projeto'}
    DESCRIÇÃO: ${project.description || 'Desenvolvimento sob medida'}
    ORÇAMENTO: ${project.budgetRange || 'A definir'}
    FEATURES: ${project.features?.join(', ') || 'Padrao'}

    REGRAS CRÍTICAS:
    1. Responda APENAS com o JSON. Sem markdown.
    2. Seja breve.
    3. Se faltar dados, INVENTE algo profissional e genérico.

    ESTRUTURA JSON OBRIGATÓRIA:
    {
      "title": "Titulo Comercial Atraente",
      "executiveSummary": "Resumo em 2 frases no máximo focando em valor.",
      "solutionHighlights": ["Destaque 1", "Destaque 2", "Destaque 3"],
      "techStack": ["Tecnologia A", "Tecnologia B"],
      "timeline": [
        {"phase": "Planejamento", "duration": "1 semana"},
        {"phase": "Desenvolvimento", "duration": "2 semanas"}
      ],
      "investmentValue": "${project.budgetRange || 'A definir'}",
      "investmentDetails": "Inclui desenvolvimento, testes e garantia de 3 meses."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Desativamos tools para garantir velocidade máxima
        temperature: 0.4, // Mais determinístico
      }
    });

    let jsonText = response.text;
    if (!jsonText) throw new Error("Resposta vazia da IA");
    
    // Limpeza agressiva de Markdown (caso a IA ignore o config)
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(jsonText) as ProposalData;
    return { success: true, data };

  } catch (error: any) {
    console.error("Erro ao gerar proposta:", error);
    
    if (error.toString().includes("403")) return { success: false, error: "Erro de Permissão (API Key)." };
    
    return { success: false, error: "Não foi possível gerar a proposta agora. Tente novamente." };
  }
};
