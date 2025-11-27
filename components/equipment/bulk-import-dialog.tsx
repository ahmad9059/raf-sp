"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { useBulkImportEquipment } from "@/hooks/use-equipment";
import { getDepartments } from "@/actions/auth";
import { generateCSVTemplate } from "@/lib/file-parser";
import { BulkImportResult } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type ImportStep = "upload" | "processing" | "results";

export function BulkImportDialog({
  open,
  onOpenChange,
  onSuccess,
}: BulkImportDialogProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkImportMutation = useBulkImportEquipment();

  const [currentStep, setCurrentStep] = useState<ImportStep>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departments, setDepartments] = useState<
    Array<{ id: string; name: string; location: string }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<BulkImportResult | null>(
    null
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // Load departments when dialog opens
  const loadDepartments = useCallback(async () => {
    if (session?.user?.role === "ADMIN") {
      const result = await getDepartments();
      if (result.success && result.data) {
        setDepartments(result.data);
      }
    }
  }, [session?.user?.role]);

  // Reset state when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      loadDepartments();
      setCurrentStep("upload");
      setSelectedFile(null);
      setSelectedDepartment("");
      setIsProcessing(false);
      setProgress(0);
      setImportResults(null);
    }
    onOpenChange(newOpen);
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
    ];

    const isValidType =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".csv");

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const csvContent = generateCSVTemplate();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "equipment_import_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your device.",
    });
  };

  // Process the import
  const handleImport = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import.",
        variant: "destructive",
      });
      return;
    }

    if (session?.user?.role === "ADMIN" && !selectedDepartment) {
      toast({
        title: "Department Required",
        description: "Please select a department for the import.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setCurrentStep("processing");
    setProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append("file", selectedFile);

    if (selectedDepartment) {
      formData.append("departmentId", selectedDepartment);
    }

    bulkImportMutation.mutate(formData, {
      onSuccess: (data) => {
        clearInterval(progressInterval);
        setProgress(100);
        if (data) {
          setImportResults(data);
        }
        setCurrentStep("results");
        onSuccess?.();
      },
      onError: (error) => {
        clearInterval(progressInterval);
        setProgress(0);
        setCurrentStep("upload");
      },
      onSettled: () => {
        setIsProcessing(false);
      },
    });
  };

  // Render upload step
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Import Equipment Data</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a CSV file containing equipment information to bulk import
          records.
        </p>
      </div>

      {/* Department selection for admin users */}
      {session?.user?.role === "ADMIN" && departments.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Department</label>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department for import" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} - {dept.location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* File upload area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

        {selectedFile ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop your file here</p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports CSV files up to 10MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv,application/vnd.ms-excel"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <Button
          variant="outline"
          className="mt-4"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Files
        </Button>
      </div>

      {/* Template download */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="font-medium">Need a template?</p>
          <p className="text-sm text-muted-foreground">
            Download a CSV template with sample data
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => handleOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={
            !selectedFile ||
            (session?.user?.role === "ADMIN" && !selectedDepartment)
          }
        >
          Start Import
        </Button>
      </div>
    </div>
  );

  // Render processing step
  const renderProcessingStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">Processing Import</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we process your file...
        </p>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {progress < 100
            ? `Processing... ${progress}%`
            : "Finalizing import..."}
        </p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{selectedFile.name}</span>
        </div>
      )}
    </div>
  );

  // Render results step
  const renderResultsStep = () => {
    if (!importResults) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {importResults.success ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
            <h3 className="text-lg font-semibold">
              {importResults.success
                ? "Import Successful"
                : "Import Completed with Issues"}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {importResults.success
              ? `All ${importResults.imported} records were imported successfully.`
              : `${importResults.imported} records imported, ${importResults.failed} failed.`}
          </p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {importResults.imported}
            </div>
            <div className="text-sm text-green-700">Successful</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {importResults.failed}
            </div>
            <div className="text-sm text-red-700">Failed</div>
          </div>
        </div>

        {/* Error details */}
        {importResults.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-red-600">Import Errors</h4>
            <div className="max-h-60 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Row</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importResults.errors.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono">
                        {error.row || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm">{error.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep("upload");
              setSelectedFile(null);
              setImportResults(null);
            }}
          >
            Import Another File
          </Button>
          <Button onClick={() => handleOpenChange(false)}>Close</Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Equipment</DialogTitle>
          <DialogDescription>
            Import multiple equipment records from CSV files
          </DialogDescription>
        </DialogHeader>

        {currentStep === "upload" && renderUploadStep()}
        {currentStep === "processing" && renderProcessingStep()}
        {currentStep === "results" && renderResultsStep()}
      </DialogContent>
    </Dialog>
  );
}
