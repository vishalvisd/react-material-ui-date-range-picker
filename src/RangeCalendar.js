//this tweaked class will give a datedisplay, monthtoolbar, and calendarmonth
import React, {Component} from "react";
import EventListener from "react-event-listener";
import transitions from "material-ui/styles/transitions";
import CalendarMonth from "./CalendarMonth";
import SlideInTransitionGroup from "material-ui/internal/SlideIn";
import IconButton from "material-ui/IconButton";
import NavigationChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import NavigationChevronRight from "material-ui/svg-icons/navigation/chevron-right";

import {
  getFirstDayOfMonth,
  localizedWeekday,
  addYears
} from "material-ui/DatePicker/dateUtils";

const daysInWeek = 7;
const daysArray = [...Array(daysInWeek)];

class Calendar extends Component {
  constructor(props, context) {
    super(props, context);
    this.setDisplayDate = this.setDisplayDate.bind(this);
    this.handleTouchTapDay = this.handleTouchTapDay.bind(this);
  }
  componentWillMount() {
    this.setState({
      displayDate: getFirstDayOfMonth(this.props.month)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.month !== this.props.month) {
      const date = nextProps.month || new Date();
      this.setDisplayDate(date);
    }
  }

  setDisplayDate(date) {
    const newDisplayDate = getFirstDayOfMonth(date);
    let direction;
    if (newDisplayDate > this.state.displayDate){
      direction = "left";
    } else {
      direction = "right";
    }
    if (newDisplayDate !== this.state.displayDate) {
      this.setState({
        displayDate: newDisplayDate,
        transitionDirection: direction
      });
    }
  }

  handleTouchTapDay(event, date){
    if (typeof this.props.onTouchTapDay === "function") {
      this.props.onTouchTapDay(event, date);
    }
  }
//todo (vishal) for keyboard events
  handleWindowKeyDown(){
    return;
  }
  // handleWindowKeyDown(event) {
  //   switch (keycode(event)) {
  //     case "up":
  //       if (event.altKey && event.shiftKey) {
  //         this.addSelectedYears(-1);
  //       } else if (event.shiftKey) {
  //         this.addSelectedMonths(-1);
  //       } else {
  //         this.addSelectedDays(-7);
  //       }
  //       break;
  //
  //     case "down":
  //       if (event.altKey && event.shiftKey) {
  //         this.addSelectedYears(1);
  //       } else if (event.shiftKey) {
  //         this.addSelectedMonths(1);
  //       } else {
  //         this.addSelectedDays(7);
  //       }
  //       break;
  //
  //     case "right":
  //       if (event.altKey && event.shiftKey) {
  //         this.addSelectedYears(1);
  //       } else if (event.shiftKey) {
  //         this.addSelectedMonths(1);
  //       } else {
  //         this.addSelectedDays(1);
  //       }
  //       break;
  //
  //     case "left":
  //       if (event.altKey && event.shiftKey) {
  //         this.addSelectedYears(-1);
  //       } else if (event.shiftKey) {
  //         this.addSelectedMonths(-1);
  //       } else {
  //         this.addSelectedDays(-1);
  //       }
  //       break;
  //   }
  // }

  render() {
    const {prepareStyles} = this.context.muiTheme;
    const {calendarTextColor} = this.context.muiTheme.datePicker;

    const styles = {
      root: {
        color: calendarTextColor,
        userSelect: "none",
        width: 310
      },
      root1: {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "inherit",
        height: 48
      },
      calendar: {
        display: "flex",
        flexDirection: "column"
      },
      calendarContainer: {
        display: "flex",
        alignContent: "space-between",
        justifyContent: "space-between",
        flexDirection: "column",
        fontSize: 12,
        fontWeight: 400,
        padding: "0px 8px",
        transition: transitions.easeOut()
      },
      yearContainer: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: 272,
        marginTop: 10,
        overflow: "hidden",
        width: 310
      },
      weekTitle: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        fontWeight: "500",
        height: 20,
        lineHeight: "15px",
        opacity: "0.5",
        textAlign: "center"
      },
      weekTitleDay: {
        width: 42
      },
      transitionSlide: {
        height: 214
      },
      titleDiv: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        width: "100%"
      },
      titleText: {
        height: "inherit",
        paddingTop: 12
      }
    };

    const weekTitleDayStyle = prepareStyles(styles.weekTitleDay);

    const dateTimeFormatted = new this.props.DateTimeFormat(this.props.locale, {
      month: "long",
      year: "numeric"
    }).format(this.state.displayDate);

    return (
      <div style={prepareStyles(styles.root)}>
        <EventListener
          target="window"
          onKeyDown={this.handleWindowKeyDown}
        />
        <div style={prepareStyles(styles.calendar)}>
          <div style={prepareStyles(styles.calendarContainer)}>
            <div style={styles.root1}>
              {
                this.props.leftmost === true ? 
                  <IconButton
                    onTouchTap={this.props.prevMonthHandler}>
                  <NavigationChevronLeft />
                </IconButton> : <IconButton disabled={true}></IconButton>
              }
            <SlideInTransitionGroup
              direction={this.state.transitionDirection}
              style={styles.titleDiv}
            >
              <div key={dateTimeFormatted} style={styles.titleText}>
                {dateTimeFormatted}
              </div>
            </SlideInTransitionGroup>
              {
                this.props.rightmost === true ?
                  <IconButton
                    onTouchTap={this.props.nextMonthHandler}>
                    <NavigationChevronRight />
                  </IconButton> : " "
              }
              </div>
            <div style={prepareStyles(styles.weekTitle)}>
              {daysArray.map((event, i) => (
                <span key={i} style={weekTitleDayStyle}>
                    {localizedWeekday(this.props.DateTimeFormat, this.props.locale, i, this.props.firstDayOfWeek)}
                  </span>
              ))}
            </div>
            <SlideInTransitionGroup direction={this.state.transitionDirection} style={styles.transitionSlide}>
              <CalendarMonth
                DateTimeFormat={this.props.DateTimeFormat}
                locale={this.props.locale}
                displayDate={this.state.displayDate}
                firstDayOfWeek={this.props.firstDayOfWeek}
                key={this.state.displayDate.toDateString()}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                onTouchTapDay={this.handleTouchTapDay}
                rangeStart={this.props.rangeStart}
                rangeEnd={this.props.rangeEnd}
                shouldDisableDate={this.props.shouldDisableDate}
              />
            </SlideInTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}
Calendar.defaultProps = {
  minDate: addYears(new Date(), -1*100),
  maxDate: addYears(new Date(), 100),
  leftmost: false,
  rightmost: false
};
Calendar.propTypes = {
  DateTimeFormat: React.PropTypes.func.isRequired,
  disableYearSelection: React.PropTypes.bool,
  firstDayOfWeek: React.PropTypes.number,
  locale: React.PropTypes.string.isRequired,
  maxDate: React.PropTypes.object,
  minDate: React.PropTypes.object,
  onTouchTapDay: React.PropTypes.func,
  shouldDisableDate: React.PropTypes.func,
  rangeStart: React.PropTypes.object.isRequired,
  rangeEnd: React.PropTypes.object.isRequired,
  leftmost: React.PropTypes.bool,
  rightmost: React.PropTypes.bool,
  prevMonthHandler: React.PropTypes.func,
  nextMonthHandler: React.PropTypes.func,
  month: React.PropTypes.object
};

Calendar.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};

export default Calendar;
