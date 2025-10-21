import { useState } from 'react';
import { ArrowLeft, Download, Loader2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';

type SplitMode = 'range' | 'all' | 'interval';

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('range');
  const [pageRange, setPageRange] = useState('');
  const [interval, setInterval] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitFiles, setSplitFiles] = useState<string[] | null>(null);
  const [pageCount] = useState(10); // Simulated page count

  const handleFilesChange = (files: File[]) => {
    setFile(files[0] || null);
  };

  const handleSplit = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a PDF file first',
        variant: 'destructive',
      });
      return;
    }

    if (splitMode === 'range' && !pageRange) {
      toast({
        title: 'Invalid range',
        description: 'Please enter a valid page range',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setSplitFiles(['page-1.pdf', 'page-2.pdf', 'page-3.pdf']);
      toast({
        title: 'Success!',
        description: 'Your PDF has been split successfully',
      });
    }, 2000);
  };

  const resetTool = () => {
    setFile(null);
    setSplitFiles(null);
    setPageRange('');
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Split PDF</h1>
          <p className="text-lg text-muted-foreground">
            Split your PDF into multiple files by page ranges
          </p>
        </div>

        {!splitFiles ? (
          <div className="space-y-8">
            {/* File Upload */}
            <FileUpload 
              onFilesChange={handleFilesChange}
              multiple={false}
            />

            {file && (
              <>
                {/* Page Info */}
                <div className="p-4 bg-accent rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pageCount} pages total
                      </p>
                    </div>
                  </div>
                </div>

                {/* Split Options */}
                <div className="space-y-6">
                  <Label className="text-base font-semibold">Split Method</Label>
                  
                  <RadioGroup value={splitMode} onValueChange={(value) => setSplitMode(value as SplitMode)}>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="range" id="range" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="range" className="font-medium cursor-pointer">
                            Page Ranges
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enter page ranges separated by commas (e.g., 1-3, 5-7, 9)
                          </p>
                          {splitMode === 'range' && (
                            <Input
                              placeholder="e.g., 1-3, 5-7, 9-10"
                              value={pageRange}
                              onChange={(e) => setPageRange(e.target.value)}
                              className="mt-3"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="all" id="all" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="all" className="font-medium cursor-pointer">
                            Extract All Pages
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Split into individual pages (one PDF per page)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="interval" id="interval" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="interval" className="font-medium cursor-pointer">
                            Split by Interval
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Split every N pages
                          </p>
                          {splitMode === 'interval' && (
                            <Input
                              type="number"
                              min="1"
                              placeholder="e.g., 2"
                              value={interval}
                              onChange={(e) => setInterval(e.target.value)}
                              className="mt-3 w-32"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Split Button */}
            <Button
              onClick={handleSplit}
              disabled={!file || isProcessing}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Splitting PDF...
                </>
              ) : (
                'Split PDF'
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
                Split Complete!
              </h3>
              <p className="text-muted-foreground">
                Your PDF has been split into {splitFiles.length} files
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              {splitFiles.map((fileName, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{fileName}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Download All (ZIP)
              </Button>
              
              <Button
                onClick={resetTool}
                variant="outline"
                size="lg"
              >
                Split Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
