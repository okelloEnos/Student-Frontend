import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-data-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-upload.component.html',
  styleUrl: './data-upload.component.css'
})
export class DataUploadComponent {

  // Holds the file the user selected
  selectedFile: File | null = null;

  // Controls the loading spinner
  isLoading: boolean = false;

  // Holds the total records saved count
  totalSaved: number = 0;

  // Controls success message visibility
  success: boolean = false;

  // Holds the error message
  error: string = '';

  constructor(private studentService: StudentService) { }

  // Captures the file when user selects it
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Make sure it is a CSV file
      if (!file.name.toLowerCase().endsWith('.csv')) {
        this.error = 'Invalid file type. Please select a CSV file (.csv)';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.error = '';
      this.success = false;
      this.totalSaved = 0;
    }
  }

  // Sends the CSV file to the backend for upload
  upload(): void {

    if (!this.selectedFile) {
      this.error = 'Please select a CSV file first.';
      return;
    }

    // Clear previous messages
    this.error = '';
    this.success = false;
    this.totalSaved = 0;
    this.isLoading = true;

    this.studentService.uploadCsv(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.success = true;
          this.totalSaved = response.data;
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to upload file. Make sure the backend is running.';
        console.error(err);
      }
    });
  }
}