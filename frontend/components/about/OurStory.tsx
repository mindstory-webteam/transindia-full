"use client"

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Image from "next/image";
import gsap from 'gsap';

const checkItems = [
  { id: 1, text: "IRDAI-licensed for both Life & General insurance broking" },
  { id: 2, text: "Incorporated July 2006 — over 18 years of trusted service" },
  { id: 3, text: "100% independent broker — we work for you, not insurers" },
  { id: 4, text: "Dedicated claims assistance at no extra cost" },
];

export default function OurStory() {
  return (
    <>
      <style>{CSS}</style>
      <section className="our-story-section">
        <div className="our-story-container">
          {/* Badge */}
          <div className="our-story-badge">Our Story</div>

          {/* Heading */}
          <h2 className="our-story-heading">
            <span className="heading-dark">Risk Management,</span>
            <span className="heading-primary">Done Right</span>
          </h2>

          {/* Body paragraphs */}
          <div className="our-story-body">
            <p>
              Risk Management, which is very much in practice in Western
              countries, was seriously felt in the Indian Insurance Market during
              early 2000. When the Government of India announced privatization in
              the Insurance Industry, it formed the Insurance Regulatory and
              Development Authority of India (IRDAI) to address negligible
              insurance penetration among the public.
            </p>
            <p>
              Insurance products are intangible and legalistic. Insurance
              Companies were eager to accept policies without proper Risk
              Assessment — leading to inordinate claim delays and refusals on
              technical grounds. This is precisely the gap TransIndia was built
              to bridge.
            </p>
            <p>
              IRDAI introduced the concept of Broking in 2002, as practiced in
              Western countries.{" "}
              <strong>Transindia Insurance Brokers (India) Pvt. Ltd.</strong>,
              incorporated in July 2006, has since been a licensed insurance
              intermediary — fully concerned about the risks and wellbeing of
              all patrons, associates, and well-wishers.
            </p>
          </div>

          {/* Check items grid */}
          <div className="check-items-grid">
            {checkItems.map((item) => (
              <div key={item.id} className="check-item">
                <span className="check-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9.5L7 13.5L15 5" stroke="#00b8c4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="check-text">{item.text}</span>
              </div>
            ))}
          </div>

          <CoreValuesSection />
        </div>
      </section>
    </>
  );
}

const CSS = `
  .our-story-section {
    background-color: #F8FAFF;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120px 20px 90px 80px;
    font-family: 'matterregular', sans-serif;
  }

  .our-story-container {
    width: 100%;
    max-width: 1500px;
    padding: 0 80px;
    box-sizing: border-box;
  }

  .our-story-badge {
    display: inline-block;
    background-color: #e0f4f4;
    color: #00b8c4;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 20px;
    margin-bottom: 28px;
  }

  .our-story-heading {
    margin: 0 0 48px 0;
    font-family: var(--font-sora), "Sora", sans-serif;
    line-height: 1.1;
  }

  .heading-dark {
    display: block;
    font-size: 38px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -1px;
  }

  .heading-primary {
    display: block;
    font-size: 38px;
    font-weight: 800;
    color: #00b8c4;
    letter-spacing: -1px;
  }

  .our-story-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 52px;
    max-width: 1400px;
  }

  .our-story-body p {
    margin: 0;
    font-size: 16px;
    line-height: 1.75;
    color: #374151;
  }

  .our-story-body strong {
    font-weight: 700;
    color: #111827;
  }

  .check-items-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 80px;
    max-width: 900px;
    margin-bottom: 60px;
  }

  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    animation: slideInLeft 0.6s ease-out forwards;
    opacity: 0;
  }

  .check-item:nth-child(1) { animation-delay: 0.1s; }
  .check-item:nth-child(2) { animation-delay: 0.2s; }
  .check-item:nth-child(3) { animation-delay: 0.3s; }
  .check-item:nth-child(4) { animation-delay: 0.4s; }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .check-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 1px;
  }

  .check-text {
    font-size: 15px;
    line-height: 1.6;
    color: #374151;
  }

  /* Core Values Section */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .core-values-section {
    margin-top: 100px;
    padding: 60px 0;
    border-top: 2px solid #e5e7eb;
    animation: fadeInUp 0.8s ease-out;
  }

  .core-values-heading {
    font-family: var(--font-sora), "Sora", sans-serif;
    font-size: 38px;
    font-weight: 800;
    color: #111827;
    letter-spacing: -1px;
    
  }

  .core-values-wrapper {
    display: grid;
    grid-template-columns: 1fr 120px 1fr;
    gap: 0;
    align-items: center;
    position: relative;
    min-height: 550px;
  }

  .core-values-left {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-right: 40px;
  }

  .core-value-content {
    min-height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .core-value-title {
    font-family: var(--font-sora), "Sora", sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: #00b8c4;
    letter-spacing: -0.5px;
    margin: 0 0 20px 0;
    line-height: 1.3;
    min-height: auto;
  }

  .core-value-description {
    margin: 0;
    font-size: 15px;
    line-height: 1.8;
    color: #374151;
    font-family: 'matterregular', sans-serif;
    min-height: auto;
  }

  .core-values-spacer {
    width: 100%;
    background: linear-gradient(to right, transparent, #e5e7eb, transparent);
    height: 2px;
  }

  .core-values-right {
    position: relative;
    height: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective: 1000px;
    padding-left: 40px;
  }

  .card-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-image {
    position: absolute;
    width: 300px;
    height: 350px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 184, 196, 0.2);
    border: 3px solid #e0f4f4;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }

  .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-image.active {
    transform: scale(1) translateZ(0);
    opacity: 1;
    z-index: 10;
    box-shadow: 0 30px 80px rgba(0, 184, 196, 0.3);
  }

  .card-image.next {
    transform: translateX(100px) translateY(40px) scale(0.85) rotateZ(4deg);
    opacity: 0.5;
    z-index: 5;
  }

  .card-image.prev {
    transform: translateX(-100px) translateY(40px) scale(0.85) rotateZ(-4deg);
    opacity: 0.3;
    z-index: 3;
  }

  .core-values-indicators {
    display: flex;
    gap: 10px;
    margin-top: 40px;
  }

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #cbd5e1;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .indicator.active {
    background-color: #00b8c4;
    width: 32px;
    border-radius: 20px;
  }

  .indicator:hover {
    background-color: #00a0aa;
  }

  /* Fade animations */
  @keyframes fadeInTitle {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDesc {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .core-value-title {
    animation: fadeInTitle 0.5s ease-out;
  }

  .core-value-description {
    animation: fadeInDesc 0.6s ease-out 0.1s both;
  }

  /* Responsive */
  @media (max-width: 1366px) {
    .our-story-section { padding-top: 180px; }
  }

  @media (max-width: 1024px) {
    .our-story-section { padding-top: 180px; }
    .our-story-container { padding: 0 40px; }
    .heading-dark, .heading-primary { font-size: 42px; }
    .check-items-grid { gap: 20px 40px; }
    .core-values-section { margin-top: 60px; padding: 40px 0; }
    .core-values-heading { font-size: 32px; margin-bottom: 60px; }
    .core-values-wrapper { 
      grid-template-columns: 1fr 80px 1fr; 
      gap: 0;
      min-height: 450px;
    }
    .core-values-left { padding-right: 30px; gap: 24px; }
    .core-values-right { height: 450px; padding-left: 30px; }
    .card-image { width: 250px; height: 300px; }
    .card-image.next { transform: translateX(80px) translateY(30px) scale(0.85) rotateZ(4deg); }
    .card-image.prev { transform: translateX(-80px) translateY(30px) scale(0.85) rotateZ(-4deg); }
    .core-value-title { font-size: 22px; }
    .core-value-description { font-size: 14px; }
  }

  @media (max-width: 768px) {
    .our-story-section { padding: 130px 20px 60px; }
    .our-story-container { padding: 130px 20px 0px 20px; }
    .heading-dark, .heading-primary { font-size: 32px; }
    .check-items-grid { grid-template-columns: 1fr; gap: 16px; margin-bottom: 40px; }
    .core-values-section { margin-top: 40px; padding: 30px 0; }
    .core-values-heading { font-size: 28px; margin-bottom: 40px; }
    .core-values-wrapper { 
      grid-template-columns: 1fr; 
      gap: 40px;
      min-height: auto;
    }
    .core-values-left { padding-right: 0; gap: 24px; }
    .core-values-right { height: 400px; padding-left: 0; }
    .card-image { width: 220px; height: 280px; }
    .card-image.next { transform: translateX(60px) translateY(30px) scale(0.85) rotateZ(4deg); }
    .card-image.prev { transform: translateX(-60px) translateY(30px) scale(0.85) rotateZ(-4deg); }
    .core-value-title { font-size: 20px; }
    .core-value-description { font-size: 13px; }
    .core-value-content { min-height: 280px; }
  }

  @media (max-width: 480px) {
    .core-values-wrapper { gap: 30px; }
    .core-values-right { height: 330px; }
    .card-image { width: 180px; height: 230px; }
    .card-image.next { transform: translateX(50px) translateY(25px) scale(0.85) rotateZ(4deg); }
    .card-image.prev { transform: translateX(-50px) translateY(25px) scale(0.85) rotateZ(-4deg); }
    .core-values-heading { font-size: 24px; }
    .core-value-title { font-size: 18px; margin-bottom: 16px; }
    .core-value-description { font-size: 12px; }
    .core-value-content { min-height: 240px; }
    .core-values-left { gap: 20px; }
    .core-values-indicators { gap: 8px; }
  }
`;

interface CoreValue {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const coreValues: CoreValue[] = [
  {
    title: "Performing in Order to Surpass Excellence",
    description:
      "Performing in order to surpass excellence. We believe that achieving excellence is just a milestone in the journey to destiny. We trust in striving for more than excellence in each and every endeavor we undertake.",
    imageSrc: "/images/cores/Albert_Einstein_Head_cleaned.jpg",
    imageAlt: "Performing in order to surpass excellence",
  },
  {
    title: "Building Trust and Transparency",
    description:
      "We have always operated with a focus on business ethics and we strongly believe that TRUST and TRANSPARENCY are the most important ingredients in any business relationship and the same is inculcated in all our operational process at every step.",
    imageSrc: "/images/cores/Nelson_Mandela_1994.jpg",
    imageAlt: "Building trust and transparency",
  },
  {
    title: "'Customer' is Regarded as Our King and 'Service', Our Queen",
    description:
      "Our customer is the pivot around which all our processes are built as we believe that the customer is the most important stakeholder of our business. We follow the golden principle — Customer First and think through by putting ourselves in our customers' shoes. We constantly rethink and innovate products, services, and capabilities focusing on customer delight.",
    imageSrc: "/images/cores/pencil_sketch_gandhiji_by_shivasha_ddut6vc-fullview.jpg",
    imageAlt: "Customer is our king",
  },
  {
    title: "Becoming a Preferred Employer",
    description:
      "We are committed to become the most preferred employer in the industry by providing an employee-friendly culture in our organizations and making sure that each individual feels comfortable in the workplace. We create a working environment that is compelling to the best staff and encourage them to perform better with ample career growth. We know success comes from encouraging people to think differently. Our culture promotes innovation and entrepreneurial drive with strong management backing.",
    imageSrc: "/images/cores/images.jpg",
    imageAlt: "Becoming a preferred employer",
  },
  {
    title: "Committed to the Betterment of Society",
    description:
      "Our responsibility towards society and human community is our primary interest. Our principle is First Humanity, then business. Every staff member understands this principle and are always bound towards our customers, patrons, employees, regulatory authorities, finance industry, and the nation, to do business with good moral and business ethics.",
    imageSrc: "/images/cores/nun-religious-clothes-christianity.jpg",
    imageAlt: "Committed to the betterment of society",
  },
];

function CoreValuesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);

  const currentValue = coreValues[currentIndex];
  const nextValue = coreValues[(currentIndex + 1) % coreValues.length];
  const prevValue = coreValues[(currentIndex - 1 + coreValues.length) % coreValues.length];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
    startAutoRotate();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % coreValues.length);
  };

  const startAutoRotate = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
    }
    autoRotateRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coreValues.length);
    }, 5000);
  };

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, []);

  return (
    <div className="core-values-section">
      {/* Heading */}
      <h2 className="core-values-heading">Our Core Values</h2>

      {/* Main Content */}
      <div className="core-values-wrapper">
        {/* Left Side - Content */}
        <div className="core-values-left">
          <div className="core-value-content">
            <h3 className="core-value-title">{currentValue.title}</h3>
            <p className="core-value-description">{currentValue.description}</p>
          </div>

          {/* Indicators */}
          <div className="core-values-indicators">
            {coreValues.map((_, idx) => (
              <div
                key={idx}
                className={`indicator ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="core-values-spacer"></div>

        {/* Right Side - Rotating Images */}
        <div className="core-values-right">
          <div className="card-container">
            {/* Previous */}
            <div className="card-image prev">
              <Image
                src={prevValue.imageSrc}
                alt={prevValue.imageAlt}
                fill
                className="object-cover"
              />
            </div>

            {/* Current/Active */}
            <div className="card-image active">
              <Image
                src={currentValue.imageSrc}
                alt={currentValue.imageAlt}
                fill
                className="object-cover"
              />
            </div>

            {/* Next */}
            <div className="card-image next">
              <Image
                src={nextValue.imageSrc}
                alt={nextValue.imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}