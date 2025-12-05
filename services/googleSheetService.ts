
// Serviço para salvar dados no Google Sheets (Banco de Dados Gratuito)

// PASSO A PASSO PARA CONFIGURAR:
// 1. Crie uma planilha no Google Sheets.
// 2. Vá em Extensões > Apps Script.
// 3. Cole o código do script (fornecido no chat).
// 4. Publique como "App da Web" com acesso para "Qualquer pessoa".
// 5. Cole a URL gerada abaixo.

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzE-BwMOtCGvWxPtkVYhxBYagBEbdwG9wbj-csqyBIyAmD-_J1MnmxsESY1J1PCSFfNoQ/exec"; 

export const saveToGoogleSheet = async (data: {
  name: string;
  contact: string;
  interest: string;
  details?: any;
}) => {
  // Se a URL não estiver configurada, apenas ignora (evita erro no console)
  if (GOOGLE_SCRIPT_URL === "https://script.google.com/macros/s/AKfycbzE-BwMOtCGvWxPtkVYhxBYagBEbdwG9wbj-csqyBIyAmD-_J1MnmxsESY1J1PCSFfNoQ/exec" || !GOOGLE_SCRIPT_URL) {
    console.warn("Google Sheet URL não configurada. Os dados não serão salvos na planilha.");
    return;
  }

  try {
    // Usamos mode: 'no-cors' para enviar dados para o Google sem bloqueio do navegador.
    // Isso significa que não saberemos se deu erro ou sucesso (Fire and Forget),
    // mas os dados chegarão na planilha.
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Dados enviados para Google Sheets");
  } catch (error) {
    console.error("Erro ao salvar no Google Sheets:", error);
  }
};
