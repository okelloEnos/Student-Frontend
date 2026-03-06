import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import saveAs from 'file-saver';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

  // Data
  students: Student[] = [];
  classes: string[] = [];

  // Filters
  filters = {
    studentId: null as number | null,
    studentClass: '' as string
  };

  // Pagination
  pagination = {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  };

  // UI States
  isLoading: boolean = false;
  isExporting: boolean = false;
  error: string = '';

  constructor(private studentService: StudentService) { }


  // On page load — fetch classes and first page
  ngOnInit(): void {
    this.loadClasses();
    this.loadStudents();
  }

  // Fetch distinct class names for dropdown
  loadClasses(): void {
    this.studentService.getClasses().subscribe({
      next: (response) => {
        if (response.success) {
          this.classes = response.data;
        }
      },
      error: (err) => {
        console.error('Failed to load classes', err);
      }
    });
  }

  // Fetch students with current filters + pagination
  loadStudents(): void {
    this.isLoading = true;
    this.error = '';

    this.studentService.getStudents(
      this.pagination.page,
      this.pagination.size,
      this.filters.studentId ?? undefined,
      this.filters.studentClass || undefined
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.students = response.data.content;
          this.pagination.totalElements = response.data.totalElements;
          this.pagination.totalPages = response.data.totalPages;
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load students. Make sure the backend is running.';
        console.error(err);
      }
    });
  }

  // Search — reset to page 0 then load
  search(): void {
    this.pagination.page = 0;
    this.loadStudents();
  }

  // Clear all filters then reload
  clearFilters(): void {
    this.filters.studentId = null;
    this.filters.studentClass = '';
    this.pagination.page = 0;
    this.loadStudents();
  }

  // Pagination — Next page
  nextPage(): void {
    if (this.pagination.page < this.pagination.totalPages - 1) {
      this.pagination.page++;
      this.loadStudents();
    }
  }

  // Pagination — Previous page
  prevPage(): void {
    if (this.pagination.page > 0) {
      this.pagination.page--;
      this.loadStudents();
    }
  }

  // Helper — current page display (1-based)
  get currentPage(): number {
    return this.pagination.page + 1;
  }

  // Helper — starting record number on current page
  get startRecord(): number {
    return this.pagination.page * this.pagination.size + 1;
  }

  // Helper — ending record number on current page
  get endRecord(): number {
    return Math.min(
      (this.pagination.page + 1) * this.pagination.size,
      this.pagination.totalElements
    );
  }

  // Export to Excel
  exportExcel(): void {
    this.isExporting = true;
    this.studentService.exportExcel(
      this.filters.studentId ?? undefined,
      this.filters.studentClass || undefined
    ).subscribe({
      next: (blob) => {
        this.isExporting = false;
        saveAs(blob, 'students_export.xlsx');
      },
      error: (err) => {
        this.isExporting = false;
        this.error = 'Failed to export Excel file.';
        console.error(err);
      }
    });
  }

  // Export to CSV
  exportCsv(): void {
    this.isExporting = true;
    this.studentService.exportCsv(
      this.filters.studentId ?? undefined,
      this.filters.studentClass || undefined
    ).subscribe({
      next: (blob) => {
        this.isExporting = false;
        saveAs(blob, 'students_export.csv');
      },
      error: (err) => {
        this.isExporting = false;
        this.error = 'Failed to export CSV file.';
        console.error(err);
      }
    });
  }

  // Export to PDF
  exportPdf(): void {
    this.isExporting = true;
    this.studentService.exportPdf(
      this.filters.studentId ?? undefined,
      this.filters.studentClass || undefined
    ).subscribe({
      next: (blob) => {
        this.isExporting = false;
        saveAs(blob, 'students_export.pdf');
      },
      error: (err) => {
        this.isExporting = false;
        this.error = 'Failed to export PDF file.';
        console.error(err);
      }
    });
  }
}