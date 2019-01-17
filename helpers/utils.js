const getDateDifference = (date) => {
  const now = new Date();
  const future = new Date(date);

  const diff = future - now;
  if (diff > 0) {
    return (future - now);
  }
  return false;
}

module.exports = {
  getLocaleDateString,
  getDateDifference
}