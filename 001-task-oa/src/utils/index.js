const zero = function zero(text) {
  text = String(text);
  return text.length < 2 ? "0" + text : text;
};
const formatTime = function formatTime(time) {
  let arr = time.match(/\d+/g),
    [, month, day, hours = "00", minutes = "00"] = arr;
  return `${zero(month)}-${zero(day)} ${zero(hours)}:${zero(minutes)}`;
};

export { formatTime };
