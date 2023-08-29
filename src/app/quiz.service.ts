import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ApiQuestion, Category, Difficulty, Question, Results} from './data.models';
import {groupCategories} from "./group-categories.function";

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private API_URL = "https://opentdb.com/";
  private latestResults!: Results;

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<{ trivia_categories: Category[] }>(this.API_URL + "api_category.php").pipe(
      map(res => res.trivia_categories),
      map(groupCategories)
    )
  }

  createQuiz(categoryId: number, difficulty: Difficulty, questionCount: number = 5): Observable<Question[]> {
    return this.http.get<{ results: ApiQuestion[] }>(
      `${this.API_URL}/api.php?amount=${questionCount}&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`)
      .pipe(
        map(res => {
          const quiz: Question[] = res.results.map(q => (
            {...q, all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => (Math.random() > 0.5) ? 1 : -1)}
          ));
          return quiz;
        })
      );
  }

  computeScore(questions: Question[], answers: string[]): void {
    let score = 0;
    questions.forEach((q, index) => {
      if (q.correct_answer == answers[index])
        score++;
    })
    this.latestResults = {questions, answers, score};
  }

  getLatestResults(): Results {
    return this.latestResults;
  }
}
