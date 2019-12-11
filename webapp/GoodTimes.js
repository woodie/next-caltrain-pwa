const AM = Calendar.AM;
const PM = Calendar.PM;
const AM_PM = Calendar.AM_PM;

/**
 * A utility to simplify working with the Calendar.
 */
class GoodTimes{

  constructor(epoch) {
    calendar = Calendar.getInstance();
    Date date = new Date(epoch);
    calendar.setTime(date);
  }

  get(int n) {
    return calendar.get(n);
  }


  String dayOfTheWeek() {
    return GoodTimes.daysOfWeek[dotw()];
  }

  String dateString() {
    StringBuffer buf = new StringBuffer(20);
    buf.append(GoodTimes.monthsOfYear[calendar.get(Calendar.MONTH)]);
    buf.append(" ");
    buf.append(calendar.get(Calendar.DAY_OF_MONTH));
    buf.append(", ");
    buf.append(calendar.get(Calendar.YEAR));
    return buf.toString();
  }

  static countdown(int minutes, int second) {
    StringBuffer buf = new StringBuffer(20);
    buf.append("in ");
    if (minutes > 59) {
      buf.append(minutes / 60);
      buf.append(" hr ");
      buf.append(minutes % 60);
      buf.append(" min");
    } else {
      buf.append(minutes);
      buf.append(" min ");
      buf.append(60 - second);
      buf.append(" sec");
    }
    return buf.toString();
  }

  static timeOfday(int hour, int min, String ampm) {
    StringBuffer buf = new StringBuffer(10);
    buf.append(hour);
    buf.append(min < 10 ? ":0" : ":");
    buf.append(min);
    if (ampm.length() > 0) {
      buf.append(" ");
      buf.append(ampm);
    }
    return buf.toString();
  }

  static timeOfday(int hour, int min) {
    return timeOfday(hour, min, "");
  }

  static fullTime(int minutes) {
    int hour = minutes / 60;
    String ampm = (hour > 11 && hour < 24) ? "pm" : "am";
    if (hour > 12) hour -= 12;
    if (hour > 12) hour -= 12;
    return timeOfday(hour, minutes % 60, ampm);
  }

  static partTime(int minutes) {
    String[] out = new String[2];
    int hour = minutes / 60;
    String ampm = (hour > 11 && hour < 24) ? "pm" : "am";
    if (hour > 12) hour -= 12;
    if (hour > 12) hour -= 12;
    out[0] = timeOfday(hour, minutes % 60, "");
    out[1] = ampm;
    return out;
  }

  timeOfday(boolean withAmPm) {
    return GoodTimes.timeOfday(hour(), minute(), (withAmPm) ? ampm() : "");
  }

  ampm() {
    return (calendar.get(Calendar.AM_PM) == Calendar.AM) ? "am" : "pm";
  }

  hr24() {
   return  get(Calendar.HOUR_OF_DAY);
  }

  hour() {
    int hr =  get(Calendar.HOUR);
    return (hr < 1) ? hr + 12: hr;
  }

  minute() {
    return get(Calendar.MINUTE);
  }

  second() {
    return get(Calendar.SECOND);
  }

  dotw() {
    return calendar.get(Calendar.DAY_OF_WEEK);
  }

  currentMinutes() {
    return hr24() * 60 + minute();
  }

}
