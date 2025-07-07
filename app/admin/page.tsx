'use client';
import { useState, useEffect } from 'react';
import { LogOut, Edit, FileCheck, FlaskConical, Settings, KeyRound, User } from 'lucide-react';
import { AppStore } from '@/store/app';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ADMIN_USER = 'arch1e';
const ADMIN_PASS = 'T0hsakar1n';

export default function AdminPage() {
  const [isRoot, setIsRoot] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const { setUserID } = AppStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setIsRoot(true);
      setError('');
      setUser('');
      setPass('');
    } else {
      setError('帳號或密碼錯誤');
    }
  };

  const handleLogout = () => {
    setUserID('none');
    localStorage.removeItem('app');
    window.location.reload();
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 全螢幕背景 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#181c2f] via-[#23274a] to-[#1a1d2e]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.08),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(128,0,255,0.08),transparent_60%)]" />
      </div>

      <main className="flex-1 flex items-center justify-center z-10 relative">
        {!isRoot ? (
          <div className="w-full max-w-sm p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-cyan-400/30 shadow-xl">
            <div className="flex items-center gap-2 mb-6">
              <KeyRound className="w-7 h-7 text-cyan-400" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">管理員登入</h2>
            </div>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-cyan-200 text-sm">帳號</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/60 border border-cyan-400/20 text-cyan-100 focus:outline-none focus:border-cyan-400 transition"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className="text-cyan-200 text-sm">一次性密碼</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/60 border border-cyan-400/20 text-cyan-100 focus:outline-none focus:border-cyan-400 transition"
                  type="password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl py-2 shadow-lg hover:from-cyan-400 hover:to-blue-400 hover:scale-105 transition-all"
              >
                登入
              </button>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 p-6 rounded-3xl bg-black/80 backdrop-blur-xl border border-cyan-400/30 shadow-2xl">
            {/* 一般功能 */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-6 h-6 text-cyan-300" />
                <h2 className="text-lg font-semibold text-cyan-200">一般功能</h2>
              </div>
              <hr className="border-cyan-400/20 mb-4" />
              <div className="flex flex-col gap-4">
                <button
                  className="flex items-center gap-2 bg-black/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-cyan-100 hover:border-cyan-400/60 hover:bg-cyan-900/20 transition w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" /> 登出帳號
                </button>
                <EditHwScoreButton />
                <AutoCheckDialog />
                <AddStudentDialog />
              </div>
            </section>
            {/* 實驗功能 */}
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="w-6 h-6 text-purple-300" />
                <h2 className="text-lg font-semibold text-purple-200">實驗功能</h2>
              </div>
              <hr className="border-purple-400/20 mb-4" />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-black/60 border border-purple-400/20 rounded-xl px-4 py-3 text-purple-100 w-full">
                  <FlaskConical className="w-5 h-5" /> AI自動評分
                </div>
                <div className="flex items-center gap-2 bg-black/60 border border-purple-400/20 rounded-xl px-4 py-3 text-purple-100 w-full">
                  <FlaskConical className="w-5 h-5" /> 批次匯出成績
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      {/* 版權資訊固定在底部 */}
      <footer className="w-full text-center text-xs text-gray-400 py-4 z-20 relative">
        &copy; {new Date().getFullYear()} archie0732. All rights reserved.
      </footer>
    </div>
  );
}

function EditHwScoreButton() {
  const [open, setOpen] = useState(false);
  const [inputId, setInputId] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [hwStatus, setHwStatus] = useState<string[]>([]);
  const [error, setError] = useState('');

  // 查詢 profile
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    setProfile(null);
    try {
      const res = await fetch(`/api/profile/${inputId}`);
      if (!res.ok) throw new Error('查無此 id');
      const data = await res.json();
      // 這裡 log 一下
      console.log('API 回傳', data);
      const student = data.data?.student;
      setProfile(student);
      if (student && Array.isArray(student.hw)) {
        setHwStatus([...student.hw]);
      } else {
        setHwStatus([]);
      }
    } catch (e: any) {
      setError(e.message || '查詢失敗');
    } finally {
      setLoading(false);
    }
  };

  // 修改本地狀態
  const handleChange = (idx: number, value: string) => {
    setHwStatus((prev: string[]) => {
      const newStatus = [...prev];
      newStatus[idx] = value;
      return newStatus;
    });
  };

  // 儲存
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/profile/${inputId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hw: hwStatus }),
      });
      if (!res.ok) {
        toast.error('儲存失敗');
        return;
      }
      toast.success('儲存成功');
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message || '儲存失敗');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "1") return "text-green-400 font-bold";
    if (status === "") return "text-red-400 font-bold";
    if (status === "-1") return "text-orange-400 font-bold";
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 bg-black/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-cyan-100 hover:border-cyan-400/60 hover:bg-cyan-900/20 transition w-full"
          type="button"
        >
          <Edit className="w-5 h-5" /> 修改作業成績
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改作業成績</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="請輸入學生 id"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
            disabled={loading}
          />
          <Button onClick={fetchProfile} disabled={loading || !inputId}>
            查詢
          </Button>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {profile && hwStatus.length > 0 && (
            <>
              <table className="w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">作業</th>
                    <th className="border px-2 py-1">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {hwStatus.map((status, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{idx === 0 ? "作業 test" : `作業 ${idx}`}</td>
                      <td className="border px-2 py-1">
                        <select
                          className={`bg-black/60 border border-cyan-400/20 rounded px-2 py-1 ${getStatusColor(status)}`}
                          value={status}
                          onChange={e => handleChange(idx, e.target.value)}
                        >
                          <option value="">未繳交</option>
                          <option value="-1">未通過</option>
                          <option value="1">已完成</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button className="mt-4 w-full" onClick={handleSave} disabled={loading}>
                儲存
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AutoCheckDialog() {
  const [open, setOpen] = useState(false);
  const [hwList, setHwList] = useState<string[]>([]);
  const [selectedHw, setSelectedHw] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [stdOutput, setStdOutput] = useState('');
  const [result, setResult] = useState<'pending' | 'success' | 'fail' | ''>('');
  const [error, setError] = useState('');

  // 取得作業清單
  useEffect(() => {
    if (!open) return;
    fetch('/api/md').then(res => res.json()).then(data => {
      if (data.success && data.data) setHwList(data.data.hw_list);
    });
  }, [open]);

  // 取得標準答案
  const fetchStdOutput = async (hwId: string) => {
    const res = await fetch(`/api/md/${hwId}`);
    if (!res.ok) throw new Error('取得作業詳情失敗');
    const data = await res.json();
    if (!data.success || !data.data) throw new Error('作業資料異常');
    return data.data.detail.check_output;
  };

  // 取得 input
  const fetchInput = async (hwId: string) => {
    const res = await fetch(`/api/md/${hwId}`);
    if (!res.ok) throw new Error('取得作業詳情失敗');
    const data = await res.json();
    if (!data.success || !data.data) throw new Error('作業資料異常');
    return data.data.detail.check_input;
  };

  // 執行比對
  const handleRun = async () => {
    setLoading(true);
    setError('');
    setOutput('');
    setStdOutput('');
    setResult('pending');
    try {
      if (!selectedHw) throw new Error('請選擇作業');
      if (!code.trim()) throw new Error('請輸入程式碼');
      const input = await fetchInput(selectedHw);
      const std = await fetchStdOutput(selectedHw);
      setStdOutput(std);
      // 執行程式碼
      const res = await fetch('/api/runcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'jjdl', code, input })
      });
      const data = await res.json();
      if (!data.success || !data.data) throw new Error('執行失敗');
      if (data.data.error) throw new Error(data.data.error);
      setOutput(data.data.userans);
      if (String(std).trim() === String(data.data.userans).trim()) {
        setResult('success');
      } else {
        setResult('fail');
      }
    } catch (e: any) {
      setError(e.message || '執行失敗');
      setResult('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-black/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-cyan-100 hover:border-cyan-400/60 hover:bg-cyan-900/20 transition w-full">
          <FileCheck className="w-5 h-5" /> 自動改作業輸出比對
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>自動改作業輸出比對</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <select
            className="bg-black/60 border border-cyan-400/20 rounded px-2 py-1 text-cyan-100"
            value={selectedHw}
            onChange={e => setSelectedHw(e.target.value)}
            disabled={loading}
          >
            <option value="">請選擇作業</option>
            {hwList.map(hw => (
              <option key={hw} value={hw}>{hw}</option>
            ))}
          </select>
          <textarea
            className="bg-black/60 border border-cyan-400/20 rounded px-2 py-1 text-cyan-100 font-mono min-h-[120px]"
            placeholder="請貼上程式碼..."
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleRun} disabled={loading || !selectedHw || !code.trim()}>
            {loading ? '執行中...' : '執行比對'}
          </Button>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {(output || stdOutput) && (
            <div className="mt-2 flex flex-col gap-2">
              <div>
                <span className="text-cyan-300 font-bold">執行解答：</span>
                <pre className="bg-black/70 border border-cyan-400/10 rounded p-2 text-cyan-100 whitespace-pre-wrap">{output}</pre>
              </div>
              <div>
                <span className="text-purple-300 font-bold">標準答案：</span>
                <pre className="bg-black/70 border border-purple-400/10 rounded p-2 text-purple-100 whitespace-pre-wrap">{stdOutput}</pre>
              </div>
              {result === 'success' && <div className="text-green-400 font-bold">✔ 輸出正確</div>}
              {result === 'fail' && <div className="text-red-400 font-bold">✘ 輸出不符</div>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddStudentDialog() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAdd = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!id.trim() || !name.trim()) throw new Error('請輸入完整資料');
      const res = await fetch('/api/profile/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim(), name: name.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.data || data?.message || '添加失敗');
      setSuccess('添加成功！');
      setId('');
      setName('');
    } catch (e: any) {
      setError(e.message || '添加失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-black/60 border border-cyan-400/20 rounded-xl px-4 py-3 text-cyan-100 hover:border-cyan-400/60 hover:bg-cyan-900/20 transition w-full">
          <User className="w-5 h-5" /> 添加學生
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加學生</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="學生 ID"
            value={id}
            onChange={e => setId(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="學生姓名"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleAdd} disabled={loading || !id.trim() || !name.trim()}>
            {loading ? '新增中...' : '新增'}
          </Button>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
