
import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle, Code2, Cpu, Globe, Layers, Zap, PenTool, BarChart3, Smartphone, Search, Megaphone } from 'lucide-react';
import { PageView, Lead } from '../types';

interface ServiceDetailProps {
  page: PageView;
  onBack: () => void;
  onRegisterLead?: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ page, onBack, onRegisterLead }) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const getContent = () => {
    switch (page) {
      case 'service-web':
        return {
          icon: <Code2 className="w-16 h-16 text-blue-500" />,
          title: "Desenvolvimento Web & Aplicativos Web",
          subtitle: "Performance, escalabilidade e design responsivo para o seu negócio digital.",
          description: "Criamos sites institucionais, e-commerces e aplicações web complexas (SaaS) focados na experiência do usuário e conversão. Utilizamos as tecnologias mais modernas do mercado para garantir que seu site seja rápido, seguro e fácil de gerir.",
          features: [
            "Desenvolvimento Full-Stack (React, Next.js, Node.js)",
            "Sistemas de Gestão de Conteúdo (CMS) personalizados",
            "E-commerce de alta conversão",
            "Integração com APIs e sistemas de pagamento",
            "Progressive Web Apps (PWA)"
          ],
          process: "Análise de Requisitos -> Prototipagem UX/UI -> Desenvolvimento -> Testes QA -> Deploy & Monitoramento"
        };
      case 'service-mobile':
        return {
          icon: <Smartphone className="w-16 h-16 text-purple-500" />,
          title: "Aplicativos Mobile (iOS & Android)",
          subtitle: "Apps nativos e híbridos que conectam sua marca ao bolso do cliente.",
          description: "Desenvolvemos aplicativos móveis intuitivos e robustos para startups e grandes empresas. Seja um app de delivery, uma rede social corporativa ou uma ferramenta de gestão, entregamos soluções que funcionam perfeitamente em iPhones e Androids.",
          features: [
            "Desenvolvimento Híbrido com React Native / Flutter",
            "Design de Interface Nativa (Human Interface Guidelines)",
            "Integração com Geolocation, Câmera e Push Notifications",
            "Publicação na Apple App Store e Google Play Store",
            "Manutenção e atualizações contínuas"
          ],
          process: "Ideação -> Wireframes -> UI Design -> Codificação -> Testes Beta -> Lançamento nas Lojas"
        };
      case 'service-ai':
        return {
          icon: <Cpu className="w-16 h-16 text-pink-500" />,
          title: "Soluções em Inteligência Artificial",
          subtitle: "Automatize processos e inove com a tecnologia do Google Gemini.",
          description: "Como parceiros do Google AI Studio, implementamos soluções de IA que transformam dados em insights e automatizam tarefas repetitivas. De chatbots de atendimento a sistemas de recomendação, preparamos sua empresa para o futuro.",
          features: [
            "Integração de LLMs (Google Gemini, OpenAI)",
            "Chatbots de Atendimento Inteligente 24/7",
            "Análise Preditiva de Dados de Vendas",
            "Automação de Criação de Conteúdo",
            "Visão Computacional para Análise de Imagens"
          ],
          process: "Mapeamento de Dados -> Escolha do Modelo -> Treinamento/Fine-tuning -> Integração API -> Validação"
        };
      case 'service-design':
        return {
          icon: <PenTool className="w-16 h-16 text-yellow-500" />,
          title: "Design & Branding",
          subtitle: "Identidade visual marcante que comunica a essência da sua marca.",
          description: "O design não é apenas visual, é funcional. Criamos identidades visuais completas, desde o logotipo até o design system de seus produtos digitais, garantindo consistência em todos os pontos de contato com o cliente em Portugal e Itália.",
          features: [
            "Criação de Logotipos e Identidade Visual",
            "UI/UX Design para Sites e Apps",
            "Design Systems e Guia de Estilo",
            "Materiais Gráficos para Redes Sociais",
            "Prototipagem Interativa (Figma)"
          ],
          process: "Briefing -> Pesquisa de Mercado -> Conceito Visual -> Refinamento -> Entrega dos Assets"
        };
      case 'service-seo':
        return {
          icon: <Globe className="w-16 h-16 text-teal-500" />,
          title: "SEO & Internacionalização",
          subtitle: "Sua empresa encontrada no Google em Portugal, Itália e no Mundo.",
          description: "Não basta ter um site bonito, ele precisa ser encontrado. Nossa estratégia de SEO técnico e de conteúdo posiciona sua marca nas primeiras páginas do Google. Especialistas em internacionalização de negócios para mercados europeus.",
          features: [
            "SEO Técnico e Otimização de Performance (Core Web Vitals)",
            "Pesquisa de Palavras-chave por Mercado (PT/IT/EN)",
            "SEO Local (Google Meu Negócio)",
            "Adaptação Cultural e Tradução de Conteúdo",
            "Link Building e Autoridade de Domínio"
          ],
          process: "Auditoria SEO -> Estratégia de Keywords -> Otimização On-Page -> Criação de Conteúdo -> Relatórios Mensais"
        };
      case 'service-ads':
        return {
          icon: <Megaphone className="w-16 h-16 text-green-500" />,
          title: "Publicidade Digital",
          subtitle: "Tráfego pago estratégico para gerar leads qualificados e vendas.",
          description: "Maximizamos seu ROI através de campanhas de alta performance no Google Ads, Meta Ads (Instagram/Facebook) e LinkedIn. Segmentamos seu público ideal para garantir que cada euro investido traga retorno real.",
          features: [
            "Gestão de Campanhas Google Ads (Search, Display, Youtube)",
            "Anúncios em Redes Sociais (Instagram, Facebook, LinkedIn)",
            "Remarketing Estratégico",
            "Copywriting Persuasivo para Anúncios",
            "Setup de Google Analytics 4 e Tags de Conversão"
          ],
          process: "Definição de KPI -> Configuração de Pixel -> Criação de Criativos -> Lançamento -> Otimização Diária"
        };
      default:
        return null;
    }
  };

  const content = getContent();

  if (!content) return null;

  return (
    <div className="min-h-screen bg-dark text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Navigation Back */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Início
        </button>

        {/* Hero Section of Service */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-16 border border-slate-700 relative overflow-hidden mb-16 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-0"></div>
          
          <div className="relative z-10">
            <div className="mb-6 p-4 bg-slate-900/80 rounded-2xl w-fit border border-slate-700 shadow-lg">
              {content.icon}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Details & Features Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Sobre o Serviço</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                {content.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Nosso Processo</h2>
              <div className="flex flex-col gap-4">
                {content.process.split('->').map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <span className="text-slate-200 font-medium">{step.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 rounded-2xl p-8 border border-slate-700 h-fit">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              O que está incluído
            </h3>
            <ul className="space-y-4">
              {content.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-slate-700">
              <a 
                href="#contact" 
                className="block w-full text-center bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20"
              >
                Solicitar Orçamento para este Serviço
              </a>
              <p className="text-center text-xs text-slate-500 mt-3">
                Resposta em até 24 horas úteis.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetail;
