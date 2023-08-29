import {Component, Signal, signal} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Observable} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent {
  questions$!: Observable<Question[]>;
  readonly categories: Signal<Category[]>;
  readonly selectedCategory = signal<Category | null>(null)
  readonly selectedSubCategory = signal<Category | null>(null)

  constructor(protected quizService: QuizService) {
    this.categories = toSignal(quizService.getAllCategories(), {initialValue: []})
  }

  createQuiz(difficulty: string): void {
    const selectedCategory = this.selectedCategory()
    const quizCategory = this.selectedSubCategory() ?? (
      selectedCategory?.categories ? null : selectedCategory
    )
    if (quizCategory) {
      this.questions$ = this.quizService.createQuiz(quizCategory.id, difficulty as Difficulty)
    }
  }

  selectCategory(categoryId: number) {
    this.selectedSubCategory.set(null)
    this.selectedCategory.set(
      this.categories()?.find(
        category => category.id === categoryId
      ) ?? null
    )
  }

  selectSubCategory(categoryId: number) {
    this.selectedSubCategory.set(
      this.selectedCategory()?.categories?.find(
        category => category.id === categoryId
      ) ?? null
    )
  }
}
