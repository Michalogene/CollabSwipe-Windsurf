import { supabase } from './supabase';

export interface TaskComment {
    id: string;
    task_id: string;
    author_id: string;
    content: string;
    created_at: string;
    author?: {
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
}

// Fetch all comments for a task
export const getTaskComments = async (taskId: string): Promise<TaskComment[]> => {
    try {
        const { data, error } = await supabase
            .from('task_comments')
            .select(`
                *,
                author:profiles!task_comments_author_id_fkey(first_name, last_name, avatar_url)
            `)
            .eq('task_id', taskId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching task comments:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

// Add a new comment to a task
export const addTaskComment = async (
    taskId: string,
    authorId: string,
    content: string
): Promise<{ data: TaskComment | null; error: any }> => {
    try {
        const { data, error } = await supabase
            .from('task_comments')
            .insert({
                task_id: taskId,
                author_id: authorId,
                content: content,
            })
            .select(`
                *,
                author:profiles!task_comments_author_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

        if (error) {
            console.error('Error adding task comment:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Error:', error);
        return { data: null, error };
    }
};

// Subscribe to real-time comments for a task
export const subscribeToTaskComments = (
    taskId: string,
    onNewComment: (comment: TaskComment) => void
) => {
    const channel = supabase
        .channel(`task-comments-${taskId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'task_comments',
                filter: `task_id=eq.${taskId}`,
            },
            async (payload) => {
                // Fetch the full comment with author details
                const { data } = await supabase
                    .from('task_comments')
                    .select(`
                        *,
                        author:profiles!task_comments_author_id_fkey(first_name, last_name, avatar_url)
                    `)
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    onNewComment(data);
                }
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};
