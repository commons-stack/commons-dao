/**
 * Calculates a number between two numbers at a specific increment. The
 * progress parameter is the amount to interpolate between the two values where
 * 0.0 equal to the first point, 0.1 is very near the first point, 0.5 is
 * half-way in between, etc. The lerp function is convenient for creating
 * motion along a straight path and for drawing dotted lines.
 *
 * From Processing.js
 *
 * @param {Number} progress Between 0.0 and 1.0
 * @param {Number} value1 First value
 * @param {Number} value2 Second value
 * @returns {Number} Increment value
 */
export function lerp(progress, value1, value2) {
  return (value2 - value1) * progress + value1
}

/**
 * Get the whole and decimal parts from a number.
 * Trims leading and trailing zeroes.
 *
 * @param {string} num the number
 * @returns {Array<string>} array with the [<whole>, <decimal>] parts of the number
 */
function splitDecimalNumber(num) {
  const [whole = '', dec = ''] = num.split('.')
  return [
    whole.replace(/^0*/, ''), // trim leading zeroes
    dec.replace(/0*$/, ''), // trim trailing zeroes
  ]
}

/**
 * Format a decimal-based number back to a normal number
 *
 * @param {string} num the number
 * @param {number} decimals number of decimal places
 * @param {Object} [options] options object
 * @param {bool} [options.truncate=true] Should the number be truncated to its decimal base
 * @returns {string} formatted number
 */
export function fromDecimals(num, decimals, { truncate = true } = {}) {
  const [whole, dec] = splitDecimalNumber(num)
  if (!whole && !dec) {
    return '0'
  }

  const paddedWhole = whole.padStart(decimals + 1, '0')
  const decimalIndex = paddedWhole.length - decimals
  const wholeWithoutBase = paddedWhole.slice(0, decimalIndex)
  const decWithoutBase = paddedWhole.slice(decimalIndex)

  if (!truncate && dec) {
    // We need to keep all the zeroes in this case
    return `${wholeWithoutBase}.${decWithoutBase}${dec}`
  }

  // Trim any trailing zeroes from the new decimals
  const decWithoutBaseTrimmed = decWithoutBase.replace(/0*$/, '')
  if (decWithoutBaseTrimmed) {
    return `${wholeWithoutBase}.${decWithoutBaseTrimmed}`
  }

  return wholeWithoutBase
}

/**
 * Format the number to be in a given decimal base
 *
 * @param {string} num the number
 * @param {number} decimals number of decimal places
 * @param {Object} [options] options object
 * @param {bool} [options.truncate=true] Should the number be truncated to its decimal base
 * @returns {string} formatted number
 */
export function toDecimals(num, decimals, { truncate = true } = {}) {
  const [whole, dec] = splitDecimalNumber(num)
  if (!whole && (!dec || !decimals)) {
    return '0'
  }

  const wholeLengthWithBase = whole.length + decimals
  const withoutDecimals = (whole + dec).padEnd(wholeLengthWithBase, '0')
  const wholeWithBase = withoutDecimals.slice(0, wholeLengthWithBase)

  if (!truncate && wholeWithBase.length < withoutDecimals.length) {
    return `${wholeWithBase}.${withoutDecimals.slice(wholeLengthWithBase)}`
  }
  return wholeWithBase
}