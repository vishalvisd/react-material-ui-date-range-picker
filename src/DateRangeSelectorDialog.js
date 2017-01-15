import React, {Component} from "react";
import EventListener from "react-event-listener";
import Popover from "material-ui/Popover";
import PopoverAnimationVertical from "material-ui/Popover/PopoverAnimationVertical";
import DateRangeSelector from "./DateRangeSelector";
import {RaisedButton, FlatButton} from "material-ui";
import styles from "./DateRangeSelectorDialog.css";
import cssModules from "react-css-modules";
//import {Icon} from "@hotelsoft/react-components";

//todo (vishal) make this stateless
class DateRangeSelectorDialog extends Component {
  constructor(props, context) {
    super(props, context);
    this.dismiss = this.dismiss.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.setRange = this.setRange.bind(this);
    console.log("%c DateRangeSelectorDialog Component -> Init ", "background: red; color: white");
  }

  dismiss(){
    if (typeof this.props.onCancel === "function" && this.props.showDialog) {
      this.props.onCancel();
    }
  }

  handleWindowKeyUp(event){
    if (evt.keyCode === 13){
      this.handleAccept();
    }
  }

  handleAccept(){
    if (typeof this.props.onAccept === "function"){
      this.props.onAccept();
    }
  }

  handleCancel(){
    if (typeof this.props.onCancel === "function"){
      this.props.onCancel();
    }
  }

  setRange(rs, re){
    if (typeof this.props.setRange === "function"){
      this.props.setRange(rs, re);
    }
  }
  //todo (vishal) use calendar action button instead
  render() {
    return (
      <div style={{position: "relative"}}>
        <Popover
          anchorEl={this} // For Popover
          animation={this.props.animation || PopoverAnimationVertical} // For Popover
          bodyStyle={styles.dialogBodyContent}
          contentStyle={styles.dialogContent}
          ref="dialog"
          repositionOnUpdate={true}
          open={this.props.showDialog}
          onRequestClose={this.dismiss}
          style={Object.assign(styles.dialogBodyContent, this.props.containerStyle)}
        >
          <EventListener
            target="window"
            onKeyUp={this.handleWindowKeyUp}
          />
          <div className={styles.mainContainer}>
          <div className={styles.customRangeContainer}>
          <div className={styles.flexInnerContainer}>
          <DateRangeSelector DateTimeFormat={this.props.DateTimeFormat}
                             locale={this.props.locale}
                             onTouchTap={(date)=>{
                               this.props.onChange(date);
                             }}
                             rangeStart={this.props.rangeStart}
                             rangeEnd={this.props.rangeEnd}
                             minDate={this.props.minDate}
                             maxDate={this.props.maxDate}
                             noOfCalendars={this.props.noOfCalendars}
                             firstMonthDay={this.props.firstMonthDay}
                             nextMonthButtonClicked={this.props.onPrevMonthButtonClicked}
                             prevMonthButtonClicked={this.props.onNextMonthButtonClicked}
                             shouldDisableDate={this.props.shouldDisableDate}/>
            </div>
          {
            (this.props.customRanges !== undefined && this.props.customRanges.length > 0) ? <div className={styles.RangeButton}>
              <span className={styles.customrange}>Custom Range</span>
              <div className={styles.dateRangeContainer}>
                {
                  this.props.customRanges.map((v, i)=>{
                    return <div key={`fbs${i}`} style={{padding: "2% 0%"}}>
                      <FlatButton
                        fullWidth={true}
                        label={v.label}
                        onClick={()=>{
                          this.setRange(v.range[0], v.range[1]);

                        }}
                      />
                    </div>;
                  })
                }</div>
              </div>
              : ""
          }
          </div>
          <div className={styles.okButton}>
              <div>
              <RaisedButton label={this.props.okLabel} onClick={this.handleAccept} primary={true} />
               </div>
            <div style={{margin: "0 2%", paddingBottom: "10px"}}>
              <RaisedButton label={this.props.cancelLabel} primary={true} onClick={this.handleCancel} />
            </div>
            {
              this.props.resetLabel !== undefined ? <div>
                <RaisedButton label={this.props.resetLabel} onClick={this.props.onReset} primary={true} />
              </div> : ""
            }
          </div>
          </div>
        </Popover>
      </div>
    );
  }
}

DateRangeSelectorDialog.defaultProps = {};
DateRangeSelectorDialog.propTypes = {
  showDialog: React.PropTypes.bool,
  onChange: React.PropTypes.func,
  customRanges: React.PropTypes.array,
  onAccept: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onReset: React.PropTypes.func,
  okLabel: React.PropTypes.string,
  cancelLabel: React.PropTypes.string,
  resetLabel: React.PropTypes.string,
  DateTimeFormat: React.PropTypes.func,
  animation: React.PropTypes.func,
  noOfCalendars: React.PropTypes.number,
  rangeStart: React.PropTypes.object,
  rangeEnd: React.PropTypes.object,
  minDate: React.PropTypes.object,
  maxDate: React.PropTypes.object,
  containerStyle: React.PropTypes.object,
  firstDayOfWeek: React.PropTypes.number,
  locale: React.PropTypes.string,
  style: React.PropTypes.object,
  onPrevMonthButtonClicked: React.PropTypes.func.isRequired,
  onNextMonthButtonClicked: React.PropTypes.func.isRequired,
  firstMonthDay: React.PropTypes.object.isRequired,
  setRange: React.PropTypes.func,
  shouldDisableDate: React.PropTypes.func
};

DateRangeSelectorDialog.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};
var component4Export = cssModules(DateRangeSelectorDialog, styles);
export default component4Export;
