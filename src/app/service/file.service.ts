import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() {}
  private saveData(filename: string, data: any): void {
    const directory = 'data'
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;

    // Append the directory path if provided
    const fullPath = directory ? directory + '/' + filename : filename;

    // Create the directory if it doesn't exist
    if (directory) {
      a.setAttribute('webkitdirectory', directory);
      a.setAttribute('directory', directory);
    }

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  saveEventsToFile(events: any[], filename: string): void {
    this.saveData(filename, events);
  }
}
