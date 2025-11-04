import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addMessage, getMessages } from '../services/chat.service';
import { subscribeToNewMessages } from '../services/firebase-chat.service';
import { useLastSeenStore } from '../store';
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
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const loadPageRef = useRef<((nextPage: number, replace?: boolean) => Promise<void>) | null>(null);
  const { user } = useAuthStore();
  const { updateLastSeen } = useLastSeenStore();

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
        updateLastSeen(challengeId);

        // Sort messages by timestamp (newest first) for inverted FlatList
        const sortedData = [...data].sort((a, b) => {
          const timeA = new Date(a.sent_time || a.createdAt || 0).getTime();
          const timeB = new Date(b.sent_time || b.createdAt || 0).getTime();
          return timeB - timeA; // DESC order (newest first)
        });

        setHasMore(data.length === pageSize);

        if (replace) {
          // Replace all messages with sorted data (newest first)
          setMessages(sortedData);
        } else {
          // Append older messages and re-sort entire array to maintain order
          setMessages(prev => {
            const combined = [...prev, ...sortedData];
            return combined.sort((a, b) => {
              const timeA = new Date(a.sent_time || a.createdAt || 0).getTime();
              const timeB = new Date(b.sent_time || b.createdAt || 0).getTime();
              return timeB - timeA; // DESC order (newest first)
            });
          });
        }
        setPage(nextPage);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load messages');
      } finally {
        loadingRef.current = false;
        setLoading(false);
        isFetchingMoreRef.current = false;
      }
    },
    [challengeId, pageSize, updateLastSeen]
  );

  // Keep ref updated with latest loadPage function
  loadPageRef.current = loadPage;

  useEffect(() => {
    if (!auto) return;
    if (!challengeId) return;
    setMessages([]);
    setPage(1);
    setHasMore(true);
    loadPage(1, true);
  }, [challengeId, auto, loadPage]);

  useEffect(() => {
    if (!challengeId) return;

    // Clean up existing subscription before creating new one
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const unsubscribe = subscribeToNewMessages(challengeId, () => {
      if (!loadingRef.current && loadPageRef.current) {
        loadPageRef.current(1, true);
      }
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [challengeId]);

  const fetchMore = useCallback(() => {
    if (!hasMore || loadingRef.current || isFetchingMoreRef.current) return;
    isFetchingMoreRef.current = true;
    loadPage(page + 1);
  }, [hasMore, loadPage, page]);

  const send = useCallback(
    async (content: string) => {
      if (!challengeId || !content?.trim()) return;
      const tempId = `temp-${Date.now()}`;
      const now = new Date().toISOString();
      const optimistic: ChatMessage = {
        id: tempId,
        content,
        sent_by: user?.id || 'me',
        challenge_id: challengeId,
        createdAt: now,
        sent_time: now,
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
      // Prepend to beginning (newest first for inverted list)
      setMessages(prev => [optimistic, ...prev]);
      try {
        setSending(true);
        const saved = await addMessage(challengeId, content);
        // Replace temp message with saved message, ensuring it's at the beginning
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempId);
          // Ensure saved message is at the beginning (newest)
          return [saved, ...filtered];
        });
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
