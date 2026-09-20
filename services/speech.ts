import { File, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';

const apiUrl =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function createFocusSpeechFile(
  text: string,
): Promise<string> {
  if (!apiUrl) {
    throw new Error(
      'The HokieAssist server URL is not configured.',
    );
  }

  const response = await fetch(
    `${apiUrl}/api/focus/speech`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Speech API returned status ${response.status}.`,
    );
  }

  const audioFile = new File(
    Paths.cache,
    `hokieassist-focus-${Date.now()}.mp3`,
  );

  audioFile.write(await response.bytes());

  return audioFile.uri;
}