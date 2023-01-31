import { atom, action } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import { supabase, User } from '@utils/auth';
import { UserAppMetadata } from '@supabase/supabase-js';

export interface Profile {
  id?: string;
  updated_at?: Date;
  username?: string;
  xp?: number;
}
const primitive = {
  encode: JSON.stringify,
  decode: JSON.parse
};
export const isConnected = persistentAtom<boolean>('isConnected', false, primitive);
export const profile = persistentAtom<User | null>('user', null, primitive);

export const increasePoints = action(profile, 'increasePoints', (store, add) => {
  const user = store.get();
  if (user?.user_metadata) {
    user.user_metadata.xp = user.user_metadata.xp + add;
  }
  return store.get();
});

export const removeUser = action(profile, 'remove', (store) => {
  isConnected.set(false);
  store.set(null);
  return store.get();
});

export const setUser = action(profile, 'set', (store, user: User) => {
  store.set(user);
  isConnected.set(true);
  return store.get();
});

export const updateUser = action(profile, 'set', (store, data: UserAppMetadata) => {
  const user = profile.get();
  if (user) {
    user.user_metadata = data;
    store.set(user);
  }
  return store.get();
});

export const upsertProfile = async (profile: Profile) => {
  try {
    const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
    console.log('upsertProfile', data);

    if (!error) {
      updateUser(data);
    }
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};
