import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-data-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-generation.component.html',
  styleUrl: './data-generation.component.css'
})
export class DataGenerationComponent {

  // numberOfRecords: number = 1000000;
  numberOfRecords: number | null = null;

  // Controls the loading spinner
  isLoading: boolean = false;

  // Holds the success message (file path returned from backend)
  result: string = '';

  // Holds the error message if something goes wrong
  error: string = '';

  constructor(private studentService: StudentService) { }

  generate(): void {

    // Clear previous messages
    this.result = '';
    this.error = '';

    // Basic validation
    if (!this.numberOfRecords || this.numberOfRecords <= 0) {
      this.error = 'Please enter a valid number of records greater than 0.';
      return;
    }

    // Show loading spinner
    this.isLoading = true;

    // Call the service
    this.studentService.generateData(this.numberOfRecords).subscribe({
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
        this.error = 'Failed to generate data. Make sure the backend is running.';
        console.error(err);
      }
    });
  }
}