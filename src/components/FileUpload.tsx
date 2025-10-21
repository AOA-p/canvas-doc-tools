import { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedFiles?: string;
  maxSize?: number;
  multiple?: boolean;
  maxFiles?: number;
}

export function FileUpload({ 
  onFilesChange, 
  acceptedFiles = '.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  maxFiles = 10
}: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: `${file.name} is not a PDF file`,
        variant: 'destructive',
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: `${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  }, [maxSize]);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles = fileArray.filter(validateFile);

    if (!multiple && validFiles.length > 1) {
      toast({
        title: 'Multiple files not allowed',
        description: 'Please select only one file',
        variant: 'destructive',
      });
      return;
    }

    if (files.length + validFiles.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} files allowed`,
        variant: 'destructive',
      });
      return;
    }

    const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, multiple, maxFiles, validateFile, onFilesChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-primary bg-accent' 
            : 'border-border bg-card hover:border-primary/50'
          }
        `}
      >
        <input
          type="file"
          accept={acceptedFiles}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-accent">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-foreground mb-1">
              Drop PDF files here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum file size: {maxSize / (1024 * 1024)}MB • {multiple ? `Up to ${maxFiles} files` : 'Single file only'}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-foreground">
            Uploaded Files ({files.length})
          </h3>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            No files uploaded yet
          </p>
        </div>
      )}
    </div>
  );
}
