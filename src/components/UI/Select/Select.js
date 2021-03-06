import React from "react";
import classes from './Select.module.css';

const Select = (props) => {
  const htmlFor = `${props.label}-${Math.floor(Math.random() * 1000)}`

  return (
    <div className={classes.select}>
      <label htmlFor={htmlFor}>
        {props.label}
      </label>
      <select
        id={htmlFor}
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map((option, idx) => {
          return (
            <option
              key={option.value + idx}
              value={option.value}
            >
              {option.text}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default Select;
