import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import 'dayjs/locale/ja';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale('ja'); 
dayjs.tz.setDefault("Asia/Tokyo");

export { dayjs };