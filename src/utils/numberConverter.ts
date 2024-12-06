// Convert numbers to Chinese characters with explicit units
export function numberToChinese(num: number | string): string {
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟'];
  
  let str = typeof num === 'string' ? num : num.toString();
  let result = '';
  
  // Handle special case for 0
  if (str === '0') return '零';
  
  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i]);
    const position = str.length - 1 - i;
    
    if (digit === 0) {
      // Add 零 and the unit for zero positions
      result += '零' + units[position];
    } else {
      result += digits[digit] + units[position];
    }
  }
  
  // Clean up repeated units and zeros
  return result
    .replace(/(零[拾佰仟])+/g, '零')  // Combine consecutive zero units
    .replace(/零+/g, '零')           // Combine consecutive zeros
    .replace(/零+$/, '')             // Remove trailing zeros
    .replace(/零万/g, '万')          // Clean up zero before 万
    .replace(/零亿/g, '亿');         // Clean up zero before 亿
}

// Convert currency amount to Chinese format with explicit units
export function amountToChinese(amount: number): string {
  if (amount === 0) return '零圆整';
  
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  let result = '';
  
  // Handle integer part
  if (integerPart === 0) {
    result = '零圆';
  } else {
    result = numberToChinese(integerPart) + '圆';
  }
  
  // Handle decimal part with explicit units
  if (decimalPart > 0) {
    const jiao = Math.floor(decimalPart / 10);
    const fen = decimalPart % 10;
    
    if (jiao === 0) {
      result += '零角' + (fen > 0 ? numberToChinese(fen) + '分' : '零分');
    } else {
      result += numberToChinese(jiao) + '角';
      result += fen > 0 ? numberToChinese(fen) + '分' : '零分';
    }
  } else {
    result += '零角零分整';
  }
  
  return result;
}