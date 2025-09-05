export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectSpecs {
  system: string;
  foundations: string;
  structure: string;
  roof?: string;
  normative: string;
}

export interface BaseProject {
  id: string;
  title: string;
  architect: string;
  location: string;
  year: string;
  system: string;
  coverImage: ProjectImage;
  images: ProjectImage[];
  description: string;
  challenge: string;
  solution: string;
  result: string;
  specs: ProjectSpecs;
}

export interface ViviendasProject extends BaseProject {
  type: 'tradicional' | 'steelframe' | 'woodframe';
  area: string;
}

export interface NavesIndustrialesProject extends BaseProject {
  type: 'industrial';
  area: string;
}

export interface FuncionalProject extends BaseProject {
  type: 'comerciales' | 'depositos';
  area: string;
}

export type Project = ViviendasProject | NavesIndustrialesProject | FuncionalProject;
