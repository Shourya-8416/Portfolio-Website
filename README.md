# Shourya Mishra | Portfolio

A modern, responsive portfolio website built with Next.js 14, React 18, and Tailwind CSS. Features smooth animations powered by Framer Motion and an interactive custom cursor.

## Features

- Next.js 14 with App Router
- Tailwind CSS styling
- Framer Motion animations
- Responsive design
- Custom cursor effects (Blobity)
- Contact form with EmailJS
- Vercel Analytics & Speed Insights

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your EmailJS credentials:
```env
NEXT_PUBLIC_SERVICE_ID=your_service_id
NEXT_PUBLIC_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_PUBLIC_KEY=your_public_key
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/
│   ├── components/
│   │   ├── about-section/
│   │   ├── contact+footer/
│   │   ├── header-section/
│   │   ├── hero-section/
│   │   ├── ui/
│   │   └── work-section/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── contexts/
│   └── ViewContext.tsx
├── public/
└── utils/
    └── blobity.config.ts
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

## Customization

- **Projects:** Edit `app/components/work-section/Works.tsx`
- **Experience:** Edit `app/components/work-section/Timeline.tsx`
- **About/Skills:** Edit `app/components/about-section/About.tsx`
- **Social Links:** Edit `app/components/header-section/Header.tsx`
- **Metadata/SEO:** Edit `app/layout.tsx`

## License

MIT License
