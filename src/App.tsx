import React, { useState } from 'react';
import { CircleDollarSign } from 'lucide-react';
import { NumberInput } from './components/NumberInput';
import { ConversionResult } from './components/ConversionResult';
import { amountToChinese } from './utils/numberConverter';

function App() {
  const [amount, setAmount] = useState('');
  const chineseAmount = amount ? amountToChinese(parseFloat(amount)) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CircleDollarSign className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            金额大写转换
          </h1>
          <p className="text-gray-600">
            将数字金额转换为中文大写格式
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              输入金额
            </label>
            <NumberInput
              value={amount}
              onChange={setAmount}
              placeholder="请输入数字金额"
              className="text-lg"
            />
          </div>

          <ConversionResult chineseNumber={chineseAmount} />
          
          <div className="mt-6 text-sm text-gray-500">
            <p>说明：</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>支持输入数字和小数点</li>
              <li>自动转换为人民币大写格式</li>
              <li>精确到分位</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;