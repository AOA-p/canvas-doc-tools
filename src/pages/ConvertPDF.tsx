import { useState } from 'react';
import { ArrowLeft, Download, Loader2, ArrowRight, FileText, Sheet, Presentation, Image as ImageIcon, FileUp, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/FileUpload';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

type ConversionFormat = 'pdf-to-word' | 'pdf-to-excel' | 'pdf-to-powerpoint' | 'pdf-to-jpg' | 'word-to-pdf' | 'jpg-to-pdf';
type ImageQuality = 'low' | 'medium' | 'high';

export default function ConvertPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [conversionFormat, setConversionFormat] = useState<ConversionFormat>('pdf-to-word');
  const [imageQuality, setImageQuality] = useState<ImageQuality>('high');
  const [jpgQuality, setJpgQuality] = useState<number[]>([90]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);

  const conversionOptions = [
    // PDF to other formats
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Convert PDF to editable Word document',
      icon: FileText,
      from: 'PDF',
      to: 'DOCX',
      category: 'from-pdf',
      acceptedFiles: '.pdf',
      multiple: false,
      outputExt: '.docx',
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Extract tables and data to Excel spreadsheet',
      icon: Sheet,
      from: 'PDF',
      to: 'XLSX',
      category: 'from-pdf',
      acceptedFiles: '.pdf',
      multiple: false,
      outputExt: '.xlsx',
      warning: 'Best results with PDFs containing tables',
    },
    {
      id: 'pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      description: 'Convert PDF pages to PowerPoint slides',
      icon: Presentation,
      from: 'PDF',
      to: 'PPTX',
      category: 'from-pdf',
      acceptedFiles: '.pdf',
      multiple: false,
      outputExt: '.pptx',
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert each PDF page to JPG images',
      icon: ImageIcon,
      from: 'PDF',
      to: 'JPG',
      category: 'from-pdf',
      acceptedFiles: '.pdf',
      multiple: false,
      outputExt: '.jpg',
      hasQualitySettings: true,
    },
    // Other formats to PDF
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      description: 'Convert Word documents to PDF',
      icon: FileText,
      from: 'DOCX',
      to: 'PDF',
      category: 'to-pdf',
      acceptedFiles: '.doc,.docx',
      multiple: false,
      outputExt: '.pdf',
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Combine multiple images into one PDF',
      icon: ImageIcon,
      from: 'JPG',
      to: 'PDF',
      category: 'to-pdf',
      acceptedFiles: '.jpg,.jpeg,.png',
      multiple: true,
      outputExt: '.pdf',
      warning: 'You can upload multiple images',
    },
  ];

  const selectedOption = conversionOptions.find(opt => opt.id === conversionFormat)!;

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please upload at least one file',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    // Simulate conversion
    setTimeout(() => {
      setIsProcessing(false);
      const fileName = conversionFormat === 'jpg-to-pdf' && files.length > 1
        ? 'merged-images.pdf'
        : `converted-${files[0].name.split('.')[0]}${selectedOption.outputExt}`;
      setConvertedFile(fileName);
      toast({
        title: 'Conversion complete!',
        description: `Successfully converted to ${selectedOption.to}`,
      });
    }, 2500);
  };

  const resetTool = () => {
    setFiles([]);
    setConvertedFile(null);
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Convert PDF</h1>
          <p className="text-lg text-muted-foreground">
            Convert files to and from PDF format
          </p>
        </div>

        {!convertedFile ? (
          <div className="space-y-8">
            {/* Conversion Format Selection */}
            <TooltipProvider>
              <div className="space-y-6">
                {/* PDF to Other Formats */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Convert PDF to:</h3>
                  <RadioGroup value={conversionFormat} onValueChange={(value) => {
                    setConversionFormat(value as ConversionFormat);
                    setFiles([]);
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {conversionOptions.filter(opt => opt.category === 'from-pdf').map((option) => (
                        <Tooltip key={option.id}>
                          <TooltipTrigger asChild>
                            <label
                              htmlFor={option.id}
                              className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                                conversionFormat === option.id ? 'border-primary bg-primary/5' : 'border-border'
                              }`}
                            >
                              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <option.icon className="w-5 h-5 text-primary" />
                                  <span className="font-semibold text-foreground">{option.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                {option.warning && (
                                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-600">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{option.warning}</span>
                                  </div>
                                )}
                              </div>
                            </label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Converts {option.from} files to {option.to} format</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Other Formats to PDF */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Convert to PDF:</h3>
                  <RadioGroup value={conversionFormat} onValueChange={(value) => {
                    setConversionFormat(value as ConversionFormat);
                    setFiles([]);
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {conversionOptions.filter(opt => opt.category === 'to-pdf').map((option) => (
                        <Tooltip key={option.id}>
                          <TooltipTrigger asChild>
                            <label
                              htmlFor={option.id}
                              className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                                conversionFormat === option.id ? 'border-primary bg-primary/5' : 'border-border'
                              }`}
                            >
                              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <option.icon className="w-5 h-5 text-primary" />
                                  <span className="font-semibold text-foreground">{option.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                                {option.warning && (
                                  <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{option.warning}</span>
                                  </div>
                                )}
                              </div>
                            </label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Converts {option.from} files to {option.to} format</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </TooltipProvider>

            {/* Quality Settings for Image Conversions */}
            {selectedOption.hasQualitySettings && (
              <div className="p-6 bg-card border border-border rounded-lg space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Image Quality</Label>
                  <RadioGroup value={imageQuality} onValueChange={(value) => setImageQuality(value as ImageQuality)}>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low" className="cursor-pointer">Low (Smaller file)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high" className="cursor-pointer">High (Best quality)</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">JPG Quality: {jpgQuality[0]}%</Label>
                  <Slider
                    value={jpgQuality}
                    onValueChange={setJpgQuality}
                    min={50}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Smaller size</span>
                    <span>Better quality</span>
                  </div>
                </div>
              </div>
            )}

            {/* File Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Upload {selectedOption.multiple ? 'Files' : 'File'}
              </Label>
              <FileUpload 
                onFilesChange={handleFilesChange}
                multiple={selectedOption.multiple}
                acceptedFiles={selectedOption.acceptedFiles}
                maxFiles={selectedOption.multiple ? 20 : 1}
              />
              {selectedOption.multiple && files.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected. Files will be merged in the order shown.
                </p>
              )}
            </div>

            {/* Conversion Preview */}
            {files.length > 0 && (
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileUp className="w-5 h-5" />
                  Conversion Preview
                </h3>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="flex-1 text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="font-semibold text-foreground text-lg">{selectedOption.from}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {files.length} file{files.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-primary flex-shrink-0" />
                  
                  <div className="flex-1 text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="font-semibold text-primary text-lg">{selectedOption.to}</p>
                    {selectedOption.hasQualitySettings && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Quality: {imageQuality} ({jpgQuality[0]}%)
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-accent rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {files.length === 1 ? (
                      <>
                        <span className="font-medium text-foreground">{files[0].name}</span> will be converted to {selectedOption.to} format
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-foreground">{files.length} files</span> will be merged and converted to {selectedOption.to}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting to {selectedOption.to}...
                </>
              ) : (
                <>
                  Convert to {selectedOption.to}
                </>
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
