import type { ImageMetadata } from 'astro';
import portrait from '../assets/mira-portrait.jpg';
import koreaGroup from '../assets/korea-study-abroad.jpg';
import webtoonVisit from '../assets/korea-webtoon.jpg';

// Personal copy and study-abroad photos reviewed and approved by Mira.
interface PersonalPhoto {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export const personal: {
  music: string[];
  seoul: string[];
  travelPhotos: PersonalPhoto[];
  photo?: PersonalPhoto;
} = {
  music: [
    'Music has always been something I’ve wanted to make as well as listen to. I’ve played piano for around four years, picked up percussion in high school, and am now learning acoustic guitar. I still keep drumsticks and a practice pad around.',
    'My older brother introduced me to hip-hop, trap, and R&B, and I’ve always loved the heavy bass—the kind you feel through your headphones. That curiosity about sound has found its way into VoiceStudio Live, where I’m experimenting as I learn more about how music is made.',
  ],
  seoul: [
    'In summer 2024, I joined Cal Poly Pomona’s faculty-led study abroad program in South Korea, focused on entertainment, sports, and international business. Our visits to Naver, WEBTOON, and SBS offered a look behind the scenes at companies whose work reaches audiences around the world.',
    'Outside the planned visits, I loved meeting Korean locals and fellow travelers. Some of my favorite memories came from conversations on tours, in restaurants, and on nights out.',
  ],
  travelPhotos: [
    {
      src: koreaGroup,
      alt: 'Cal Poly Pomona study-abroad cohort wearing hanbok outside the main building of Cheong Wa Dae, the Blue House, in Seoul.',
      caption: 'Cheong Wa Dae (Blue House), Seoul · Summer 2024',
    },
    {
      src: webtoonVisit,
      alt: 'Study-abroad cohort posing together beneath a WEBTOON Entertainment presentation.',
      caption: 'Visiting WEBTOON with our CPP cohort',
    },
  ],
  photo: {
    src: portrait,
    alt: 'Mira Bhakta smiling against a light background.',
  },
};
