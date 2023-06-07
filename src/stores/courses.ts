import { action, atom } from 'nanostores';
import { supabase } from '@utils/supabase';
import { getUser } from '@stores/auth';
import { CoursesInfos } from '@models/courses';

export interface PayloadCourseTaken {
  course: string;
  slug: string;
  next?: string;
  courseInfo?: CoursesInfos;
  title?: string;
}
export interface CourseTaken {
  courseId: string;
  lessonId: string;
}
export interface LearningLesson {
  id: string;
  slug: string;
  title: string;
  course_id: string;
  updated_at: string;
}
export interface Learning {
  id: string;
  quantity: number;
  completed: boolean;
  user: string;
  created_at: string;
  title: string;
  slug: string;
  learning_lesson: LearningLesson[];
}

export const courseTaken = atom<Learning[]>([]);

export const getCourseTaken = action(courseTaken, 'setCourseTaken', async (store, userId: string) => {
  const data = await getLearningRecords(userId);
  store.set([...data]);
  return store.get();
});

export const setCourseTaken = action(courseTaken, 'setCourseTaken', async (store, payload: PayloadCourseTaken) => {
  /*
  const prevData = store.get();
  const { course: courseId, slug: lessonId } = payload;
  if (courseId && lessonId) {
    const isFound = prevData.find((c) => c.courseId === courseId && c.lessonId === lessonId);
    if (!isFound) {
      const data = { courseId, lessonId };
      prevData.push(data);
      store.set([...prevData]);
    }
  }
*/

  try {
    let user = await getUser();
    let res: boolean = false;
    if (user) {
      res = await saveCourse(user.id, payload);
    }
    return res;
  } catch (error) {}

  return false;

  return store.get();
});

export const resetCourse = action(courseTaken, 'resetCourse', (store, payload: PayloadCourseTaken) => {
  /*const prevData = store.get();
  const { course, slug } = payload;
  if (course && slug) {
    const filtered = prevData.filter((c) => !(c.courseId === course && c.lessonId === slug));
    store.set([...filtered]);
  }*/

  return store.get();
});

export const addCourse = async (profile: any) => {
  try {
    const { data, error } = await supabase.from('learning').insert(profile).select().single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * If answer is added && is the first time && is true = Add points
 * @param user
 * @param points
 */
export const saveCourse = async (userId: string, payload: PayloadCourseTaken) => {
  try {
    const { data: courseList, error } = await supabase.from('learning').select('id').eq('user', userId).eq('slug', payload.course);
    if (error) {
      throw error;
    }
    let courseId = courseList?.length ? courseList[0].id : null;
    if (!courseList.length) {
      const dataToSave = {
        created_at: new Date().toISOString(),
        quantity: payload?.courseInfo?.quantity,
        slug: payload.course,
        title: payload?.courseInfo?.title,
        user: userId
      };
      const { data: courseCreated, error } = await supabase.from('learning').insert(dataToSave).select().single();
      console.log('courseCreated', courseCreated);

      if (!error) {
        courseId = courseCreated.id;
      }
    }

    if (courseId) {
      await saveLesson(courseId, payload);
    } else {
      return false;
    }

    return true;
  } catch (error) {
    console.log('saveCourse error', error);
    throw error;
  }
};

export const saveLesson = async (courseId: string, payload: PayloadCourseTaken) => {
  const dataToSave = {
    // updated_at: new Date().toISOString(),
    slug: payload.slug,
    title: payload.title,
    course_id: courseId
  };
  try {
    const { data: lessonCreated, error } = await supabase.from('learning_lesson').upsert(dataToSave, { onConflict: 'course_id, slug' }).select().single();
    console.log('lessonCreated', lessonCreated);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
  return true;
};

export const getLearningRecords = async (userId: string): Promise<Learning[]> => {
  try {
    const { data, error } = await supabase.from('learning').select('*, learning_lesson(*)').eq('user', userId);

    if (error) {
      console.error(error);
      return [];
    } else {
      return data as Learning[];
    }
  } catch (error) {
    return [];
  }
};
