import React, {Component} from "react";
import styles from "./DateRangeSelector.css";
import cssModules from "react-css-modules";
import RangeCalendar from "./RangeCalendar";
import {addMonths} from "material-ui/DatePicker/dateUtils";
class DateRangeSelector extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleTouhTapDay = this.handleTouhTapDay.bind(this);
    this.getMonth = this.getMonth.bind(this);
    console.log("%c DateRangeSelector Component -> Init ", "background: red; color: white");
  }

  handleTouhTapDay(event, date){
    //todo
    if (typeof this.props.onTouchTap === "function"){
      this.props.onTouchTap(date);
    }
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.rangeStart !== this.props.rangeStart || nextProps.rangeEnd !== this.props.rangeEnd){
      this.setState({
        rangeStart: nextProps.rangeStart,
        rangeEnd: nextProps.rangeEnd
      });
    }
  }

  getMonth(index){
    return addMonths(this.props.firstMonthDay, index);
  }

  render() {
    console.log("%c DateRangeSelector Component -> Render ", "background: black; color: pink");
    return (
        <div className={styles.container}>
          {
            Array(this.props.noOfCalendars).fill("").map((v, i)=>{
              return <div key={i} className={styles.flexContainer}>
                          <RangeCalendar firstDayOfWeek={this.props.firstDayOfWeek}
                               DateTimeFormat={this.props.DateTimeFormat}
                               locale={this.props.locale}
                               rangeStart={this.props.rangeStart}
                               rangeEnd={this.props.rangeEnd}
                               leftmost={i === 0}
                               rightmost={i === (this.props.noOfCalendars-1)}
                               month={this.getMonth(i)}
                               nextMonthHandler={this.props.nextMonthButtonClicked}
                               prevMonthHandler={this.props.prevMonthButtonClicked}
                               maxDate={this.props.maxDate}
                               minDate={this.props.minDate}
                               shouldDisableDate={this.props.shouldDisableDate}
                               onTouchTapDay={(event, date)=>{
                                 this.handleTouhTapDay(event, date);
                               }}
                          />
                    </div>;
            })
          }
        </div>
    );
  }
}
DateRangeSelector.defaultProps = {
  firstDayOfWeek: 1
};
DateRangeSelector.propTypes = {
  DateTimeFormat: React.PropTypes.func.isRequired,
  locale: React.PropTypes.string.isRequired,
  rangeStart: React.PropTypes.object.isRequired,
  rangeEnd: React.PropTypes.object.isRequired,
  onTouchTap: React.PropTypes.func,
  firstDayOfWeek: React.PropTypes.number,
  nextMonthButtonClicked: React.PropTypes.func.isRequired,
  prevMonthButtonClicked: React.PropTypes.func.isRequired,
  noOfCalendars: React.PropTypes.number,
  firstMonthDay: React.PropTypes.object.isRequired,
  maxDate: React.PropTypes.object,
  minDate: React.PropTypes.object,
  shouldDisableDate: React.PropTypes.func
};

var component4Export = cssModules(DateRangeSelector, styles);
export default component4Export;
