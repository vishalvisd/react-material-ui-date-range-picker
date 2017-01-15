import React, {Component} from "react";
import styles from "./DateRangePicker.css";
import cssModules from "react-css-modules";
import {dateTimeFormat, addMonths, isAfterDate} from "material-ui/DatePicker/dateUtils";
import TextField from "material-ui/TextField";
import moment from "moment-timezone";
import DateRangeSelectorDialog from "./DateRangeSelectorDialog";

function fDate(date){
  return date ? new Date(date) : date;
}

class DateRangePicker extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      rangeStart: fDate(this.props.value[0]),
      rangeEnd: fDate(this.props.value[1]),
      pickerOpen: false,
      firstMonthDay: fDate(this.props.firstMonthDay),
      lastRangeStart: fDate(this.props.value[0]),
      lastRangeEnd: fDate(this.props.value[1])
    };

    this.handleAccept = this.handleAccept.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleChangeRange = this.handleChangeRange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handlePrevMonthClicked = this.handlePrevMonthClicked.bind(this);
    this.handleNextMonthClicked = this.handleNextMonthClicked.bind(this);
    this.handleSetRange = this.handleSetRange.bind(this);
    console.log("%c DateRangePicker Component -> Init ", "background: red; color: white");
  }

  get value() {
    return {
      start: fDate(this.state.rangeStart),
      end: fDate(this.state.rangeEnd)
    };
  }

  getRangeLabelValue(rangeStart, rangeEnd){
    let defaultRangeDateFormat = "ddd, MMM DD";
    if (rangeStart === null){
      return "";
    } else {
      if (this.props.rangeLabelDateFormat){
        return `${moment(rangeStart).format(this.props.rangeLabelDateFormat)} to ${moment(rangeEnd).format(this.props.rangeLabelDateFormat)}`;
      } else {
        return `${moment(rangeStart).format(defaultRangeDateFormat)} to ${moment(rangeEnd).format(defaultRangeDateFormat)}`;
      }
    }
  }

  sanityChangeRangeStartRangeEnd(rangeStart, rangeEnd){
    if (rangeStart === null && rangeEnd !== null){
      return {
        rangeStart: rangeEnd,
        rangeEnd: rangeEnd
      };
    } else {
      return {
        rangeStart: rangeStart,
        rangeEnd: rangeEnd
      };
    }
  }

  componentWillReceiveProps(nextProps){
    if ((nextProps.value[0] !== this.props.value[0])
      || (nextProps.value[1] !== this.props.value[1])
      || (nextProps.firstMonthDay !== this.props.firstMonthDay)){
      this.setState({
        rangeStart: fDate(nextProps.value[0]),
        rangeEnd: fDate(nextProps.value[1]),
        firstMonthDay: fDate(nextProps.firstMonthDay),
        lastRangeStart: fDate(nextProps.value[0]),
        lastRangeEnd: fDate(nextProps.value[1]),
      });
    }
  }

  handleAccept(){
    let selectedRangeStart = this.state.rangeStart;
    let selectedRangeEnd = this.state.rangeEnd;
    if (typeof this.props.onAccept === "function"){
      this.props.onAccept([selectedRangeStart, selectedRangeEnd]);
    }
    let nrs = this.sanityChangeRangeStartRangeEnd(selectedRangeStart, selectedRangeEnd).rangeStart;
    let nre = this.sanityChangeRangeStartRangeEnd(selectedRangeStart, selectedRangeEnd).rangeEnd;
    this.setState({
      pickerOpen: false,
      firstMonthDay: nrs === null ? fDate(this.props.firstMonthDay) : nrs,
      lastRangeStart: nrs,
      lastRangeEnd: nre
    });
  }
  handleCancel(){
    if (typeof this.props.onCancel === "function"){
      this.props.onCancel();
    }
    let nrs = this.sanityChangeRangeStartRangeEnd(this.state.lastRangeStart, this.state.lastRangeEnd).rangeStart;
    let nre = this.sanityChangeRangeStartRangeEnd(this.state.lastRangeStart, this.state.lastRangeEnd).rangeEnd;
    this.setState({
      pickerOpen: false,
      firstMonthDay: nrs === null ? fDate(this.props.firstMonthDay) : nrs,
      rangeStart: nrs,
      rangeEnd: nre
    });
  }
  handleReset(){
    if (typeof this.props.onReset === "function"){
      this.props.onReset();
    }
    let nrs = this.sanityChangeRangeStartRangeEnd(fDate(this.props.value[0]), this.props.value[1]).rangeStart;
    let nre = this.sanityChangeRangeStartRangeEnd(fDate(this.props.value[0]), this.props.value[1]).rangeEnd;
    this.setState({
      rangeStart: nrs,
      rangeEnd: nre
    });
  }

  handleChangeRange(date){
    let nrs = date, nre = date;
    if (this.state.rangeStart !== null &&
      (this.state.rangeEnd === null || (this.state.rangeStart === this.state.rangeEnd))){
      nrs = this.state.rangeStart;
    }

    if (isAfterDate(nrs, nre)){
      nrs = nre;
    }
    nrs = this.sanityChangeRangeStartRangeEnd(nrs, nre).rangeStart;
    nre = this.sanityChangeRangeStartRangeEnd(nrs, nre).rangeEnd;
    this.setState({
      rangeStart: nrs,
      rangeEnd: nre
    });
    if (typeof this.props.onChangeDateRange === "function"){
      this.props.onChangeDateRange(nrs, nre);
    }
  }

  handleSetRange(rangeStart, rangeEnd){
    let newRangeStart = rangeStart,
      newRangeEnd = rangeEnd;
    newRangeStart = this.sanityChangeRangeStartRangeEnd(newRangeStart, newRangeEnd).rangeStart;
    newRangeEnd = this.sanityChangeRangeStartRangeEnd(newRangeStart, newRangeEnd).rangeEnd;
    let setStateObject = {
      rangeStart: newRangeStart,
      rangeEnd: newRangeEnd
    };
    if (this.props.autoClose === true){
      setStateObject.pickerOpen = false;
      setStateObject.firstMonthDay = newRangeStart === null ? fDate(this.props.firstMonthDay): newRangeStart;
      if (typeof this.props.onAccept === "function"){
        this.props.onAccept([newRangeStart, newRangeEnd]);
      }
      this.setState(setStateObject);
    } else {
      if (typeof this.props.onChangeDateRange === "function"){
        this.props.onChangeDateRange(newRangeStart, newRangeEnd);
      }
      this.setState(setStateObject);
    }
  }
  handleFocus(event){
    event.target.blur();
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  }

  handleTouchTap(event){
    if (!this.props.disabled) {
      this.setState({
        pickerOpen: true
      });
    }

    if (typeof this.props.onOpen === "function") {
      this.props.onOpen(event);
    }
  }
  handlePrevMonthClicked(){
    if (typeof this.props.onMonthChange === "function"){
      this.props.onMonthChange(addMonths(this.state.firstMonthDay, 1));
    }
    this.setState({
      firstMonthDay: addMonths(this.state.firstMonthDay, 1)
    });
  }
  handleNextMonthClicked(){
    if (typeof this.props.onMonthChange === "function"){
      this.props.onMonthChange(addMonths(this.state.firstMonthDay, -1));
    }
    this.setState({
      firstMonthDay: addMonths(this.state.firstMonthDay, -1)
    });
  }

  formatRangeDates(ranges){
    if (ranges && ranges.length > 0){
      ranges.forEach((v) => {
        v.range.forEach((v1, i) => {
          v.range[i] = new Date(v1);
        });
      });
      return ranges;
    }
  }

  render() {
    console.log("%c DateRangePicker Component -> Render ", "background: black; color: pink", this.state);
    return (
        <div>
          <TextField
            value={this.getRangeLabelValue(this.state.rangeStart, this.state.rangeEnd)}
            floatingLabelText={this.props.labelText}
            onFocus={this.handleFocus}
            onTouchTap={this.handleTouchTap}
            floatingLabelStyle={{fontWeight: "100"}}
            style={{width: "320"}}
            errorText={this.props.errorText}
          />
          <DateRangeSelectorDialog
            showDialog={this.state.pickerOpen}
            onChange={this.handleChangeRange}
            customRanges={this.formatRangeDates(this.props.customRanges)}
            onAccept={this.handleAccept}
            onCancel={this.handleCancel}
            onReset={this.handleReset}
            okLabel= {this.props.okLabel}
            cancelLabel={this.props.cancelLabel}
            resetLabel={this.props.resetLabel}
            DateTimeFormat={dateTimeFormat}
            animation={this.props.animation}
            rangeStart={this.state.rangeStart}
            rangeEnd={this.state.rangeEnd}
            minDate={fDate(this.props.minDate)}
            maxDate={fDate(this.props.maxDate)}
            noOfCalendars={this.props.noOfCalendars}
            firstDayOfWeek={this.props.firstDayOfWeek}
            locale={this.props.locale}
            style={this.props.dialogStyles}
            onPrevMonthButtonClicked={this.handlePrevMonthClicked}
            onNextMonthButtonClicked={this.handleNextMonthClicked}
            firstMonthDay={this.state.firstMonthDay}
            setRange={this.handleSetRange}
            shouldDisableDate={this.props.shouldDisableDate}
          />
        </div>
    );
  }
}
DateRangePicker.defaultProps = {
  okLabel: "Ok",
  cancelLabel: "Cancel",
  locale: "en-US",
  labelText: "Select Date Range",
  value: [null, null],
  firstDayOfWeek: 1,
  autoClose: false,
  firstMonthDay: new Date(),
  noOfCalendars: 2,
  errorText: null
};
DateRangePicker.propTypes = {
  noOfCalendars: React.PropTypes.number,
  firstDayOfWeek: React.PropTypes.number,
  autoClose: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  labelText: React.PropTypes.string,
  okLabel: React.PropTypes.string,
  cancelLabel: React.PropTypes.string,
  resetLabel: React.PropTypes.string,
  locale: React.PropTypes.string,
  rangeLabelDateFormat: React.PropTypes.string,
  onOpen: React.PropTypes.func,
  onAccept: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onReset: React.PropTypes.func,
  onChangeDateRange: React.PropTypes.func,
  onFocus: React.PropTypes.func,
  onMonthChange: React.PropTypes.func,
  animation: React.PropTypes.func,
  value: React.PropTypes.array,
  customRanges: React.PropTypes.arrayOf(React.PropTypes.shape({
    label: React.PropTypes.string,
    range: React.PropTypes.array
  })),
  minDate: React.PropTypes.any,
  maxDate: React.PropTypes.any,
  firstMonthDay: React.PropTypes.any,
  containerStyle: React.PropTypes.object,
  dialogStyles: React.PropTypes.object,
  shouldDisableDate: React.PropTypes.func,
  errorText: React.PropTypes.string
};

var component4Export = cssModules(DateRangePicker, styles);
export default component4Export;
