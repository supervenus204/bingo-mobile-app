import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addMessage, getMessages } from '../services/chat.service';
import { useAuthStore } from '../store/auth.store';
import { ChatMessage } from '../types/chat.type';

type UseMessagesOptions = {
  challengeId: string | undefined;
  pageSize?: number;
  auto?: boolean;
};

export const useMessages = ({
  challengeId,
  pageSize = 20,
  auto = true,
}: UseMessagesOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingMoreRef = useRef(false);
  const loadingRef = useRef(false);
  const { user } = useAuthStore();

  const loadPage = useCallback(
    async (nextPage: number, replace = false) => {
      if (!challengeId || loadingRef.current) return;
      try {
        loadingRef.current = true;
        setLoading(true);
        const data = await getMessages(challengeId, {
          limit: pageSize,
          page: nextPage,
        });
        setHasMore(data.length === pageSize);
        setMessages(prev => (replace ? data : [...prev, ...data]));
        setPage(nextPage);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load messages');
      } finally {
        loadingRef.current = false;
        setLoading(false);
        isFetchingMoreRef.current = false;
      }
    },
    [challengeId, pageSize]
  );

  useEffect(() => {
    if (!auto) return;
    if (!challengeId) return;
    setMessages([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [challengeId, auto, loadPage]);

  const fetchMore = useCallback(() => {
    if (!hasMore || loadingRef.current || isFetchingMoreRef.current) return;
    isFetchingMoreRef.current = true;
    loadPage(page + 1);
  }, [hasMore, loadPage, page]);

  const send = useCallback(
    async (content: string) => {
      if (!challengeId || !content?.trim()) return;
      const tempId = `temp-${Date.now()}`;
      const optimistic: ChatMessage = {
        id: tempId,
        content,
        sent_by: user?.id || 'me',
        challenge_id: challengeId,
        createdAt: new Date().toISOString(),
        sender: user
          ? {
            id: user.id,
            first_name: user.firstName,
            last_name: user.lastName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image ?? null,
          }
          : undefined,
      };
      setMessages(prev => [optimistic, ...prev]);
      try {
        setSending(true);
        const saved = await addMessage(challengeId, content);
        setMessages(prev => [saved, ...prev.filter(m => m.id !== tempId)]);
      } catch (e) {
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setError(e instanceof Error ? e.message : 'Failed to send message');
        throw e;
      } finally {
        setSending(false);
      }
    },
    [challengeId, user]
  );

  return useMemo(
    () => ({ messages, loading, error, hasMore, fetchMore, send, sending }),
    [messages, loading, error, hasMore, fetchMore, send, sending]
  );
};
