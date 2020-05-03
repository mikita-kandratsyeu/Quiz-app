import React, {Component} from "react";
import classes from './Quiz.module.css'
import ActiveQuiz from "../../components/ActiveQuiz/ActiveQuiz";
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import axios from '../../axios/axios-quiz';
import Loader from "../../components/UI/Loader/Loader";

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {},
      isFinished: false,
      activeQuestion: 0,
      answersState: null,
      quiz: [],
      loading: true,
    };
  }

  onAnswerClickHandler = (answerId) => {
    if (this.state.answersState) {
      const key = Object.keys(this.state.answersState)[0];
      if (this.state.answersState[key] === 'success') {
        return;
      }
    }

    const question = this.state.quiz[this.state.activeQuestion];
    const results = this.state.results;

    if (question.rightAnswerId === answerId) {
      if (!results[question.id]) {
        results[question.id] = 'success';
      }

      console.log(results)

      this.setState({
        answersState: {
          [answerId]: 'success',
        },
        results,
      })

      const timeout = window.setTimeout(() => {
        if (this.isQuizFinished()) {
          this.setState({
            isFinished: true,
          })
        } else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answersState: null,
          });
        }

        window.clearTimeout(timeout);
      }, 500)

    } else {
      results[question.id] = 'error';
      console.log(results)
      this.setState({
        answersState: {
          [answerId]: 'error',
        },
        results,
      })
    }
  }

  isQuizFinished() {
    return this.state.activeQuestion + 1 === this.state.quiz.length;
  }

  retryHandler = () => {
    this.setState({
      activeQuestion: 0,
      answersState: null,
      isFinished: false,
      results: {},
    })
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`quizes/${this.props.match.params.id}.json`);
      const quiz = response.data;

      this.setState({
        quiz,
        loading: false,
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <div className={classes.quiz}>
        <div className={classes.quizWrapper}>
          <h1>Ответь на все вопросы</h1>
          {
            this.state.loading
              ? <Loader/>
              : this.state.isFinished
              ? <FinishedQuiz
                results={this.state.results}
                quiz={this.state.quiz}
                onRetry={this.retryHandler}
              />
              : <ActiveQuiz
                question={this.state.quiz[this.state.activeQuestion].question}
                answers={this.state.quiz[this.state.activeQuestion].answers}
                onAnswerClick={this.onAnswerClickHandler}
                quizLenght={this.state.quiz.length}
                answerNumber={this.state.activeQuestion + 1}
                state={this.state.answersState}
              />
          }
        </div>
      </div>
    );
  }
}

export default Quiz;
