import {Component} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {BehaviorSubject, combineLatest, Observable, Subject, take} from 'rxjs';
import {QuizService} from '../quiz.service';

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {
  labelSelectCategory = 'Select category'
  labelSelectSubCategory = 'Select subcategory'
  categories$: Observable<Category[]>;
  questions$!: Observable<Question[]>;
  selectedCategory$: Subject<Category | null> = new BehaviorSubject<Category | null>(null);
  selectedSubCategory$: Subject<Category | null> = new BehaviorSubject<Category | null>(null);

  constructor(protected quizService: QuizService) {
    this.categories$ = quizService.getGroupedCategories()
  }

  createQuiz(difficulty: string): void {
    combineLatest([
      this.selectedSubCategory$,
      this.selectedCategory$,
    ]).pipe(take(1))
      .subscribe(([subCategory, category]) => {
        if (subCategory) {
          this.questions$ = this.quizService.createQuiz(subCategory.id, difficulty as Difficulty);
        } else if (category && !category.categories) {
          this.questions$ = this.quizService.createQuiz(category.id, difficulty as Difficulty);
        }
      })
  }

  public categoryChanged(cat: string) {
    this.selectedSubCategory$.next(null)
    if (cat !== this.labelSelectCategory) {
      this.categories$.pipe(take(1))
        .subscribe((categories) => {
          const catId = Number.parseInt(cat)
          const selectedCategory = categories.find(
            (category) => category.id === catId
          )
          if (selectedCategory) {
            this.selectedCategory$.next(selectedCategory)
          }
        })
    } else {
      this.selectedCategory$.next(null)
    }
  }

  public subCategoryChanged(cat: string) {
    if (cat !== this.labelSelectSubCategory) {
      this.selectedCategory$.pipe(take(1))
        .subscribe((category) => {
          const catId = Number.parseInt(cat)
          const selectedCategory = category?.categories?.find(
            (category) => category.id === catId
          )
          if (selectedCategory) {
            this.selectedSubCategory$.next(selectedCategory)
          }
        })
    } else {
      this.selectedSubCategory$.next(null)
    }
  }
}
