// Typed CV shape. Intentionally empty: content comes from LinkedIn later and is reviewed
// by Philipp before it is published. Do not invent entries.
export interface CvExperience {
  company: string;
  role: string;
  start: string;
  end?: string;
  description?: string;
}

export interface CvEducation {
  institution: string;
  degree: string;
  start: string;
  end?: string;
  description?: string;
}

export interface CvSkillGroup {
  group: string;
  items: string[];
}

export interface Cv {
  experience: CvExperience[];
  education: CvEducation[];
  skills: CvSkillGroup[];
}

export const cv: Cv = {
  experience: [],
  education: [],
  skills: [],
};
