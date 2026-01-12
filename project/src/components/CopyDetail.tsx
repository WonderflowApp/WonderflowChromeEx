import { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import type { Database } from '../lib/database.types';

type CopyBlock = Database['public']['Tables']['copy_blocks']['Row'];

interface CopyDetailProps {
  copyBlock: CopyBlock;
  onBack: () => void;
}

export default function CopyDetail({ copyBlock, onBack }: CopyDetailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!copyBlock.notes) return;

    try {
      await navigator.clipboard.writeText(copyBlock.notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{copyBlock.name}</h1>
            <p className="text-sm text-gray-500">
              Created {new Date(copyBlock.created_at).toLocaleDateString()}
            </p>
          </div>
          {copyBlock.notes && (
            <button
              onClick={handleCopyToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Text
                </>
              )}
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Copy Details
            </h2>
            <div className="flex gap-2">
              {copyBlock.type && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {copyBlock.type}
                </span>
              )}
              {copyBlock.status && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  {copyBlock.status}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {copyBlock.category && (
              <div>
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <p className="text-gray-900 mt-1">{copyBlock.category}</p>
              </div>
            )}
            {copyBlock.intent && (
              <div>
                <span className="text-sm font-medium text-gray-600">Intent:</span>
                <p className="text-gray-900 mt-1">{copyBlock.intent}</p>
              </div>
            )}
            {copyBlock.tone && (
              <div>
                <span className="text-sm font-medium text-gray-600">Tone:</span>
                <p className="text-gray-900 mt-1">{copyBlock.tone}</p>
              </div>
            )}
          </div>
        </div>

        {copyBlock.notes && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Copy Text
              </h2>
              <button
                onClick={handleCopyToClipboard}
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{copyBlock.notes}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
