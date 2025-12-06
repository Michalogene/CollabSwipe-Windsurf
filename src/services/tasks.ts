import { supabase } from './supabase';

export interface Task {
    id: string;
    project_id: string;
    assignee_id?: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'High' | 'Medium' | 'Low';
    due_date?: string;
    tag?: string;
    position?: number;
    created_at: string;
    updated_at: string;
    assignee?: {
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
}

export const createTask = async (taskData: Partial<Task>) => {
    try {
        console.log('🚀 Création tâche:', taskData);

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                project_id: taskData.project_id,
                assignee_id: taskData.assignee_id,
                title: taskData.title,
                description: taskData.description,
                status: taskData.status || 'todo',
                priority: taskData.priority || 'Medium', // Must be 'High', 'Medium', or 'Low'
                due_date: taskData.due_date,
            })
            .select()
            .single();

        if (error) {
            console.error('Erreur création tâche:', error);
            return { data: null, error };
        }

        console.log('✅ Tâche créée:', data);
        return { data, error: null };
    } catch (error) {
        console.error('Erreur:', error);
        return { data: null, error };
    }
};

export const getProjectTasks = async (projectId: string) => {
    try {
        console.log('📋 Loading tasks for project:', projectId);

        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                assignee:profiles!tasks_assignee_id_fkey(first_name, last_name, avatar_url)
            `)
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur chargement tâches:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
};

export const updateTaskStatus = async (taskId: string, status: string) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            console.error('Erreur mise à jour statut:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Erreur:', error);
        return { data: null, error };
    }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            console.error('Erreur mise à jour tâche:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Erreur:', error);
        return { data: null, error };
    }
};

export const deleteTask = async (taskId: string) => {
    try {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            console.error('Erreur suppression tâche:', error);
            return { error };
        }

        return { error: null };
    } catch (error) {
        console.error('Erreur:', error);
        return { error };
    }
};
