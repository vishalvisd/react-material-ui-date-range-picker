//this tweaked calendarmonth will check for startDate and endDate in the enviornment. It will allow
//highlighting of date button if it is either startDate or endDate and light-highlighting of datebutton
//if it is inbetween startDate and endDate
//this startDate and endDate will come from props - and both can be either null or have a date value

import React, {Component} from "react";
import {isBetweenDates, isEqualDate, getWeekArray} from "material-ui/DatePicker/dateUtils";
import DayButton from "material-ui/DatePicker/DayButton";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    fontWeight: 400,
    height: 228,
    lineHeight: 2,
    position: "relative",
    textAlign: "center",
    MozPaddingStart: 0
  },
  week: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 34,
    marginBottom: 2
  }
};

class CalendarMonth extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleTouchTapDay = this.handleTouchTapDay.bind(this);
    this.shouldDisableDate = this.shouldDisableDate.bind(this);
    this.getWeekElements = this.getWeekElements.bind(this);
    this.getDayElements = this.getDayElements.bind(this);
  }
  handleTouchTapDay(event, date){
    if (typeof this.props.onTouchTapDay === "function") {
      this.props.onTouchTapDay(event, date);
    }
  }

  shouldDisableDate(day) {
    if (day === null){
      return false;
    }
    let disabled = !isBetweenDates(day, this.props.minDate, this.props.maxDate);
    if (!disabled && typeof this.props.shouldDisableDate === "function"){
      disabled = this.props.shouldDisableDate(day);
    }
    return disabled;
  }

  getWeekElements() {
    const weekArray = getWeekArray(this.props.displayDate, this.props.firstDayOfWeek);

    return weekArray.map((week, i) => {
      return (
        <div key={i} style={styles.week}>
          {this.getDayElements(week, i)}
        </div>
      );
    }, this);
  }

  getDayElements(week, i) {
    return week.map((day, j) => {
      const isRangeStartDate = isEqualDate(this.props.rangeStart, day);
      const isRangeEndDate = isEqualDate(this.props.rangeEnd, day);
      const disabled = this.shouldDisableDate(day);
      const selected = !disabled && (isRangeStartDate || isRangeEndDate);
      if (day) {
        let buttonBackgroundStyle = {};
        if (this.props.rangeStart !== null && this.props.rangeEnd !== null && isBetweenDates(day, this.props.rangeStart, this.props.rangeEnd)){
          buttonBackgroundStyle = {
            background: "lightblue"
          };
        }
        return (
          <div key={`dbd${(i + j)}`} style={buttonBackgroundStyle}>
            <DayButton
              DateTimeFormat={this.props.DateTimeFormat}
              locale={this.props.locale}
              date={day}
              disabled={disabled}
              key={`db${(i + j)}`}
              onTouchTap={this.handleTouchTapDay}
              selected={selected}
            />
          </div>
        );
      } else {
        return (
          <DayButton
            DateTimeFormat={this.props.DateTimeFormat}
            locale={this.props.locale}
            date={day}
            disabled={disabled}
            key={`db${(i + j)}`}
            onTouchTap={this.handleTouchTapDay}
            selected={selected}
          />
        );
      }

    }, this);
  }

  render() {
    return (
      <div style={styles.root}>
        {this.getWeekElements()}
      </div>
    );
  }
}

CalendarMonth.defaultProps = {};
CalendarMonth.propTypes = {
  DateTimeFormat: React.PropTypes.func.isRequired,
  displayDate: React.PropTypes.object.isRequired,
  firstDayOfWeek: React.PropTypes.number,
  locale: React.PropTypes.string.isRequired,
  maxDate: React.PropTypes.object,
  minDate: React.PropTypes.object,
  onTouchTapDay: React.PropTypes.func,
  rangeStart: React.PropTypes.object.isRequired,
  rangeEnd: React.PropTypes.object.isRequired,
  shouldDisableDate: React.PropTypes.func
};

export default CalendarMonth;
