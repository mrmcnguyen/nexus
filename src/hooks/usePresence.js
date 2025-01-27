// hooks/usePresence.js
import { useState, useEffect } from 'react';
import { createClient } from '../../supabase/client';

export const usePresence = () => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const supabase = createClient();
  
  useEffect(() => {
    // Create a presence channel
    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: 'online',
        },
      },
    });

    // Listen for presence state changes
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      const currentOnlineUsers = new Set(
        Object.values(state).map(presence => presence[0].user_id)
      );
      setOnlineUsers(currentOnlineUsers);
    });

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        newPresences.forEach(presence => updated.add(presence.user_id));
        return updated;
      });
    });

    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        leftPresences.forEach(presence => updated.delete(presence.user_id));
        return updated;
      });
    });

    // Subscribe and track the current user's presence
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        const user = await supabase.auth.getUser();
        if (user?.data?.user) {
          await channel.track({
            user_id: user.data.user.id,
            online_at: new Date().toISOString(),
          });
        }
      }
    });

    // Cleanup on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  return onlineUsers;
};

export const getUserStatus = (userId, onlineUsers) => {
  return onlineUsers.has(userId) ? "Online" : "Offline";
};