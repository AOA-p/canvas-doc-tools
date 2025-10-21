import { useState } from 'react';
import { ArrowLeft, Download, Loader2, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

type CompressionLevel = 'low' | 'medium' | 'high';

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<{
    originalSize: number;
    compressedSize: number;
    savings: number;
  } | null>(null);

  const handleFilesChange = (files: File[]) => {
    setFile(files[0] || null);
  };

  const getEstimatedSize = () => {
    if (!file) return 0;
    
    const reductionRate = {
      low: 0.15,
      medium: 0.35,
      high: 0.55,
    };

    return file.size * (1 - reductionRate[compressionLevel]);
  };

  const getQualityImpact = () => {
    const impacts = {
      low: { text: 'Minimal', color: 'text-green-600' },
      medium: { text: 'Moderate', color: 'text-yellow-600' },
      high: { text: 'Noticeable', color: 'text-orange-600' },
    };
    return impacts[compressionLevel];
  };

  const handleCompress = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a PDF file first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate compression
    setTimeout(() => {
      const estimatedSize = getEstimatedSize();
      const savings = ((file.size - estimatedSize) / file.size) * 100;

      setIsProcessing(false);
      setCompressedFile({
        originalSize: file.size,
        compressedSize: estimatedSize,
        savings: savings,
      });
      
      toast({
        title: 'Success!',
        description: `File compressed by ${savings.toFixed(0)}%`,
      });
    }, 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const resetTool = () => {
    setFile(null);
    setCompressedFile(null);
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Compress PDF</h1>
          <p className="text-lg text-muted-foreground">
            Reduce your PDF file size while maintaining quality
          </p>
        </div>

        {!compressedFile ? (
          <div className="space-y-8">
            {/* File Upload */}
            <FileUpload 
              onFilesChange={handleFilesChange}
              multiple={false}
            />

            {file && (
              <>
                {/* Compression Level */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Compression Level</Label>
                  
                  <RadioGroup 
                    value={compressionLevel} 
                    onValueChange={(value) => setCompressionLevel(value as CompressionLevel)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="low" id="low" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="low" className="font-medium cursor-pointer">
                            Low Compression
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Smaller size reduction, better quality • ~15% smaller
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="medium" id="medium" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="medium" className="font-medium cursor-pointer">
                            Medium Compression (Recommended)
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Balanced size and quality • ~35% smaller
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                        <RadioGroupItem value="high" id="high" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="high" className="font-medium cursor-pointer">
                            High Compression
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Maximum compression, lower quality • ~55% smaller
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Size Comparison Preview */}
                <div className="p-6 bg-card border border-border rounded-lg space-y-4">
                  <h3 className="font-semibold text-foreground">Size Preview</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Original Size</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Size</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatFileSize(getEstimatedSize())}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reduction</span>
                      <span className="font-semibold text-primary">
                        {(((file.size - getEstimatedSize()) / file.size) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={((file.size - getEstimatedSize()) / file.size) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quality Impact</span>
                      <span className={`text-sm font-medium ${getQualityImpact().color}`}>
                        {getQualityImpact().text}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Compress Button */}
            <Button
              onClick={handleCompress}
              disabled={!file || isProcessing}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Compressing PDF...
                </>
              ) : (
                'Compress PDF'
              )}
            </Button>
          </div>
        ) : (
          // Success State
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingDown className="w-10 h-10 text-primary" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Compression Complete!
              </h3>
              <p className="text-muted-foreground">
                Your PDF has been compressed by {compressedFile.savings.toFixed(0)}%
              </p>
            </div>

            {/* Results Card */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Original</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatFileSize(compressedFile.originalSize)}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Compressed</p>
                  <p className="text-xl font-bold text-primary">
                    {formatFileSize(compressedFile.compressedSize)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <TrendingDown className="w-5 h-5" />
                  <span className="text-2xl font-bold">
                    {compressedFile.savings.toFixed(0)}% smaller
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Saved {formatFileSize(compressedFile.originalSize - compressedFile.compressedSize)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Download Compressed PDF
              </Button>
              
              <Button
                onClick={resetTool}
                variant="outline"
                size="lg"
              >
                Compress Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
