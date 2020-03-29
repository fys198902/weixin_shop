const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function rightjiequ(fval){
  return fval.slice(-23)
}

function titaljiequ(fval){
  return fval.sbustr(15) + '..'
}

function settofixed(fval){
  return fval.toFixed(2)
}

module.exports = {
  formatTime: formatTime,
  settofixed: settofixed,
  rightjiequ: rightjiequ,
  titaljiequ: titaljiequ
}


