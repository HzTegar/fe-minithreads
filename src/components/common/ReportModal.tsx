import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { Button } from './Button';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'post' | 'comment' | 'user';
  targetTitle?: string;
}

const REPORT_REASONS = [
  'Konten mengandung spam atau iklan tidak diinginkan.',
  'Pelecehan, ujaran kebencian, atau intimidasi.',
  'Konten tidak senonoh atau tidak pantas.',
  'Pelanggaran aturan komunitas (Out of topic, dll).',
  'Lainnya (Tulis detail di deskripsi).'
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
}) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await reportService.create({
        target_id: targetId,
        target_type: targetType,
        reason,
        description: description.trim() || undefined,
      });
      setSuccess(response.message || 'Laporan kamu berhasil dikirim dan akan segera ditinjau.');
      setTimeout(() => {
        onClose();
        // Reset states
        setReason(REPORT_REASONS[0]);
        setDescription('');
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeName = () => {
    switch (targetType) {
      case 'post': return 'Postingan/Thread';
      case 'comment': return 'Komentar/Jawaban';
      case 'user': return 'Pengguna';
      default: return 'Konten';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #1e293b',
          animation: 'modalFadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#ef4444', fontSize: '1.25rem', display: 'flex' }}>
              ⚠️
            </span>
            {/* 1. MENGUBAH WARNA JUDUL LAPORAN MENJADI PUTIH (#ffffff) */}
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
              Laporkan {getTypeName()}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '1.25rem',
              display: 'flex',
              padding: '0.25rem',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.5rem' }}>
            {targetTitle && (
              /* 2. MENGUBAH BACKGROUND KOTAK INFO KONTEN MENJADI GELAP (#1e293b) DAN TEKS MENJADI PUTIH (#ffffff) */
              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderLeft: '4px solid #3b82f6',
                  padding: '0.75rem 1rem',
                  borderRadius: '0 6px 6px 0',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  color: '#ffffff',
                }}
              >
                <strong>Konten:</strong> "{targetTitle}"
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  color: '#b91c1c',
                }}
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.875rem',
                  color: '#166534',
                }}
              >
                {success}
              </div>
            )}

            {/* Reason Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.5rem',
                }}
              >
                Alasan Melaporkan
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="reason"
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      style={{ marginTop: '0.2rem' }}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '0.5rem',
                }}
              >
                Detail Tambahan (Opsional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Berikan detail tambahan tentang laporanmu..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {description.length}/500
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading || !!success}
              >
                Kirim Laporan
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};