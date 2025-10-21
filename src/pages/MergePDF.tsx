import { useState } from 'react';
import { ArrowLeft, Download, Loader2, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { toast } from '@/hooks/use-toast';

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedFile, setMergedFile] = useState<string | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: 'Not enough files',
        description: 'Please upload at least 2 PDF files to merge',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setMergedFile('merged-document.pdf');
      toast({
        title: 'Success!',
        description: 'Your PDFs have been merged successfully',
      });
    }, 2000);
  };

  const handleDownload = () => {
    toast({
      title: 'Download started',
      description: 'Your merged PDF is being downloaded',
    });
  };

  const resetTool = () => {
    setFiles([]);
    setMergedFile(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Merge PDF</h1>
          <p className="text-lg text-muted-foreground">
            Combine multiple PDF files into a single document
          </p>
        </div>

        {!mergedFile ? (
          <div className="space-y-8">
            {/* File Upload */}
            <FileUpload 
              onFilesChange={setFiles}
              multiple={true}
              maxFiles={10}
            />

            {/* File List with Reorder */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    File Order ({files.length} files)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Drag to reorder files
                  </p>
                </div>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                      <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merge Button */}
            <Button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Merging PDFs...
                </>
              ) : (
                `Merge ${files.length} PDFs`
              )}
            </Button>
          </div>
        ) : (
          // Success State
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Merge Complete!
              </h3>
              <p className="text-muted-foreground">
                Your PDF has been merged successfully
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleDownload}
                size="lg"
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Download Merged PDF
              </Button>
              
              <Button
                onClick={resetTool}
                variant="outline"
                size="lg"
              >
                Merge More Files
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
