import type { StudentRequest } from './types';

const apiUrl =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

type ApiError = {
  error?: string;
};

export async function parseStudentRequestWithServer(
  message: string,
): Promise<StudentRequest> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    throw new Error('Please describe what would help today.');
  }

  if (!apiUrl) {
    throw new Error(
      'The HokieAssist server URL is not configured.',
    );
  }

  const response = await fetch(`${apiUrl}/api/ai/parse`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: trimmedMessage,
    }),
  });

  const data: StudentRequest | ApiError =
    await response.json();

  if (!response.ok) {
    const apiError = data as ApiError;

    throw new Error(
      apiError.error ||
        'HokieAssist could not understand the request.',
    );
  }

  return data as StudentRequest;
}