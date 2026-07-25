// Thin typed client for the Care Mediator backend (../backend). Every
// network call the frontend makes goes through here — nothing else
// should call `fetch` directly against the API.

import type {
  CaseData,
  CreateCaseInput,
  DecisionInput,
  DocumentId,
  DocumentRecord,
  IssueReport,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers:
        init?.body && !(init.body instanceof FormData)
          ? { 'Content-Type': 'application/json', ...init?.headers }
          : init?.headers,
    });
  } catch {
    throw new ApiError(
      0,
      `Could not reach the backend at ${API_BASE_URL}. Is it running? (cd backend && npm run dev)`
    );
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let details: unknown;
    try {
      const body = await res.json();
      message = body.error ?? message;
      details = body.details;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(res.status, message, details);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function getCase(caseId: string): Promise<CaseData> {
  return request<CaseData>(`/api/cases/${encodeURIComponent(caseId)}`);
}

export function listCases(): Promise<CaseData[]> {
  return request<CaseData[]>('/api/cases');
}

export function createCase(input: CreateCaseInput): Promise<CaseData> {
  return request<CaseData>('/api/cases', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function runObjectivityCheck(caseId: string): Promise<CaseData> {
  return request<CaseData>(`/api/cases/${encodeURIComponent(caseId)}/objectivity-check`, {
    method: 'POST',
  });
}

export function submitDecision(caseId: string, decision: DecisionInput): Promise<CaseData> {
  return request<CaseData>(`/api/cases/${encodeURIComponent(caseId)}/decision`, {
    method: 'POST',
    body: JSON.stringify(decision),
  });
}

export function listDocuments(caseId: string): Promise<DocumentRecord[]> {
  return request<DocumentRecord[]>(`/api/cases/${encodeURIComponent(caseId)}/documents`);
}

export function uploadDocument(
  caseId: string,
  documentId: DocumentId,
  file: File
): Promise<DocumentRecord[]> {
  const form = new FormData();
  form.append('documentId', documentId);
  form.append('file', file);
  return request<DocumentRecord[]>(`/api/cases/${encodeURIComponent(caseId)}/documents`, {
    method: 'POST',
    body: form,
  });
}

export function listIssues(caseId: string): Promise<IssueReport[]> {
  return request<IssueReport[]>(`/api/cases/${encodeURIComponent(caseId)}/issues`);
}

export function reportIssue(
  caseId: string,
  issueType: string,
  description: string
): Promise<IssueReport> {
  return request<IssueReport>(`/api/cases/${encodeURIComponent(caseId)}/issues`, {
    method: 'POST',
    body: JSON.stringify({ issueType, description }),
  });
}
