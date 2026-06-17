import React from "react";

const WhyLifeInsurance: React.FC = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* LEFT */}
          <div className="flex-1 max-w-2xl">
            <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-4">
              WHY LIFE INSURANCE?
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              One decision that protects
              <br />
              <span className="text-orange-500">everything</span>{" "}
              <span className="text-cyan-500">you've built</span>
            </h2>

            <div className="space-y-5 text-slate-700 text-base leading-relaxed">
              <p>
                With the pandemic and untimely death of sole breadwinners of
                many Indian families, more and more people have begun to
                realise how insurance policies act as a safety net. Sensing
                this, did you know that several insurers have introduced
                innovative new-age plans that offer a return of all the
                premiums paid if the policyholder outlives the policy.
              </p>

              <p>
                However, while estimating the ideal life insurance cover, one
                needs to account for different factors. For instance, if you
                have accumulated debts, it can be difficult for your family
                to pay the EMIs in your absence. One might have to set aside
                funds for children&rsquo;s higher education.
              </p>

              <p>
                While all of us agree that inflation is an important factor
                and how does one account for it? These and more such
                concerns are handled by our risk managers daily.
              </p>

              <p>
                Allow them to guide you towards a life insurance cover that
                serves you best.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="/images/services/life.svg"
              alt="Insurance policy handshake"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyLifeInsurance;