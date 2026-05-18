import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    title: "Claude API Access",
    category: "API",
    description: "Access to Claude AI API",
    salePrice: 99,
    originalPrice: 149,
    discount: 35,
    warranty: "Lifetime",
    rating: 4.9,
    sales: 430,
    status: "featured",
  },

  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    title: "Next.js SaaS Template",
    category: "Template",
    description: "Fullstack SaaS starter kit",
    salePrice: 79,
    originalPrice: 120,
    discount: 20,
    warranty: "Lifetime",
    rating: 4.8,
    sales: 210,
    status: "new",
  },

  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    title: "AI Automation Pack",
    category: "Automation",
    description: "Ready-to-use AI workflows",
    salePrice: 59,
    originalPrice: 89,
    discount: 15,
    warranty: "6 months",
    rating: 4.7,
    sales: 180,
    status: "featured",
  },

  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    title: "React UI Kit Pro",
    category: "UI Kit",
    description: "Modern dashboard components",
    salePrice: 49,
    originalPrice: 70,
    discount: 10,
    warranty: "Lifetime",
    rating: 4.6,
    sales: 95,
    status: "new",
  },

  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    title: "ChatGPT Prompt Bundle",
    category: "Prompts",
    description: "500+ marketing prompts",
    salePrice: 29,
    originalPrice: 49,
    discount: 25,
    warranty: "Lifetime",
    rating: 4.8,
    sales: 520,
    status: "featured",
  },
];