
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { ChatMessage, Lead, ProjectIdea, ProposalData, StartupAnalysis, StartupFeasibility } from "../types";

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
 * Gera uma proposta comercial PROFISSIONAL E ESTRUTURADA (JSON)
 */
export const generateProposal = async (project: ProjectIdea): Promise<{ success: boolean; data?: ProposalData; error?: string }> => {
  if (!ai) {
    return { success: false, error: "Chave de API não configurada no sistema." };
  }

  // Prompt aprimorado para resultados profissionais
  const prompt = `
    Aja como um Arquiteto de Soluções Sênior de uma Agência Digital Premium.
    
    TAREFA: Gerar uma Proposta Comercial Detalhada em JSON para o seguinte projeto.
    
    DADOS DO PROJETO:
    - Título: ${project.title || 'Projeto Digital Personalizado'}
    - Descrição: ${project.description || 'Desenvolvimento de solução sob medida'}
    - Orçamento Cliente: ${project.budgetRange || 'A definir'}
    - Features Desejadas: ${project.features?.join(', ') || 'Padrão de mercado'}

    DIRETRIZES DE ESTILO:
    1. Use linguagem corporativa, persuasiva e profissional.
    2. Foco em VALOR DE NEGÓCIO, não apenas código.
    3. Seja realista com prazos.

    ESTRUTURA JSON OBRIGATÓRIA (Não use Markdown, apenas JSON puro):
    {
      "title": "Crie um nome comercial impactante para a solução",
      "subtitle": "Um slogan curto ou subtítulo técnico",
      "executiveSummary": "Um parágrafo denso (3-4 frases) vendendo a visão da solução, mencionando tecnologias modernas e escalabilidade.",
      "scope": [
         { "title": "Nome do Módulo/Fase", "description": "Descrição detalhada do que será feito nesta parte." },
         { "title": "Nome do Módulo/Fase", "description": "Descrição detalhada..." }
         // Crie pelo menos 3 a 4 itens de escopo relevantes
      ],
      "techStack": ["Tecnologia 1", "Tecnologia 2", "Tecnologia 3", "Tecnologia 4"],
      "timeline": [
        {"phase": "1. Discovery & Design", "duration": "X Semanas", "deliverable": "Wireframes, UI Kit, Protótipo"},
        {"phase": "2. Desenvolvimento", "duration": "X Semanas", "deliverable": "Frontend, Backend, API"},
        {"phase": "3. QA & Deploy", "duration": "X Semanas", "deliverable": "Testes, Lançamento"}
      ],
      "marketingStrategy": "Sugestão de 2 frases sobre como alavancar o produto (SEO, Ads ou Launch).",
      "maintenancePlan": "Descrição do suporte pós-lançamento (ex: 3 meses garantia, updates segurança).",
      "investmentValue": "${project.budgetRange || 'A definir sob análise'}",
      "investmentDetails": "Forma de pagamento sugerida (ex: 40% entrada, 30% entrega, 30% final) e validade da proposta.",
      "whyUs": "Uma frase de encerramento sobre por que a NexGen Digital é a escolha certa."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, // Equilíbrio entre criatividade e estrutura
      }
    });

    let jsonText = response.text;
    if (!jsonText) throw new Error("Resposta vazia da IA");
    
    // Limpeza robusta
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(jsonText) as ProposalData;
    return { success: true, data };

  } catch (error: any) {
    console.error("Erro ao gerar proposta:", error);
    
    if (error.toString().includes("403")) return { success: false, error: "Erro de Permissão (API Key)." };
    
    return { success: false, error: "Não foi possível gerar a proposta agora. Tente novamente." };
  }
};

/**
 * ETAPA 1: ANÁLISE DE VIABILIDADE (Shark Tank)
 */
export const analyzeFeasibility = async (idea: string): Promise<{ success: boolean; data?: StartupFeasibility; error?: string }> => {
  if (!ai) return { success: false, error: "Chave de API não configurada." };

  const prompt = `
    Aja como um Investidor de Venture Capital (Shark Tank) extremamente experiente e crítico.
    
    IDEIA: "${idea}"

    Avalie a viabilidade desta ideia para o mercado digital atual.
    Seja honesto e direto. Não tenha medo de criticar se a ideia for ruim.

    Retorne APENAS um JSON com esta estrutura:
    {
      "score": (número de 0 a 100),
      "verdict": "Aprovado" ou "Reprovado" ou "Incerto" (Use Aprovado apenas se score > 70),
      "summary": "Um comentário curto (max 2 frases) com sua opinião direta sobre o potencial.",
      "strengths": ["Ponto forte 1", "Ponto forte 2", "Ponto forte 3"],
      "weaknesses": ["Ponto fraco 1", "Ponto fraco 2", "Ponto fraco 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.6 }
    });

    let jsonText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return { success: true, data: JSON.parse(jsonText) };
  } catch (error) {
    return { success: false, error: "Erro na análise de viabilidade." };
  }
};

/**
 * ETAPA 2: GERAÇÃO COMPLETA DA STARTUP (SPLIT STRATEGY)
 * Resolvemos o problema de timeout e JSON quebrado dividindo em 2 chamadas.
 */
export const generateFullStartup = async (idea: string): Promise<{ success: boolean; data?: StartupAnalysis; error?: string }> => {
  if (!ai) return { success: false, error: "Chave de API não configurada." };

  // 1. GERAÇÃO DE DADOS DE NEGÓCIO (JSON)
  const businessPrompt = `
    Aja como um Cofundador Técnico e Diretor de Produto (CPO).
    IDEIA APROVADA: "${idea}"
    
    TAREFA: Desenvolver a startup completa (Business Plan, Branding, Orçamentos).
    
    ESTRUTURA DO JSON (Estrita):
    {
      "name": "Nome moderno e curto (Ex: Uber, Airbnb, Stripe)",
      "slogan": "Slogan curto de impacto",
      "description": "Pitch de 2 parágrafos vendendo a visão.",
      "logoSvg": "Código SVG VÁLIDO (apenas a string <svg...>) para um ícone minimalista e moderno. ViewBox 0 0 100 100. Use cores vivas.",
      "colors": ["Hex1", "Hex2", "Hex3"],
      
      "targetAudience": "Definição do público alvo e persona.",
      "revenueModel": "Como a empresa ganha dinheiro (SaaS, Ads, Marketplace, etc).",
      "marketingStrategy": "Estratégia de Go-To-Market inicial.",

      "budgets": {
        "mvp": { 
          "range": "Ex: €2.000 - €4.000", 
          "description": "Versão simplificada apenas com funcionalidades essenciais.", 
          "timeline": "3-4 Semanas" 
        },
        "ideal": { 
          "range": "Ex: €8.000 - €12.000", 
          "description": "Produto completo com painel admin, app nativo e integrações.", 
          "timeline": "2-3 Meses" 
        }
      }
    }
  `;

  try {
    // --- Chamada 1: Dados de Negócio (JSON) ---
    const businessResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: businessPrompt,
      config: { responseMimeType: "application/json", temperature: 0.7 }
    });

    let jsonText = businessResponse.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    const businessData = JSON.parse(jsonText) as Partial<StartupAnalysis>;

    // --- Chamada 2: Geração de Site (HTML Puro) ---
    // Isso evita que o HTML quebre o JSON da resposta anterior
    const sitePrompt = `
      Aja como um Desenvolvedor Frontend Sênior Especialista em Tailwind CSS.
      
      PROJETO: "${businessData.name}" - ${businessData.slogan}
      CORES: ${businessData.colors?.join(', ')}
      DESCRIÇÃO: ${businessData.description}

      TAREFA: Crie o código HTML COMPLETO para a Landing Page (Single Page).
      
      REGRAS TÉCNICAS:
      - Use Tailwind CSS via CDN.
      - NÃO use Markdown. Retorne APENAS o código HTML cru.
      - NÃO coloque tags <html>, <head> ou <body>. Retorne apenas o conteúdo que vai dentro do body.
      - Use 'min-h-screen' para permitir rolagem.
      - O texto dos serviços deve ser REAL e PERSUASIVO (Proibido Lorem Ipsum).
      - IMPORTANTE: Todos os botões (CTA) devem ter classes como 'cursor-pointer', 'hover:scale-105', 'transition-all' para parecerem clicáveis.
      
      ESTRUTURA:
      1. <header> com Logo (Texto ${businessData.name}) e Nav. (Use container mx-auto).
      2. <section id='hero'> Impactante com cores da marca.
      3. <section id='features'> 3 Cards com ícones (pode usar emoji ou svg inline simples).
      4. <section id='pricing'> Tabela de preços.
      5. <footer>.
    `;

    const siteResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: sitePrompt,
      config: { responseMimeType: "text/plain", temperature: 0.7 }
    });

    const websiteHtml = siteResponse.text || "<p>Erro ao gerar site.</p>";

    // Junta tudo
    const fullResult: StartupAnalysis = {
      ...businessData as any,
      websiteHtml: websiteHtml
    };

    return { success: true, data: fullResult };

  } catch (error) {
    console.error("Erro na geração completa:", error);
    return { success: false, error: "Erro na geração completa. Tente novamente." };
  }
};
