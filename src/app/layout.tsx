import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  title: 'LLM-OS | The Future of AI Computing',
  description: 'An experimental LLM Operating System prototype - GUI shell for natural-language-powered prompt apps',
  keywords: 'LLM, AI, Operating System, Agents, Natural Language Computing',
  authors: [{ name: 'LLM-OS Team' }],
  openGraph: {
    title: 'LLM-OS | The Future of AI Computing',
    description: 'An experimental LLM Operating System prototype',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM-OS | The Future of AI Computing',
    description: 'An experimental LLM Operating System prototype',
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className={`
        min-h-screen bg-background text-foreground font-sans antialiased
        overflow-hidden selection:bg-primary/20 selection:text-foreground
        ${inter.className}
      `}>
        <div id="llm-os-root" className="llm-os-container">
          {children}
        </div>
        <div id="portal-root" />
      </body>
    </html>
  );
}
