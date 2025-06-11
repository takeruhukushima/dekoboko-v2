'use client';

import { useState } from 'react';

export default function CertificateIssuer() {
  const [formData, setFormData] = useState({
    templateId: 'completion-cert',
    recipientName: '',
    recipientEmail: '',
    recipientId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: any; error?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult({});

    try {
      const response = await fetch('/api/certificates/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to issue certificate');
      }


      setResult({ success: data });
    } catch (error) {
      console.error('Error issuing certificate:', error);
      setResult({ error: 'Failed to issue certificate' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">証明書発行</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            証明書テンプレート
          </label>
          <select
            value={formData.templateId}
            onChange={(e) => setFormData({...formData, templateId: e.target.value})}
            className="w-full p-2 border rounded"
            required
          >
            <option value="completion-cert">修了証明書</option>
            <option value="participation-cert">参加証明書</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            受取人名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.recipientEmail}
            onChange={(e) => setFormData({...formData, recipientEmail: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            受取人ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.recipientId}
            onChange={(e) => setFormData({...formData, recipientId: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            受取人を一意に識別するためのID（学籍番号など）
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? '発行中...' : '証明書を発行する'}
          </button>
        </div>
        
        {result.error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            {result.error}
          </div>
        )}
        
        {result.success && (
          <div className="p-4 text-green-700 bg-green-100 rounded-md">
            <p className="font-bold">証明書を発行しました！</p>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(result.success, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
}
