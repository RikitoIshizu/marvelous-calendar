interface Session {
  userId: number;
  username: string;
  expiresAt: Date;
}

const sessionStore = new Map<string, Session>();

export const createSession = (token: string, session: Session): void => {
  sessionStore.set(token, session);
};

export const getSession = (token: string): Session | undefined => {
  const session = sessionStore.get(token);
  if (session && session.expiresAt > new Date()) {
    return session;
  }
  // セッションが存在しない、または期限切れの場合は削除
  sessionStore.delete(token);
  return undefined;
};

export const deleteSession = (token: string): void => {
  sessionStore.delete(token);
};
