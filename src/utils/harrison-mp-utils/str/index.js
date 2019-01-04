// 给一位数字前面加'0'
export function addZero (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
