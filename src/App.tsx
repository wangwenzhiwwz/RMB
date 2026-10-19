import { useMemo, useState } from 'react';
import { CircleDollarSign, ClipboardPaste, Copy, RotateCcw } from 'lucide-react';
import { NumberInput } from './components/NumberInput';
import { amountToChinese } from './utils/numberConverter';

function App() {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  const conversion = useMemo(() => {
    if (!amount) return { value: '', error: '' };
    try {
      return { value: amountToChinese(amount), error: '' };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : '金额格式有误' };
    }
  }, [amount]);

  const pasteAmount = async () => {
    setNotice('');
    try {
      const text = (await navigator.clipboard.readText()).trim().replace(/,/g, '');
      if (!text) {
        setNotice('剪贴板为空，请先复制报销金额');
        return;
      }
      setAmount(text);
      setCopied(false);
      setNotice('已粘贴剪贴板内容');
    } catch {
      setNotice('浏览器未允许读取剪贴板，请点击金额输入框后按 Ctrl+V');
    }
  };

  const copyResult = async () => {
    if (!conversion.value) return;
    try {
      await navigator.clipboard.writeText(conversion.value);
      setCopied(true);
      setNotice('大写金额已复制，可直接粘贴到报销单');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice('复制失败，请手动选中转换结果复制');
      setCopied(false);
    }
  };

  const clear = () => {
    setAmount('');
    setCopied(false);
    setNotice('');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-14">
      <main className="mx-auto max-w-xl">
        <header className="mb-7 text-center">
          <div className="mb-3 flex justify-center">
            <CircleDollarSign className="h-9 w-9 text-blue-600" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">人民币金额大写</h1>
          <p className="mt-2 text-sm text-slate-500">快速填写报销单 · 支持剪贴板粘贴</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="amount">报销金额（小写）</label>
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
              <span className="pl-4 text-lg font-semibold text-slate-400">¥</span>
              <NumberInput
                value={amount}
                onChange={(value) => { setAmount(value); setCopied(false); setNotice(''); }}
                placeholder="输入或粘贴金额"
                className="h-14 border-0 text-xl font-semibold shadow-none focus:ring-0"
              />
            </div>
            <button
              type="button"
              onClick={pasteAmount}
              className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 sm:px-4"
              aria-label="从剪贴板粘贴金额"
            >
              <ClipboardPaste size={18} />
              <span>粘贴</span>
            </button>
          </div>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 sm:p-5" aria-live="polite">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-blue-900">报销单大写金额</h2>
              {conversion.value && <span className="text-xs text-blue-700">转换完成</span>}
            </div>
            <p className={`min-h-14 break-all text-xl font-bold leading-relaxed sm:text-2xl ${conversion.error ? 'text-red-600' : conversion.value ? 'text-slate-900' : 'text-slate-400'}`}>
              {conversion.error || conversion.value || '等待输入金额'}
            </p>
            <button
              type="button"
              onClick={copyResult}
              disabled={!conversion.value}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Copy size={18} />
              {copied ? '已复制，可粘贴到报销单' : '复制大写金额'}
            </button>
          </div>

          <div className="mt-3 flex min-h-8 items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-500" role="status">{notice || '支持最多 16 位整数、2 位小数'}</p>
            <button type="button" onClick={clear} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-800">
              <RotateCcw size={14} />
              清空
            </button>
          </div>
        </section>
        <p className="mt-4 text-center text-xs text-slate-400">金额仅在本地浏览器处理，不会上传</p>
      </main>
    </div>
  );
}

export default App;
