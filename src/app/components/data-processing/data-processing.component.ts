import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-data-processing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-processing.component.html',
  styleUrl: './data-processing.component.css'
})
export class DataProcessingComponent {

  // Holds the file the user selected
  selectedFile: File | null = null;

  // Controls the loading spinner
  isLoading: boolean = false;

  // Holds the success message (CSV file path)
  result: string = '';

  // Holds the error message
  error: string = '';

  constructor(private studentService: StudentService) { }

  // Captures the file when user selects it
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Extra check — make sure it is an xlsx file
      if (!file.name.toLowerCase().endsWith('.xlsx')) {
        this.error = 'Invalid file type. Please select an Excel file (.xlsx)';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.error = '';
      this.result = '';
    }
  }

  // Sends the file to the backend for processing
  process(): void {

    // should not happen since button is disabled
    if (!this.selectedFile) {
      this.error = 'Please select an Excel file first.';
      return;
    }

    // Clear previous messages
    this.result = '';
    this.error = '';
    this.isLoading = true;

    this.studentService.processExcel(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.result = response.data;
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to process file. Make sure the backend is running.';
        console.error(err);
      }
    });
  }
}