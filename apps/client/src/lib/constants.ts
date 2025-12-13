export const TERMINAL_LINES = [
    { text: "Initializing AutoDev Protocol v1.0...", color: "text-slate-500", highlight: [] },
    { text: "[10:42:01] Connecting to Cline Agent... [CONNECTED]", color: "text-green-400", highlight: ["Cline Agent"] },
    { text: "[10:42:02] Orchestrating workflow via Kestra... [ACTIVE]", color: "text-purple-400", highlight: ["Kestra"] },
    { text: "[10:42:03] Retrieving context from GitHub... [DONE]", color: "text-blue-400", highlight: ["GitHub"] },
    { text: "[10:42:04] Analyzing diffs with CodeRabbit... [COMPLETE]", color: "text-orange-400", highlight: ["CodeRabbit"] },
    { text: "[10:42:04] Assembling AI models via Together.ai... [READY]", color: "text-indigo-400", highlight: ["Together.ai"] },
    { text: "[10:42:05] Asking Vercel if it's okay to deploy on a Friday... [APPROVED]", color: "text-yellow-400", highlight: ["Vercel"] },
];

export const PARTNERS = [
    { name: "Cline", logo: "/integrations/cline.svg", url: "https://cline.bot" },
    { name: "Kestra", logo: "/integrations/Kestra.full.logo.light.svg", url: "https://kestra.io" },
    { name: "Vercel", logo: "/integrations/vercel.svg", url: "https://vercel.com" },
    { name: "CodeRabbit", logo: "/integrations/coderabbit.svg", url: "https://coderabbit.ai" },
    { name: "Together AI", logo: "/integrations/togetherai.svg", url: "https://together.ai" },
    { name: "Oumi", logo: "/integrations/oumi.png", url: "https://oumi.ai" },
];
