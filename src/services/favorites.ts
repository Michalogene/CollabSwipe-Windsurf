import { supabase } from './supabase';
import { Profile } from './profiles';
import { Project } from './projects';

export interface FavoriteItem {
    id: string;
    type: 'profile' | 'project';
    data: Profile | Project;
    created_at: string;
}

export const getUserFavorites = async (userId: string): Promise<FavoriteItem[]> => {
    try {
        // Fetch swipes where action is 'like' or 'super_like'
        const { data: swipes, error } = await supabase
            .from('swipes')
            .select(`
        id,
        action,
        created_at,
        swiped_id,
        project_id,
        profile:swiped_id (
          id, first_name, last_name, avatar_url, activity, location, skills
        ),
        project:project_id (
          id, title, description, collaboration_type, required_skills, status
        )
      `)
            .eq('swiper_id', userId)
            .in('action', ['like', 'super_like']);

        if (error) {
            console.error('Error fetching favorites:', error);
            return [];
        }

        // Transform into a unified list
        const favorites: FavoriteItem[] = swipes.map(swipe => {
            if (swipe.project_id && swipe.project) {
                return {
                    id: swipe.id,
                    type: 'project',
                    data: swipe.project,
                    created_at: swipe.created_at
                };
            } else if (swipe.swiped_id && swipe.profile) {
                return {
                    id: swipe.id,
                    type: 'profile',
                    data: swipe.profile,
                    created_at: swipe.created_at
                };
            }
            return null;
        }).filter(item => item !== null) as FavoriteItem[];

        return favorites;
    } catch (error) {
        console.error('Unexpected error fetching favorites:', error);
        return [];
    }
};
