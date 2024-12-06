import React from 'react';

interface ConversionResultProps {
  chineseNumber: string;
}

export function ConversionResult({ chineseNumber }: ConversionResultProps) {
  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2">转换结果</h3>
      <p className="text-lg font-semibold text-gray-900 break-all">{chineseNumber || '请输入数字'}</p>
      {chineseNumber && (
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p>说明：</p>
          <ul className="list-disc list-inside pl-2">
            <li>所有单位（圆、角、分）都会显示</li>
            <li>零位会标注相应单位</li>
            <li>整数部分显示：个、拾、佰、仟、万、亿等单位</li>
            <li>小数部分显示：角、分单位</li>
          </ul>
        </div>
      )}
    </div>
  );
}