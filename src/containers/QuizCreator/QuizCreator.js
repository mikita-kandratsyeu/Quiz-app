import React, {Component} from 'react';
import classes from './QuizCreator.module.css'
import Button from "../../components/UI/Button/Button";
import {createControl, validate, validateForm} from "../../from/formFraemwork";
import Input from "../../components/UI/Input/Input";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Select from "../../components/UI/Select/Select";

function createOptionControl(number) {
  return createControl({
    label: `Вариант ${number}`,
    errorMessage: 'Занчение не может быть пустым',
    id: number,
  }, {
    required: true,
  });
}

function createFormsControls() {
  return {
    question: createControl({
      label: 'Введите вопрос',
      errorMessage: 'Вопрос не может быть пустым'
    }, {
      required: true,
    }),
    option1: createOptionControl(1),
    option2: createOptionControl(2),
    option3: createOptionControl(3),
    option4: createOptionControl(4),
  };
}

class QuizCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: [],
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormsControls(),
    };
  }

  submitHandler = (event) => {
    event.preventDefault();
  }

  addQuestionHandler = (event) => {
    event.preventDefault();

    const quiz = [...this.state.quiz];
    const idx = quiz.length + 1;

    const {question, option1, option2, option3, option4} = this.state.formControls;

    const questionItem = {
      question: question.value,
      id: idx,
      rightAnswerId: this.state.rightAnswerId,
      answers: [
        {text: option1.value, id: option1.id},
        {text: option2.value, id: option2.id},
        {text: option3.value, id: option3.id},
        {text: option4.value, id: option4.id},
      ]
    }

    quiz.push(questionItem);

    this.setState({
      quiz,
      isFormValid: false,
      rightAnswerId: 1,
      formControls: createFormsControls(),
    });
  }

  createQuizHandler = (event) => {
    event.preventDefault();
    //TODO: Server

    console.log(this.state.quiz);
  }

  changeHandler = (value, controlName) => {
    const formControls = {
      ...this.state.formControls,
    };
    const control = {
      ...formControls[controlName],
    };

    control.touched = true;
    control.value = value;
    control.valid = validate(control.value, control.validation);

    formControls[controlName] = control;

    this.setState({
      formControls,
      isFormValid: validateForm(formControls),
    });
  }

  renderControls() {
    return Object.keys(this.state.formControls).map(
      (controlName, idx) => {
        const control = this.state.formControls[controlName];

        return (
          <Auxiliary key={controlName + idx}>
            <Input
              key={idx}
              label={control.label}
              value={control.value}
              valid={control.valid}
              shouldValidate={!!control.validation}
              touched={control.touched}
              errorMessage={control.errorMessage}
              onChange={(event) => this.changeHandler(event.target.value, controlName)}
            />
            {idx === 0 ? <hr/> : null}
          </Auxiliary>
        );
      }
    );
  }

  selectChangeHandler = (event) => {
    this.setState({
      rightAnswerId: +event.target.value,
    });
  }

  render() {
    const select = <Select
      label="Выберете правильный ответ"
      value={this.state.rightAnswerId}
      onChange={this.selectChangeHandler}
      options={[
        {text: 1, value: 1},
        {text: 2, value: 2},
        {text: 3, value: 3},
        {text: 4, value: 4},
      ]}
    />;

    return (
      <div className={classes.quizCreator}>
        <div>
          <h1>Создание теста</h1>
          <form
            onSubmit={this.submitHandler}
          >
            {this.renderControls()}
            {select}
            <Button
              type={'primary'}
              onClick={this.addQuestionHandler}
              disabled={!this.state.isFormValid}
            >
              Добавить вопрос
            </Button>
            <Button
              type={'success'}
              onClick={this.createQuizHandler}
              disabled={this.state.quiz === 0}
            >
              Создать тест
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default QuizCreator;