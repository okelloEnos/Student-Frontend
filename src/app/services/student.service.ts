import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse, PageResponse, Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Generate Excel file
  generateData(numberOfRecords: number): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/generate`,
      { numberOfRecords }
    );
  }

  // Process Excel to CSV
  processExcel(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/process`,
      formData
    );
  }

  // Upload CSV to Database
  uploadCsv(file: File): Observable<ApiResponse<number>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<number>>(
      `${this.apiUrl}/upload`,
      formData
    );
  }

  // Get paginated students with filters
  getStudents(
    page: number,
    size: number,
    studentId?: number,
    studentClass?: string
  ): Observable<ApiResponse<PageResponse<Student>>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (studentId) {
      params = params.set('studentId', studentId.toString());
    }
    if (studentClass && studentClass !== '') {
      params = params.set('studentClass', studentClass);
    }

    return this.http.get<ApiResponse<PageResponse<Student>>>(
      `${this.apiUrl}/report/students`,
      { params }
    );
  }

  // Get distinct classes for dropdown
  getClasses(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.apiUrl}/report/classes`
    );
  }

  // Export to Excel (returns file blob)
  exportExcel(studentId?: number, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) {
      params = params.set('studentId', studentId.toString());
    }
    if (studentClass && studentClass !== '') {
      params = params.set('studentClass', studentClass);
    }
    return this.http.get(
      `${this.apiUrl}/report/export/excel`,
      { params, responseType: 'blob' }
    );
  }

  // Export to CSV (returns file blob)
  exportCsv(studentId?: number, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) {
      params = params.set('studentId', studentId.toString());
    }
    if (studentClass && studentClass !== '') {
      params = params.set('studentClass', studentClass);
    }
    return this.http.get(
      `${this.apiUrl}/report/export/csv`,
      { params, responseType: 'blob' }
    );
  }

  // Export to PDF (returns file blob)
  exportPdf(studentId?: number, studentClass?: string): Observable<Blob> {
    let params = new HttpParams();
    if (studentId) {
      params = params.set('studentId', studentId.toString());
    }
    if (studentClass && studentClass !== '') {
      params = params.set('studentClass', studentClass);
    }
    return this.http.get(
      `${this.apiUrl}/report/export/pdf`,
      { params, responseType: 'blob' }
    );
  }
}