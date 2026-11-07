import type { ImageMetadata } from 'astro';
import portrait from '../assets/mira-portrait.jpg';

// Seoul details come from the master resume. Music interests and the portrait
// were supplied by Mira for this personal section.
interface PersonalPhoto {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export const personal: {
  music: string;
  seoul: string;
  photo?: PersonalPhoto;
} = {
  music: 'Outside of software, I’m into acoustic guitar, piano, and listening to music.',
  seoul: 'In summer 2024, I studied international business and marketing in Seoul. The faculty-led program explored global media markets and cross-cultural branding, with visits to Naver, WEBTOON, SBS, and SolBridge.',
  photo: {
    src: portrait,
    alt: 'Mira Bhakta smiling against a light background.',
  },
};
