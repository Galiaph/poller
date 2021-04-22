import moment from 'moment'

export const zeroPad = (number, digits) => {
  var num = number + ''

  while (num.length < digits) {
    num = '0' + num
  }

  return num
}

export const formatUptime = (seconds, withoutSeconds, withoutHours) => {
  const numdays = Math.floor(seconds / 86400)
  const numhours = Math.floor((seconds % 86400) / 3600)
  const numminutes = Math.floor(((seconds % 86400) % 3600) / 60)
  const numseconds = Math.floor((seconds % 3600) % 60)

  // let res = '' + this.zeroPad(numminutes, 2)
  let res = ''

  if (!withoutHours) {
    res = zeroPad(numhours, 2) + ':'
    res += zeroPad(numminutes, 2)
  }

  if (!withoutSeconds) {
    res += ':' + zeroPad(numseconds, 2)
  }

  if (numdays) {
    res = numdays + 'д ' + res
  }

  return res
}

export const formatUptimeFromStart = (datetime, withoutSeconds) => {
  const a = moment()
  const b = moment(datetime)
  return formatUptime(a.diff(b, 'seconds'), withoutSeconds) // 86400000
}
