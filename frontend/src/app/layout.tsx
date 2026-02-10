import React from 'react';
import Sidebar from '@/components/Sidebar';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="antialiased bg-[#F8FAFC]">
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Sidebar inteligente: ela sabe onde está pela URL */}
          <Sidebar /> 
          
          <main className="flex-1 md:ml-64 pb-24 md:pb-0 transition-all duration-300">
            <div className="max-w-5xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}