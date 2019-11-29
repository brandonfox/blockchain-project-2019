export const convertToThai = (datetime: string) => {
  const date_time = datetime.split("T");
  const date = date_time[0];
  const time = date_time[1];
  const year_month_day = date.split("-");
  const year = parseInt(year_month_day[0]) + 543;
  const month = parseInt(year_month_day[1]) - 1;
  const day = parseInt(year_month_day[2]);
  const thaiYear = new Array(
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  );

  return { day, month: thaiYear[month], year, time };
};
