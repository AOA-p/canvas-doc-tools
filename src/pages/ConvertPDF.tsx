import { useState } from 'react';
import { ArrowLeft, Download, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

type ConversionType = 'to-pdf' | 'from-pdf';
type OutputFormat = 'word' | 'excel' | 'powerpoint' | 'image' | 'text';

export default function ConvertPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<ConversionType>('to-pdf');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('word');
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);

  const handleFilesChange = (files: File[]) => {
    setFile(files[0] || null);
  };

  const handleConvert = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please upload a file first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate conversion
    setTimeout(() => {
      setIsProcessing(false);
      setConvertedFile(
        conversionType === 'to-pdf' 
          ? 'converted-document.pdf' 
          : `converted-document.${outputFormat === 'word' ? 'docx' : outputFormat === 'excel' ? 'xlsx' : outputFormat === 'powerpoint' ? 'pptx' : outputFormat === 'image' ? 'png' : 'txt'}`
      );
      toast({
        title: 'Success!',
        description: 'Your file has been converted successfully',
      });
    }, 2000);
  };

  const resetTool = () => {
    setFile(null);
    setConvertedFile(null);
    setIsProcessing(false);
  };

  const getAcceptedFiles = () => {
    if (conversionType === 'to-pdf') {
      return '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt';
    }
    return '.pdf';
  };

  const formatOptions = [
    { value: 'word', label: 'Word Document (.docx)', icon: '📄' },
    { value: 'excel', label: 'Excel Spreadsheet (.xlsx)', icon: '📊' },
    { value: 'powerpoint', label: 'PowerPoint (.pptx)', icon: '📽️' },
    { value: 'image', label: 'Image (.png)', icon: '🖼️' },
    { value: 'text', label: 'Text File (.txt)', icon: '📝' },
  ];

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
          <h1 className="text-4xl font-bold text-foreground mb-4">Convert PDF</h1>
          <p className="text-lg text-muted-foreground">
            Convert files to and from PDF format
          </p>
        </div>

        {!convertedFile ? (
          <div className="space-y-8">
            {/* Conversion Direction */}
            <div className="flex justify-center gap-4">
              <Button
                variant={conversionType === 'to-pdf' ? 'default' : 'outline'}
                onClick={() => {
                  setConversionType('to-pdf');
                  setFile(null);
                }}
                className="flex-1 max-w-xs"
              >
                Convert to PDF
              </Button>
              <Button
                variant={conversionType === 'from-pdf' ? 'default' : 'outline'}
                onClick={() => {
                  setConversionType('from-pdf');
                  setFile(null);
                }}
                className="flex-1 max-w-xs"
              >
                Convert from PDF
              </Button>
            </div>

            {/* Output Format Selection (only for from-pdf) */}
            {conversionType === 'from-pdf' && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Output Format</Label>
                <Select value={outputFormat} onValueChange={(value) => setOutputFormat(value as OutputFormat)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* File Upload */}
            <FileUpload 
              onFilesChange={handleFilesChange}
              multiple={false}
              acceptedFiles={getAcceptedFiles()}
            />

            {/* Conversion Preview */}
            {file && (
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-4">Conversion Preview</h3>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="font-semibold text-foreground">
                      {conversionType === 'to-pdf' 
                        ? file.name.split('.').pop()?.toUpperCase() 
                        : 'PDF'}
                    </p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-primary flex-shrink-0" />
                  
                  <div className="flex-1 text-center p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="font-semibold text-primary">
                      {conversionType === 'to-pdf' 
                        ? 'PDF' 
                        : outputFormat.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{file.name}</span> will be converted to{' '}
                    {conversionType === 'to-pdf' 
                      ? 'PDF format' 
                      : formatOptions.find(f => f.value === outputFormat)?.label}
                  </p>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={!file || isProcessing}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert File'
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
                Conversion Complete!
              </h3>
              <p className="text-muted-foreground">
                Your file has been converted successfully
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
                <span className="text-sm font-medium">{convertedFile}</span>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Download Converted File
              </Button>
              
              <Button
                onClick={resetTool}
                variant="outline"
                size="lg"
              >
                Convert Another File
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
