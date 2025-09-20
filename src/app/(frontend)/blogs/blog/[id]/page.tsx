import MagicBento, { BentoCardProps } from "@/components/ui/bento";
import { Hero } from '@/components/ui/hero';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import TextType from "@/components/ui/TextType";
import ParticleCard from '@/components/ui/particleCard';
import InfiniteScroll from "@/components/ui/infiniteCarousel";

export default function BlogPage() {
  const cardData: BentoCardProps[] = [
    {
      color: '#060010',
      title: 'Analytics',
      description: 'Track user behavior',
      label: 'Insights'
    },
    {
      color: '#060010',
      title: 'Dashboard',
      description: 'Centralized data view',
      label: 'Overview'
    },
    {
      color: '#060010',
      title: 'Collaboration',
      description: 'Work together seamlessly',
      label: 'Teamwork'
    },
    {
      color: '#060010',
      title: 'Automation',
      description: 'Streamline workflows',
      label: 'Efficiency'
    },
    {
      color: '#060010',
      title: 'Integration',
      description: 'Connect favorite tools',
      label: 'Connectivity'
    },
    {
      color: '#060010',
      title: 'Security',
      description: 'Enterprise-grade protection',
      label: 'Protection'
    }
  ];
  const horizontalItems = [
  { content: "Text Item 1" },
  { content: <p>Paragraph Item 2</p> },
  { content: "Text Item 3" },
  { content: <p>Paragraph Item 4</p> },
  { content: "Text Item 5" },
  { content: <p>Paragraph Item 6</p> },
  { content: "Text Item 7" },
  { content: <p>Paragraph Item 8</p> },
  { content: "Text Item 9" },
  { content: <p>Paragraph Item 10</p> },
  { content: "Text Item 11" },
  { content: <p>Paragraph Item 12</p> },
  { content: "Text Item 13" },
  { content: <p>Paragraph Item 14</p> },
];
  return (
    <>
    {/* Hero/Title Section with Type Text animation */}
      <h1 className="leading-tight text-4xl lg:text-6xl lg:leading-tight font-bold my-20 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-slate-300 text-center ">
        <TextType 
        text={["TECH-NEST Blogs", "Cybersecurity Unleashed", "AI Revolution", "Tech Insights", "Digital Frontiers", "Code. Create. Innovate."]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="_"
        />
      </h1>
      {/* Grid Section for the latest blog posts */}
      <MagicBento 
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={true}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="87, 238, 255"
      />
      <h2 className="col-span-full text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r text-accent my-20 bg-clip-text text-center">
        Dive into the Digital Frontier
        <span className="block text-lg md:text-xl mt-2 font-normal text-slate-300">
          Fresh insights & cutting-edge perspectives
        </span>
      </h2>
      {/* We should put the genres here which will be a infinite scroll and users can filter by genres like AI, cybersecurity, How-to */}
      <div className="container mx-auto my-20">
        <InfiniteScroll
        direction="horizontal"
        height="auto"
        fullScreenWidth={false}
        autoplayOnView={false}
        items={horizontalItems}
        />
      </div>
      {/* Card Section for blog posts: so here if the user selects a genre, we are going to show the filtered posts, otherwise all blog posts will be shown. We need to add pagination here once blog numbers grow to 25. each page will show a maximum of 12 posts. */}
      <div className="my-20">
        <div className="flex-wrap gap-4 justify-center card-responsive mx-auto container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cardData.map((card, index) => (
          <ParticleCard
            key={index} 
            className="min-h-[200px] aspect-[4/3] border border-solid rounded-[20px] p-4 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
            enableBorderGlow={true}
            enableTilt={false}
            clickEffect={true}
            enableMagnetism={true}
            particleCount={12}
            glowColor="87, 238, 255"
          >
            <h3 className="text-white font-normal text-base mb-1">My Card Title</h3>
            <p className="text-white text-xs leading-5 opacity-90">Card content goes here</p>
          </ParticleCard>
        ))}
        </div>
      </div>
    </>
  )
}