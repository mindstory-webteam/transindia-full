import React from "react";
import Image from "next/image";

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

          {/* Mission & Vision Cards */}
          {/* <div className="cards-grid"> */}
            {/* Our Mission Card */}
            {/* <div className="card mission-card">
              <div className="card-icon mission-icon">
                <img src="/images/about/ourstory/target.svg" alt="Our Mission Target" />
              </div>
              <div className="card-content">
                <h3>Our Mission</h3>
                <p>
                  To be the most trusted insurance broker, protecting every
                  Indian family with the right cover at the right price.
                </p>
              </div>
            </div> */}

            {/* Our Vision Card */}
            {/* <div className="card vision-card">
              <div className="card-icon vision-icon">
                <img src="/images/about/ourstory/binoculars with eyes.svg" alt="Our Vision Binoculars" />
              </div>
              <div className="card-content">
                <h3>Our Vision</h3>
                <p>
                  A nation where no family faces financial ruin due to lack of
                  proper insurance coverage.
                </p>
              </div>
            </div> */}
          {/* </div> */}
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
  }

  .check-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
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

  /* Cards */
  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 52px;
  }

  .card {
    border-radius: 16px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .mission-card {
    background-color: #d8f0d8;
  }

  .vision-card {
    background-color: #cff0f0;
  }

  .card-icon {
    flex-shrink: 0;
    width: 150px;
    height: 150px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    box-sizing: border-box;
  }

  .mission-icon {
    background-color: #A4E2A0;
  }

  .vision-icon {
    background-color: #92DAE2;
    padding: 0;
  }

  .vision-icon img {
    object-position: left bottom;
    border-radius: 16px;
  }

  .card-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .card-content {
    padding: 8px 16px 8px 0;
  }

  .card-content h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .card-content p {
    margin: 0;
    font-size: 15px;
    line-height: 1.65;
    color: #374151;
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
    .card { flex-direction: column; align-items: flex-start; padding: 10px; }
    .card-icon { width: 100%; height: 200px; padding: 20px; }
    .card-icon img, .vision-icon img { object-position: center; }
    .card-content { padding: 8px 10px; }
  }

  @media (max-width: 768px) {
    .our-story-section { padding: 130px 20px 60px; }
    .our-story-container { padding:130px 20px 0px 20px; }
    .heading-dark, .heading-primary { font-size: 32px; }
    .check-items-grid { grid-template-columns: 1fr; }
    .cards-grid { grid-template-columns: 1fr; }
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
    imageSrc: "/images/about/ourstory/albert.png",
    imageAlt: "Performing in order to surpass excellence",
  },
  {
    title: "Building Trust and Transparency",
    description:
      "We have always operated with a focus on business ethics and we strongly believe that TRUST and TRANSPARENCY are the most important ingredients in any business relationship and the same is inculcated in all our operational process at every step.",
    imageSrc: "/images/about/ourstory/nelson.png",
    imageAlt: "Building trust and transparency",
  },
  {
    title: "'Customer' is Regarded as Our King and 'Service', Our Queen",
    description:
      "Our customer is the pivot around which all our processes are built as we believe that the customer is the most important stakeholder of our business. We follow the golden principle — Customer First and think through by putting ourselves in our customers' shoes. We constantly rethink and innovate products, services, and capabilities focusing on customer delight.",
    imageSrc: "/images/about/ourstory/gandhiji.png",
    imageAlt: "Customer is our king",
  },
  {
    title: "Becoming a Preferred Employer",
    description:
      "We are committed to become the most preferred employer in the industry by providing an employee-friendly culture in our organizations and making sure that each individual feels comfortable in the workplace. We create a working environment that is compelling to the best staff and encourage them to perform better with ample career growth. We know success comes from encouraging people to think differently. Our culture promotes innovation and entrepreneurial drive with strong management backing.",
    imageSrc: "/images/about/ourstory/Timcook.png",
    imageAlt: "Becoming a preferred employer",
  },
  {
    title: "Committed to the Betterment of Society",
    description:
      "Our responsibility towards society and human community is our primary interest. Our principle is First Humanity, then business. Every staff member understands this principle and are always bound towards our customers, patrons, employees, regulatory authorities, finance industry, and the nation, to do business with good moral and business ethics.",
    imageSrc: "/images/about/ourstory/Teresa.png",
    imageAlt: "Committed to the betterment of society",
  },
];

function CoreValuesSection() {
  return (
    <div className="mt-20 max-w-[1400px]">
      {/* Heading */}
      <h2 className="heading-dark mb-10">
        Our Core Values
      </h2>

      {/* Values list */}
      <div className="flex flex-col">
        {coreValues.map((value, idx) => (
          <div key={value.title} className={`flex flex-col sm:flex-row gap-6 sm:gap-8 py-8 ${idx !== 0 ? 'border-t border-gray-200' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] overflow-hidden rounded-full shadow-sm">
                <Image
                  src={value.imageSrc}
                  alt={value.imageAlt}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0 pt-1 sm:pt-3">
              <h3 className="text-[12px] sm:text-[14px] font-[700] uppercase tracking-wider text-[#00b8c4] mb-2 sm:mb-3">
                {value.title}
              </h3>
              <p className="text-[14px] sm:text-[15px] leading-[1.65] text-[#374151] m-0">
                {value.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
