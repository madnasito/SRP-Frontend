import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category/category';
import { Category } from '../../core/interfaces/category/category';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.debug';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  categories: Category[] = [];
  chunkedCategories: Category[][] = [];
  loading = true;
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(c => {
          let url = c.imageUrl;
          if (url && !url.startsWith('http')) {
            const apiBase = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
            const imagePath = url.startsWith('/') ? url : `/${url}`;
            url = `${apiBase}${imagePath}`;
          }
          return { ...c, imageUrl: url };
        });
        this.chunkedCategories = this.chunkArray(this.categories, 3);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/category', categoryId]);
  }

  private chunkArray(array: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}
