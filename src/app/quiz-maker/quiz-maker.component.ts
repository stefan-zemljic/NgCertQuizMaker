import {Component, OnDestroy, Signal, signal} from '@angular/core';
import {Category, Difficulty, Question} from '../data.models';
import {QuizService} from '../quiz.service';
import {Subscription, take} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: 'app-quiz-maker',
    templateUrl: './quiz-maker.component.html',
    styleUrls: ['./quiz-maker.component.css']
})
export class QuizMakerComponent implements OnDestroy {
    questions: Question[] = [];
    readonly categories: Signal<Category[]>;
    readonly selectedCategory = signal<Category | null>(null)
    readonly selectedSubCategory = signal<Category | null>(null)
    canChangeQuestion = true
    quizCategory!: Category
    quizDifficulty!: Difficulty

    createQuizSub?: Subscription

    constructor(protected quizService: QuizService) {
        this.categories = toSignal(quizService.getAllCategories(), {initialValue: []})
    }

    ngOnDestroy() {
        this.createQuizSub?.unsubscribe()
    }

    createQuiz(difficulty: string): void {
        const selectedCategory = this.selectedCategory()
        const quizCategory = this.selectedSubCategory() ?? (
            selectedCategory?.categories ? null : selectedCategory
        )
        if (quizCategory && ["Easy", "Medium", "Hard"].includes(difficulty)) {
            this.canChangeQuestion = true
            this.quizCategory = quizCategory
            this.quizDifficulty = difficulty as Difficulty
            this.createQuizSub?.unsubscribe()
            this.createQuizSub = this.quizService.createQuiz(
                quizCategory.id,
                difficulty as Difficulty
            ).pipe(take(1)).subscribe(
                (questions) => {
                    this.questions = questions
                    this.createQuizSub?.unsubscribe()
                    this.createQuizSub = undefined
                }
            )
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

    changeQuestion(index: number): void {
        this.canChangeQuestion = false
        this.createQuizSub?.unsubscribe()
        this.createQuizSub = this.quizService.createQuiz(this.quizCategory.id, this.quizDifficulty, 1).pipe(
            take(1)).subscribe(([question]) => {
                this.questions = [
                    ...this.questions.slice(0, index),
                    question,
                    ...this.questions.slice(index + 1)
                ]
                this.createQuizSub?.unsubscribe()
                this.createQuizSub = undefined
            }
        )
    }
}
