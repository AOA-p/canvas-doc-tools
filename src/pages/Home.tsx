import { Link } from 'react-router-dom';
import { Layers, Scissors, Minimize2, FileType } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tools = [
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one',
    icon: Layers,
    path: '/merge',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Split PDF into multiple files',
    icon: Scissors,
    path: '/split',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: Minimize2,
    path: '/compress',
    color: 'from-violet-500 to-violet-600',
  },
  {
    id: 'convert',
    name: 'Convert PDF',
    description: 'Convert to/from PDF format',
    icon: FileType,
    path: '/convert',
    color: 'from-purple-500 to-purple-600',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PDFSuite</h1>
              <p className="text-sm text-muted-foreground">All-in-One PDF Tools</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Professional PDF Tools
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Merge, split, compress, and convert your PDF files with ease. 
            All tools are free and work directly in your browser.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} to={tool.path}>
                  <Card className="group p-6 h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
                    <div className="flex flex-col items-start gap-4 h-full">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                      
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        Use Tool
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 PDFSuite. All rights reserved. Process files securely in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
}
