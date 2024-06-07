// // pages/menu.js
// import Image from "next/image";
// import { Card } from "@nextui-org/react";

// export async function getServerSideProps() {
//   const res = await fetch("http://192.168.0.216/tf-lara/public/api/menu");
//   const data = await res.json();

//   return {
//     props: {
//       menu: data,
//     },
//   };
// }

// export default function MenuComp({ menu }) {
//   const days = Object.keys(menu);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Weekly Menu</h1>
//       {days.map((day) => (
//         <Card key={day} shadow bordered className="mb-8 p-4">
//           <h2 className="text-xl font-semibold mb-2">{day.toUpperCase()}</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <h3 className="text-lg font-semibold">Lunch</h3>
//               {menu[day].lunch.map((item, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <Image
//                     src={`http://192.168.0.216/tf-lara/public/assets/images/${item.food_image}`}
//                     alt={item.food_name}
//                     width={50}
//                     height={50}
//                     className="rounded-full mr-2"
//                   />
//                   <span>{item.food_name}</span>
//                 </div>
//               ))}
//               <p className="mt-2">Price: {menu[day].menu_price_lunch} BDT</p>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold">Dinner</h3>
//               {menu[day].dinner.map((item, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <Image
//                     src={`http://192.168.0.216/tf-lara/public/assets/images/${item.food_image}`}
//                     alt={item.food_name}
//                     width={50}
//                     height={50}
//                     className="rounded-full mr-2"
//                   />
//                   <span>{item.food_name}</span>
//                 </div>
//               ))}
//               <p className="mt-2">Price: {menu[day].menu_price_dinner} BDT</p>
//             </div>
//           </div>
//         </Card>
//       ))}
//     </div>
//   );
// }
