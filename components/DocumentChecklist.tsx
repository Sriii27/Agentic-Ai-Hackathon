'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { listDocuments, uploadDocument, ApiError } from '@/lib/api';
import type { DocumentId, DocumentRecord } from '@/lib/types';

export const DOCUMENT_DEFS: { id: DocumentId; label: string }[] = [
  { id: 'discharge-summary', label: 'Discharge summary' },
  { id: 'id-proof', label: 'ID proof' },
  { id: 'policy-document', label: 'Policy document' },
  { id: 'itemized-bill', label: 'Itemized hospital bill' },
];

export const DOCUMENT_IDS = DOCUMENT_DEFS.map((d) => d.id);

/**
 * Evidence checklist for the hospital and patient views. Backed by real
 * uploads to the backend (`POST /api/cases/:caseId/documents`) — files
 * are actually stored, not just simulated client-side.
 *
 * `caseId` is null before a case exists yet (e.g. the hospital form
 * hasn't been submitted) — the panel still renders so the checklist
 * reads as a preview of what will be required, but uploads are disabled.
 */
export function DocumentChecklist({
  caseId,
  onChange,
}: {
  caseId: string | null;
  onChange?: (uploaded: DocumentId[]) => void;
}) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loadedCaseId, setLoadedCaseId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<DocumentId | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Clear stale rows the moment the case identity changes (including back
  // to null, e.g. "Submit another case") — adjusting state during render
  // rather than in an effect, per React's guidance for syncing to a
  // changing key.
  if (caseId !== loadedCaseId) {
    setLoadedCaseId(caseId);
    setDocuments([]);
  }

  useEffect(() => {
    if (!caseId) return;
    let cancelled = false;
    listDocuments(caseId)
      .then((docs) => {
        if (cancelled) return;
        setDocuments(docs);
        onChange?.(docs.map((d) => d.documentId));
      })
      .catch(() => {
        // Leave the checklist empty — every row just reads "Missing", which is honest either way.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange is a stable setState setter in every call site
  }, [caseId]);

  async function handleUpload(id: DocumentId, files: FileList | null) {
    if (!files || files.length === 0 || !caseId) return;
    setUploadingId(id);
    setUploadError(null);
    try {
      const updated = await uploadDocument(caseId, id, files[0]);
      setDocuments(updated);
      onChange?.(updated.map((d) => d.documentId));
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <Card>
      <CardHeader
        title="Evidence Panel"
        subtitle={caseId ? 'Documents expected for this case' : 'Documents that will be required'}
      />
      <CardBody className="space-y-3">
        {!caseId && (
          <p className="text-xs text-slate">
            Submit the case first — uploads attach to a real case record.
          </p>
        )}
        {uploadError && <p className="text-xs text-amber">{uploadError}</p>}

        {DOCUMENT_DEFS.map((doc) => {
          const isUploaded = documents.some((d) => d.documentId === doc.id);
          const isUploading = uploadingId === doc.id;
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-hairline px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{doc.label}</p>
                <div className="mt-2">
                  <Badge tone={isUploaded ? 'verified' : 'amber'}>
                    {isUploaded ? 'Uploaded' : 'Missing'}
                  </Badge>
                </div>
              </div>
              {!isUploaded && caseId && (
                <label className="cm-button shrink-0 cursor-pointer text-sm">
                  {isUploading ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    className="hidden"
                    disabled={isUploading}
                    onChange={(e) => handleUpload(doc.id, e.target.files)}
                  />
                </label>
              )}
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
