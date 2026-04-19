// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";

// // import campus1 from "../../../assets/hero/";
// // import campus2 from "../../../assets/hero/2.png";
// // import campus3 from "../../../assets/hero/3.png";
// // import campus4 from "../../../assets/hero/4.png";

// function HeroSection() {
// //   const images = [1, 2, 3, 4];
//   const images = [
//   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
//   "https://images.unsplash.com/photo-1562774053-701939374585",
//   "https://images.unsplash.com/photo-1509062522246-3755977927d7",
//   "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
// ];
//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 3500);

//     return () => clearInterval(interval);
//   }, [images.length]);

//   return (
//     <section className="relative overflow-hidden bg-white">
//       <div className="absolute left-0 top-0 h-28 w-28 rounded-br-full bg-[#4FD1C5]/25 sm:h-40 sm:w-40"></div>
//       <div className="absolute right-0 top-0 h-32 w-52 rounded-bl-[90px] bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] opacity-95 sm:h-48 sm:w-96 sm:rounded-bl-[120px]"></div>

//       <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2">
//         {/* Left side */}
//         <div className="relative z-10">
//           <p className="mb-3 inline-block rounded-full bg-[#DFF8F6] px-4 py-1 text-xs font-semibold text-[#0F766E] sm:text-sm">
//             Modern Campus Service Experience
//           </p>

//           <h2 className="mb-5 text-3xl font-extrabold leading-tight text-[#123A7A] sm:text-4xl lg:text-5xl">
//             Manage Campus
//             <br />
//             Resources, Bookings
//             <br />
//             & Maintenance
//           </h2>

//           <p className="mb-8 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
//             A unified platform for students, staff, and administrators to
//             request bookings, report incidents, monitor updates, and stay
//             informed through one clean smart campus portal.
//           </p>

//           <div className="flex flex-wrap gap-4">
//             <Link
//               to="/resources"
//               className="rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] sm:text-base"
//             >
//               Explore Resources
//             </Link>

//             <Link
//               to="/tickets"
//               className="rounded-full border border-[#123A7A] px-6 py-3 text-sm font-semibold text-[#123A7A] transition hover:bg-[#123A7A] hover:text-white sm:text-base"
//             >
//               View Tickets
//             </Link>
//           </div>
//         </div>

//         {/* Right side image slider box */}
//         <div className="relative z-10">
//           <div className="rounded-[28px] bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:p-5">
//             <div className="relative overflow-hidden rounded-[24px]">
//               {/* changing image */}
//               <img
//                 src={images[currentImage]}
//                 alt="Campus preview"
//                 className="h-[420px] w-full object-cover transition-all duration-700"
//               />

//               {/* dark/blue overlay */}
//               <div className="absolute inset-0 bg-gradient-to-br from-[#4FD1C5]/70 via-[#2F80ED]/45 to-[#123A7A]/55"></div>

//               {/* content over image */}
//               <div className="absolute inset-0 p-6 text-white sm:p-8">
//                 <p className="mb-2 text-xs uppercase tracking-[0.2em] opacity-95 sm:text-sm">
//                   Smart Campus Preview
//                 </p>

//                 <h3 className="mb-6 text-2xl font-bold leading-tight sm:text-3xl">
//                   Evolve Beyond Manual Processes
//                 </h3>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
//                     <p className="text-xl font-bold sm:text-2xl">24/7</p>
//                     <p className="text-xs opacity-90 sm:text-sm">Request Access</p>
//                   </div>

//                   <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
//                     <p className="text-xl font-bold sm:text-2xl">4+</p>
//                     <p className="text-xs opacity-90 sm:text-sm">Core Modules</p>
//                   </div>

//                   <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
//                     <p className="text-xl font-bold sm:text-2xl">Fast</p>
//                     <p className="text-xs opacity-90 sm:text-sm">Ticket Tracking</p>
//                   </div>

//                   <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
//                     <p className="text-xl font-bold sm:text-2xl">Role</p>
//                     <p className="text-xs opacity-90 sm:text-sm">Based Access</p>
//                   </div>
//                 </div>

//                 {/* slider dots */}
//                 <div className="mt-6 flex justify-center gap-2">
//                   {images.map((_, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() => setCurrentImage(index)}
//                       className={`h-2.5 w-2.5 rounded-full transition ${
//                         currentImage === index
//                           ? "bg-white"
//                           : "bg-white/50 hover:bg-white/80"
//                       }`}
//                     ></button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-5 grid grid-cols-2 gap-4">
//               <div className="rounded-2xl bg-[#F5F8FC] p-4">
//                 <p className="text-sm text-slate-500">Resource Requests</p>
//                 <p className="mt-1 text-lg font-bold text-[#123A7A] sm:text-xl">
//                   Smooth
//                 </p>
//               </div>

//               <div className="rounded-2xl bg-[#F5F8FC] p-4">
//                 <p className="text-sm text-slate-500">Maintenance Flow</p>
//                 <p className="mt-1 text-lg font-bold text-[#123A7A] sm:text-xl">
//                   Structured
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default HeroSection;




import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import campus1 from "../../../assets/hero/campus1.jpeg";
import campus2 from "../../../assets/hero/campus2.jpeg";
import campus3 from "../../../assets/hero/campus3.jpeg";
import campus4 from "../../../assets/hero/campus4.jpeg";
import campus5 from "../../../assets/hero/campus5.jpeg";

function HeroSection() {
const images = [campus1, campus2, campus3, campus4, campus5];
//   const images = [
//   "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
//   "https://images.unsplash.com/photo-1562774053-701939374585",
//   "https://images.unsplash.com/photo-1509062522246-3755977927d7",
//   "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a",
// ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute left-0 top-0 h-28 w-28 rounded-br-full bg-[#4FD1C5]/25 sm:h-40 sm:w-40"></div>
      <div className="absolute right-0 top-0 h-32 w-52 rounded-bl-[90px] bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] opacity-95 sm:h-48 sm:w-96 sm:rounded-bl-[120px]"></div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2">
        {/* Left side */}
        <div className="relative z-10">
          <p className="mb-3 inline-block rounded-full bg-[#DFF8F6] px-4 py-1 text-xs font-semibold text-[#0F766E] sm:text-sm">
            Modern Campus Service Experience
          </p>

          <h2 className="mb-5 text-3xl font-extrabold leading-tight text-[#123A7A] sm:text-4xl lg:text-5xl">
            Manage Campus
            <br />
            Resources, Bookings
            <br />
            & Maintenance
          </h2>

          <p className="mb-8 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            A unified platform for students, staff, and administrators to
            request bookings, report incidents, monitor updates, and stay
            informed through one clean smart campus portal.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/resources"
              className="rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] sm:text-base"
            >
              Explore Resources
            </Link>

            <Link
              to="/tickets"
              className="rounded-full border border-[#123A7A] px-6 py-3 text-sm font-semibold text-[#123A7A] transition hover:bg-[#123A7A] hover:text-white sm:text-base"
            >
              View Tickets
            </Link>
          </div>
        </div>

        {/* Right side - photo only */}
        <div className="relative z-10">
          <div className="rounded-[28px] bg-white p-4 shadow-2xl ring-1 ring-slate-200 sm:p-5">
            <div className="relative overflow-hidden rounded-[24px]">
              <img
                src={images[currentImage]}
                alt="Campus preview"
                className="h-[420px] w-full object-cover transition-all duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-br from-[#4FD1C5]/25 via-[#2F80ED]/15 to-[#123A7A]/20"></div>

              {/* slider dots only */}
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentImage(index)}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      currentImage === index
                        ? "bg-white"
                        : "bg-white/60 hover:bg-white/90"
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;