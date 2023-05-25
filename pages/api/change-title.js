import { useSession, signOut, getSession } from 'next-auth/react';
import { google } from 'googleapis';

export default async (req, res) => {
  const session = await getSession({ req });
  console.log(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'POST') {
    const { videoId, newTitle } = req.body;

    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({
        access_token: session.accessToken,
      });

      const youtube = google.youtube({
        version: 'v3',
        auth,
      });

      await youtube.videos.update({
        part: 'snippet',
        requestBody: {
          id: videoId,
          snippet: {
            title: newTitle,
          },
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};
