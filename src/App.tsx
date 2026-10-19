import { useMemo, useState } from 'react';
import { CircleDollarSign, Copy, RotateCcw } from 'lucide-react';
import { NumberInput } from './components/NumberInput';
import { amountToChinese } from './utils/numberConverter';

function App() {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const conversion = useMemo(() => {
    if (!amount) return { value: '', error: '' };
    try {
      return { value: amountToChinese(amount), error: '' };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : '金额格式有误' };
    }
  }, [amount]);

  const copyResult = async () => {
    if (!conversion.value) return;
    try {
      await navigator.clipboard.writeText(conversion.value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const clear = () => {
    setAmount('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 px-4 py-10 sm:py-16">
      <main className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <CircleDollarSign className="h-12 w-12 text-blue-600" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Finance Tools</p>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">金额大写转换器</h1>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">输入阿拉伯数字，自动转换为人民币大写金额</p>
        </div>

        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-900/5 sm:p-8">
          <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="amount">输入金额</label>
          <div className="flex items-center overflow-hidden rounded-xl border border-slate-300 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
            <span className="flex h-14 items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-500">¥ RMB</span>
            <NumberInput
              value={amount}
              onChange={(value) => { setAmount(value); setCopied(false); }}
              placeholder="例如：123456.78"
              className="h-14 border-0 text-lg font-semibold shadow-none focus:ring-0 sm:text-xl"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={clear} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              <RotateCcw size={16} /> 清空
            </button>
            <button onClick={copyResult} disabled={!conversion.value} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
              <Copy size={16} /> {copied ? '已复制 ✓' : '复制大写金额'}
            </button>
          </div>

          <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 sm:p-6" aria-live="polite">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-600">转换结果</h2>
              <span className="text-xs text-slate-500">{conversion.error ? '输入有误' : conversion.value ? '转换成功' : '等待输入'}</span>
            </div>
            <p className={`break-all text-xl font-bold leading-relaxed sm:text-2xl ${conversion.error ? 'text-red-600' : conversion.value ? 'text-slate-900' : 'text-slate-400'}`}>
              {conversion.error || conversion.value || '大写金额将在这里显示'}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-medium text-slate-500">试试这些金额</p>
            <div className="flex flex-wrap gap-2">
              {[
                ['0.05', '0.05'],
                ['12.30', '12.30'],
                ['1001.01', '1,001.01'],
                ['123456.78', '123,456.78'],
                ['100124524.00', '100,124,524.00'],
              ].map(([value, label]) => (
                <button key={value} onClick={() => { setAmount(value); setCopied(false); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">
            <p className="mb-1 font-semibold text-slate-700">转换规则</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>支持数字和小数点，自动转换，精确到分位。</li>
              <li>固定显示“圆、角、分”三个单位，零角和零分也会保留。</li>
              <li>不额外添加“整”字；小数部分最多两位，整数部分最多 16 位。</li>
              <li>在浏览器本地转换，金额不会上传。</li>
            </ul>
          </div>
        </section>
        <p className="mt-5 text-center text-xs text-slate-400">RMB · 本地转换 · 无需登录</p>
      </main>
    </div>
  );
}

export default App;
