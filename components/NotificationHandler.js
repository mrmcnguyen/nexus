'use client';
// components/NotificationHandler.js
import { useEffect, useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { createClient } from '../supabase/client';

export function NotificationHandler() {
    const { addNotification } = useNotifications();
    const supabase = createClient();
    const [user, setUser] = useState(null);

    // Fetch user ID
    useEffect(() => {
        const fetchUser = async () => {
        const { data: user, error } = await supabase.auth.getUser();
        console.log('!!!!!!!!!!!!! user', user);
        if (user) {
            setUser(user.user);
        } else {
            console.error("Error while fetching user ID: ", error);
        }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user === null) return;
        console.log(user.email);

        // Handle invitations
        const invitationChannel = supabase
            .channel('invitations')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'invitations',
                filter: `recipient_email=eq.${user.email}`
            }, (payload) => {
                console.log("Notification Received");
                handleInvitationNotification(payload.new);
            })
            .subscribe();
        console.log("listening on invitations");
        // Handle team updates
        const teamChannel = supabase
            .channel('team-updates')
            .on('postgres_changes', {
                event: '*', // Listen to all events
                schema: 'public',
                table: 'team_activities',
                filter: `team_member_id=eq.${user.id}`
            }, (payload) => {
                handleTeamNotification(payload);
            })
            .subscribe();

        // Handle task assignments
        const taskChannel = supabase
            .channel('tasks')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'tasks',
                filter: `assignee_id=eq.${user.id}`
            }, (payload) => {
                handleTaskNotification(payload.new);
            })
            .subscribe();

        // Cleanup function
        return () => {
            supabase.removeChannel(invitationChannel);
            supabase.removeChannel(teamChannel);
            supabase.removeChannel(taskChannel);
        };
    }, [user]);

    const handleInvitationNotification = (invitation) => {
        console.log("INVITATION: ", invitation);
        addNotification({
            project_id: `${invitation.project_id}`,
            project_name: `${invitation.project_name}`,
            organisation_name: `${invitation.organisation_name}`,
            custom_message: `${invitation.custom_message}`,
            message: `Team invitation `,
            type: 'invitation',
            duration: 7000,
            action: {
                label: 'View',
                onClick: () => {
                    // Navigate to invitations page or open modal
                    window.location.href = '/invitations';
                }
            },
            sender_name: `${invitation.sender_name}`
        });
    };

    const handleTeamNotification = (payload) => {
        const { eventType, new: newData, old: oldData } = payload;
        
        switch (eventType) {
            case 'INSERT':
                addNotification({
                    message: `New activity in team: ${newData.team_name}`,
                    type: 'info',
                    duration: 5000
                });
                break;
            case 'UPDATE':
                addNotification({
                    message: `Team update: ${newData.update_message}`,
                    type: 'info',
                    duration: 5000
                });
                break;
            // Add more cases as needed
        }
    };

    const handleTaskNotification = (task) => {
        addNotification({
            message: `New task assigned: ${task.title}`,
            type: 'assignment',
            duration: 6000,
            action: {
                label: 'View Task',
                onClick: () => {
                    window.location.href = `/tasks/${task.id}`;
                }
            }
        });
    };

    // Component doesn't render anything
    return null;
}