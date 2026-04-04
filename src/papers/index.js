export const papers = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    venue: "NeurIPS",
    tags: ["transformers", "nlp", "attention"],
    description: "Introduced the Transformer architecture, replacing RNNs with self-attention mechanisms, revolutionizing NLP.",
    component: () => import("./attention-is-all-you-need/Demo.jsx"),
  }
];
